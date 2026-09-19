// P0: reliable contact-form acknowledgement for Google Apps Script Web App.
// The browser reads the backend JSON response and reports success only after ok:true.
(function contactFormReliableSubmit(){
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyUhl5Vc9r_kDgzYpx96iuvGLXPql9Y4XtKyPrtMtePRw2Tlsrhvp6x_-ktyr1uiE12/exec';
  const TELEGRAM_URL = 'https://t.me/katebazlova';
  const TIMEOUT_MS = 30000;

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

  function lang(){
    return window.i18n?.lang === 'sr' ? 'sr' : 'ru';
  }

  function text(key){
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

  function setFieldError(el, hint, on){
    if (!el) return;
    el.classList.toggle('invalid', on);
    el.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (hint) hint.hidden = !on;
  }

  function setConsentError(on){
    if (!agree) return;
    agree.classList.toggle('is-error', on);
    agree.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (errConsent) errConsent.hidden = !on;
  }

  function getValidationErrors(){
    const errors = {};
    const nameValue = name?.value.trim() || '';
    const contactValue = contact?.value.trim() || '';

    if (nameValue.length < 2) errors.name = true;
    if (!contactValue) errors.contact = true;
    if (!agree?.checked) errors.consent = true;

    return errors;
  }

  function renderValidation(errors, focusFirst = false){
    setFieldError(name, errName, Boolean(errors.name));
    setFieldError(contact, errContact, Boolean(errors.contact));
    setConsentError(Boolean(errors.consent));

    if (!focusFirst) return;
    const firstBad = errors.name ? name : errors.contact ? contact : errors.consent ? agree : null;
    firstBad?.focus();
  }

  function validate(){
    validationActive = true;
    const errors = getValidationErrors();
    renderValidation(errors, true);
    return Object.keys(errors).length === 0;
  }

  function clearFieldError(field){
    if (!validationActive) return;
    if (field === 'name') setFieldError(name, errName, false);
    if (field === 'contact') setFieldError(contact, errContact, false);
  }

  function revalidateField(field){
    if (!validationActive) return;
    const errors = getValidationErrors();

    if (field === 'name') setFieldError(name, errName, Boolean(errors.name));
    if (field === 'contact') setFieldError(contact, errContact, Boolean(errors.contact));
    if (field === 'consent') setConsentError(Boolean(errors.consent));
  }

  async function submitToBackend(fd, clientNonce){
    fd.set('response_mode', 'json');
    fd.set('client_nonce', clientNonce);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: fd,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`backend_http_${response.status}`);
      }

      const data = await response.json();

      if (!data || data.clientNonce !== clientNonce) {
        throw new Error('backend_nonce_mismatch');
      }

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

  name?.addEventListener('pointerdown', () => clearFieldError('name'));
  contact?.addEventListener('pointerdown', () => clearFieldError('contact'));
  name?.addEventListener('input', () => clearFieldError('name'));
  contact?.addEventListener('input', () => clearFieldError('contact'));
  name?.addEventListener('blur', () => revalidateField('name'));
  contact?.addEventListener('blur', () => revalidateField('contact'));
  agree?.addEventListener('change', () => revalidateField('consent'));

  // Capture phase intentionally supersedes the legacy no-cors submit listener in app.js.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (inFlight) return;
    if (!validate()) return;

    const hp = form.querySelector('[name="website"]');
    if (hp?.value) return;

    inFlight = true;
    const originalLabel = submitBtn?.textContent || '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.textContent = text('sending');
    }
    form.setAttribute('aria-busy', 'true');
    if (note) note.textContent = '';

    const clientNonce = (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`);
    const fd = new FormData(form);

    try {
      const result = await submitToBackend(fd, clientNonce);

      if (note) note.textContent = text('success');
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

      if (note) {
        note.textContent = `${text('failure')} `;
        const link = document.createElement('a');
        link.href = TELEGRAM_URL;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Telegram';
        note.appendChild(link);
        note.appendChild(document.createTextNode('.'));
      }

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
})();
