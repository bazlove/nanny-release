// P0: reliable contact-form acknowledgement for Google Apps Script Web App.
// The GAS response is delivered through a hidden iframe + postMessage because
// a no-cors fetch only yields an opaque response that cannot confirm backend success.
(function contactFormReliableSubmit(){
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyUhl5Vc9r_kDgzYpx96iuvGLXPql9Y4XtKyPrtMtePRw2Tlsrhvp6x_-ktyr1uiE12/exec';
  const TELEGRAM_URL = 'https://t.me/katebazlova';
  const RESPONSE_TYPE = 'nanny-contact-result';
  const TIMEOUT_MS = 20000;

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

  function isTrustedGasOrigin(origin){
    try {
      const url = new URL(origin);
      return url.protocol === 'https:' && (
        url.hostname === 'script.google.com' ||
        url.hostname.endsWith('script.googleusercontent.com')
      );
    } catch (_) {
      return false;
    }
  }

  function appendHidden(formEl, name, value){
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value ?? '');
    formEl.appendChild(input);
  }

  function submitViaIframe(fd, clientNonce){
    return new Promise((resolve, reject) => {
      const frameName = `contactGas_${clientNonce.replace(/[^a-zA-Z0-9_-]/g, '')}`;
      const iframe = document.createElement('iframe');
      iframe.name = frameName;
      iframe.hidden = true;
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('tabindex', '-1');

      const relay = document.createElement('form');
      relay.method = 'POST';
      relay.action = GAS_URL;
      relay.target = frameName;
      relay.style.display = 'none';
      relay.setAttribute('aria-hidden', 'true');

      for (const [key, value] of fd.entries()) {
        if (typeof value === 'string') appendHidden(relay, key, value);
      }
      appendHidden(relay, 'response_mode', 'postmessage');
      appendHidden(relay, 'client_nonce', clientNonce);

      let settled = false;
      let timer;

      const cleanup = () => {
        window.removeEventListener('message', onMessage);
        if (timer) clearTimeout(timer);
        relay.remove();
        iframe.remove();
      };

      const finish = (fn, value) => {
        if (settled) return;
        settled = true;
        cleanup();
        fn(value);
      };

      const onMessage = (event) => {
        if (!isTrustedGasOrigin(event.origin)) return;
        const data = event.data;
        if (!data || data.type !== RESPONSE_TYPE || data.clientNonce !== clientNonce) return;

        if (data.ok === true && data.requestId) {
          finish(resolve, data);
        } else {
          const err = new Error(data?.error || 'backend_failure');
          err.backend = data;
          finish(reject, err);
        }
      };

      window.addEventListener('message', onMessage);
      timer = setTimeout(() => finish(reject, new Error('backend_timeout')), TIMEOUT_MS);

      document.body.appendChild(iframe);
      document.body.appendChild(relay);
      relay.submit();
    });
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
      const result = await submitViaIframe(fd, clientNonce);

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
