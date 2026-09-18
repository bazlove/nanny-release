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
  const submitBtn = document.getElementById('contactSubmit');

  let inFlight = false;

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

  function validate(){
    const badName = !name?.value.trim() || name.value.trim().length < 3;
    const badContact = !contact?.value.trim();
    const badAgree = !agree?.checked;

    setFieldError(name, errName, badName);
    setFieldError(contact, errContact, badContact);
    agree?.classList.toggle('is-error', badAgree);

    const firstBad = badName ? name : badContact ? contact : badAgree ? agree : null;
    firstBad?.focus();
    return !firstBad;
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

  name?.addEventListener('input', () => setFieldError(name, errName, false));
  contact?.addEventListener('input', () => setFieldError(contact, errContact, false));
  agree?.addEventListener('change', () => agree.classList.remove('is-error'));

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
        submitBtn.textContent = originalLabel || (lang() === 'sr' ? 'Pošalji zahtev' : 'Отправить запрос');
      }
    }
  }, true);
})();
