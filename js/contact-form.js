// Reliable form acknowledgement for Google Apps Script Web App.
// Both the standard contact form and the regular-schedule MVP reuse one confirmed JSON pipeline.
(function reliableFormsSubmit(){
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyUhl5Vc9r_kDgzYpx96iuvGLXPql9Y4XtKyPrtMtePRw2Tlsrhvp6x_-ktyr1uiE12/exec';
  const TELEGRAM_URL = 'https://t.me/katebazlova';
  const TIMEOUT_MS = 30000;

  function lang(){
    return window.i18n?.lang === 'sr' ? 'sr' : 'ru';
  }

  function i18nText(key, params){
    return window.i18n?.t?.(key, params) ?? window.I18N?.[lang()]?.[key] ?? key;
  }

  function contactText(key){
    const sr = {
      sending: 'Šaljem…',
      success: '✅ Zahtev je primljen. Odgovoriću vam uskoro.',
      failure: '❌ Zahtev nije potvrđen. Molim vas, pišite mi na Telegram.'
    };
    const ru = {
      sending: 'Отправляю…',
      success: '✅ Запрос принят. Я отвечу в ближайшее время.',
      failure: '❌ Отправка не подтверждена. Пожалуйста, напишите мне в Telegram.'
    };
    return (lang() === 'sr' ? sr : ru)[key];
  }

  function clientNonce(){
    return crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  }

  async function submitToBackend(fd, nonce){
    fd.set('response_mode', 'json');
    fd.set('client_nonce', nonce);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: fd,
        signal: controller.signal
      });

      if (!response.ok) throw new Error(`backend_http_${response.status}`);

      const data = await response.json();
      if (!data || data.clientNonce !== nonce) throw new Error('backend_nonce_mismatch');

      if (data.ok !== true || !data.requestId) {
        const err = new Error(data.error || 'backend_failure');
        err.backend = data;
        throw err;
      }

      return data;
    } catch (err) {
      if (err?.name === 'AbortError') throw new Error('backend_timeout');
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  function setFieldError(el, hint, on){
    if (!el) return;
    el.classList.toggle('invalid', on);
    el.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (hint) hint.hidden = !on;
  }

  function setCheckboxError(el, hint, on){
    if (!el) return;
    el.classList.toggle('is-error', on);
    el.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (hint) hint.hidden = !on;
  }

  function renderFailure(note, message){
    if (!note) return;
    note.textContent = `${message} `;
    const link = document.createElement('a');
    link.href = TELEGRAM_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Telegram';
    note.appendChild(link);
    note.appendChild(document.createTextNode('.'));
  }

  function bindContactForm(){
    const form = document.getElementById('contactForm');
    if (!form) return;

    const note = document.getElementById('contactNotice');
    const name = document.getElementById('cname');
    const contact = document.getElementById('ccontact');
    const agree = document.getElementById('cagree');
    const errName = document.getElementById('err-name');
    const errContact = document.getElementById('err-contact');
    const errConsent = document.getElementById('err-consent');
    const submitBtn = document.getElementById('contactSubmit');

    let inFlight = false;
    let validationActive = false;

    if (note) {
      note.setAttribute('role', 'status');
      note.setAttribute('aria-live', 'polite');
    }

    function validationErrors(){
      const errors = {};
      if ((name?.value.trim() || '').length < 2) errors.name = true;
      if (!(contact?.value.trim() || '')) errors.contact = true;
      if (!agree?.checked) errors.consent = true;
      return errors;
    }

    function renderValidation(errors, focusFirst = false){
      setFieldError(name, errName, Boolean(errors.name));
      setFieldError(contact, errContact, Boolean(errors.contact));
      setCheckboxError(agree, errConsent, Boolean(errors.consent));

      if (!focusFirst) return;
      const firstBad = errors.name ? name : errors.contact ? contact : errors.consent ? agree : null;
      firstBad?.focus();
    }

    function validate(){
      validationActive = true;
      const errors = validationErrors();
      renderValidation(errors, true);
      return Object.keys(errors).length === 0;
    }

    function revalidate(field, clearOnly = false){
      if (!validationActive) return;
      const errors = clearOnly ? {} : validationErrors();
      if (field === 'name') setFieldError(name, errName, clearOnly ? false : Boolean(errors.name));
      if (field === 'contact') setFieldError(contact, errContact, clearOnly ? false : Boolean(errors.contact));
      if (field === 'consent') setCheckboxError(agree, errConsent, Boolean(errors.consent));
    }

    name?.addEventListener('pointerdown', () => revalidate('name', true));
    contact?.addEventListener('pointerdown', () => revalidate('contact', true));
    name?.addEventListener('input', () => revalidate('name', true));
    contact?.addEventListener('input', () => revalidate('contact', true));
    name?.addEventListener('blur', () => revalidate('name'));
    contact?.addEventListener('blur', () => revalidate('contact'));
    agree?.addEventListener('change', () => revalidate('consent'));

    // Capture phase intentionally supersedes the legacy no-cors submit listener in app.js.
    form.addEventListener('submit', async event => {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (inFlight || !validate()) return;
      if (form.querySelector('[name="website"]')?.value) return;

      inFlight = true;
      const originalLabel = submitBtn?.textContent || '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = contactText('sending');
      }
      form.setAttribute('aria-busy', 'true');
      if (note) note.textContent = '';

      const nonce = clientNonce();
      const fd = new FormData(form);

      try {
        const result = await submitToBackend(fd, nonce);

        if (note) note.textContent = contactText('success');
        form.reset();
        window.RequestState?.reset({ source: 'contact-submit-success' });
        validationActive = false;
        renderValidation({}, false);

        window.gtag?.('event', 'contact_form_submit', {
          success: true,
          request_id: result.requestId
        });
      } catch (err) {
        console.error('Contact form backend confirmation failed:', err);
        renderFailure(note, contactText('failure'));

        window.gtag?.('event', 'contact_form_submit', {
          success: false,
          error: err?.message || 'unknown'
        });
      } finally {
        inFlight = false;
        form.removeAttribute('aria-busy');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.textContent = originalLabel || (lang() === 'sr' ? 'Pošalji zahtev' : 'Отправить запрос');
        }
      }
    }, true);
  }

  function bindRegularForm(){
    const form = document.getElementById('regularRequestForm');
    if (!form) return;

    const name = document.getElementById('regularName');
    const contact = document.getElementById('regularContact');
    const schedule = document.getElementById('regularSchedule');
    const agree = document.getElementById('regularAgree');
    const sourceInput = document.getElementById('regularRequestSource');
    const submitBtn = document.getElementById('regularSubmit');
    const note = document.getElementById('regularNotice');

    const errName = document.getElementById('regularErrName');
    const errContact = document.getElementById('regularErrContact');
    const errSchedule = document.getElementById('regularErrSchedule');
    const errConsent = document.getElementById('regularErrConsent');

    let inFlight = false;
    let validationActive = false;

    function validationErrors(){
      const errors = {};
      if ((name?.value.trim() || '').length < 2) errors.name = true;
      if (!(contact?.value.trim() || '')) errors.contact = true;
      if (!(schedule?.value.trim() || '')) errors.schedule = true;
      if (!agree?.checked) errors.consent = true;
      return errors;
    }

    function renderValidation(errors, focusFirst = false){
      setFieldError(name, errName, Boolean(errors.name));
      setFieldError(contact, errContact, Boolean(errors.contact));
      setFieldError(schedule, errSchedule, Boolean(errors.schedule));
      setCheckboxError(agree, errConsent, Boolean(errors.consent));

      if (!focusFirst) return;
      const firstBad = errors.name ? name
        : errors.contact ? contact
        : errors.schedule ? schedule
        : errors.consent ? agree
        : null;
      firstBad?.focus();
    }

    function validate(){
      validationActive = true;
      const errors = validationErrors();
      renderValidation(errors, true);
      return Object.keys(errors).length === 0;
    }

    function revalidate(field, clearOnly = false){
      if (!validationActive) return;
      const errors = clearOnly ? {} : validationErrors();
      if (field === 'name') setFieldError(name, errName, clearOnly ? false : Boolean(errors.name));
      if (field === 'contact') setFieldError(contact, errContact, clearOnly ? false : Boolean(errors.contact));
      if (field === 'schedule') setFieldError(schedule, errSchedule, clearOnly ? false : Boolean(errors.schedule));
      if (field === 'consent') setCheckboxError(agree, errConsent, Boolean(errors.consent));
    }

    name?.addEventListener('input', () => revalidate('name', true));
    contact?.addEventListener('input', () => revalidate('contact', true));
    schedule?.addEventListener('input', () => revalidate('schedule', true));
    name?.addEventListener('blur', () => revalidate('name'));
    contact?.addEventListener('blur', () => revalidate('contact'));
    schedule?.addEventListener('blur', () => revalidate('schedule'));
    agree?.addEventListener('change', () => revalidate('consent'));

    window.addEventListener('regular-request:open', () => {
      validationActive = false;
      renderValidation({}, false);
      if (note) note.textContent = '';
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (inFlight || !validate()) return;
      if (form.querySelector('[name="website"]')?.value) return;

      const source = sourceInput?.value;
      if (source !== 'slots' && source !== 'calculator') return;

      inFlight = true;
      const originalLabel = submitBtn?.textContent || '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = i18nText('regular_sending');
      }
      form.setAttribute('aria-busy', 'true');
      if (note) note.textContent = '';

      const nameValue = name?.value.trim() || '';
      const contactValue = contact?.value.trim() || '';
      const scheduleValue = schedule?.value.trim() || '';
      const sourceLabel = i18nText(source === 'slots' ? 'regular_source_slots' : 'regular_source_calculator');

      const message = [
        i18nText('regular_message_type'),
        i18nText('regular_message_source', { source: sourceLabel }),
        i18nText('regular_message_name', { name: nameValue }),
        i18nText('regular_message_contact', { contact: contactValue }),
        i18nText('regular_message_schedule', { schedule: scheduleValue })
      ].join('\n');

      const nonce = clientNonce();
      const fd = new FormData(form);
      fd.set('request_type', 'regular');
      fd.set('request_source', source);
      fd.set('preferred_time', scheduleValue);
      fd.set('message', message);

      try {
        const result = await submitToBackend(fd, nonce);

        if (note) note.textContent = i18nText('regular_success');
        form.reset();
        if (sourceInput) sourceInput.value = source;
        validationActive = false;
        renderValidation({}, false);

        window.gtag?.('event', 'regular_schedule_submit', {
          source,
          request_id: result.requestId
        });
      } catch (err) {
        console.error('Regular schedule request backend confirmation failed:', err);
        renderFailure(note, i18nText('regular_failure'));
      } finally {
        inFlight = false;
        form.removeAttribute('aria-busy');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.textContent = originalLabel || i18nText('regular_submit');
        }
      }
    }, true);
  }

  bindContactForm();
  bindRegularForm();
})();
