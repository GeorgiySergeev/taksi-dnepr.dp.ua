import AOS from 'aos';
import 'aos/dist/aos.css';

export function initApp() {
  setFooterYear();
  initCtaTracking();
  initCopyPhoneRich();
  initStickyCta();
  initAos();
}

function initAos() {
  const options = {
    duration: 500,
    offset: 80,
    once: true,
    easing: 'ease-out',
    startEvent: 'load',
  };

  const start = () => {
    AOS.init(options);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        AOS.refreshHard();
      });
    });
  };

  if (document.readyState === 'complete') {
    start();
    return;
  }

  window.addEventListener('load', start, { once: true });
}

function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

function initCtaTracking() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const ctaEl = target.closest('[data-cta], a[href^="tel:"]');
    if (!(ctaEl instanceof HTMLElement)) return;

    const href = ctaEl instanceof HTMLAnchorElement ? ctaEl.getAttribute('href') || '' : '';
    const action = ctaEl.dataset.cta || (href.startsWith('tel:') ? 'phone-call' : 'cta-click');

    trackEvent('cta_click', {
      action,
      href,
    });
  });
}

function initCopyPhone() {
  const copyButtons = document.querySelectorAll('[data-copy-phone]');
  for (const button of copyButtons) {
    button.addEventListener('click', async () => {
      const phoneRaw = button.getAttribute('data-copy-phone') || '';
      const phoneDisplay = normalizePhone(phoneRaw);
      const copied = await copyToClipboard(phoneDisplay);
      if (!copied) return;
      trackEvent('phone_copied', { phone: phoneDisplay });
      button.textContent = 'Скопировано';
      window.setTimeout(() => {
        button.textContent = button.classList.contains('s-copy') ? 'Копировать номер' : 'Скопировать номер';
      }, 1500);
    });
  }
}

function initCopyPhoneRich() {
  const copyButtons = document.querySelectorAll('[data-copy-phone]');

  for (const button of copyButtons) {
    button.addEventListener('click', async () => {
      const phoneRaw = button.getAttribute('data-copy-phone') || '';
      const phoneDisplay = normalizePhone(phoneRaw);
      const copied = await copyToClipboard(phoneDisplay);

      if (!copied) return;

      trackEvent('phone_copied', { phone: phoneDisplay });

      const labelEl = button.querySelector('[data-copy-label]');
      const defaultLabel =
        button.getAttribute('data-copy-default-label') ||
        (button.classList.contains('s-copy') ? 'Копировать номер' : 'Скопировать номер');
      const successLabel = button.getAttribute('data-copy-success-label') || 'Скопировано';

      button.classList.add('is-copied');

      if (labelEl) {
        labelEl.textContent = successLabel;
      } else {
        button.textContent = successLabel;
      }

      window.setTimeout(() => {
        button.classList.remove('is-copied');

        if (labelEl) {
          labelEl.textContent = defaultLabel;
        } else {
          button.textContent = defaultLabel;
        }
      }, 1500);
    });
  }
}

function initStickyCta() {
  const sticky = document.querySelector('.sticky');
  const header = document.querySelector('.hdr');

  if (!(sticky instanceof HTMLElement) || !(header instanceof HTMLElement)) {
    return;
  }

  const syncStickyVisibility = () => {
    const threshold = Math.max(header.offsetHeight + 24, 80);
    const shouldShow = window.scrollY > threshold;

    sticky.classList.toggle('is-visible', shouldShow);
  };

  syncStickyVisibility();
  window.addEventListener('scroll', syncStickyVisibility, { passive: true });
  window.addEventListener('resize', syncStickyVisibility);
}

function normalizePhone(value) {
  return value
    .replace(/\s+/g, '')
    .replace(/^\+380(\d{2})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');
}

async function copyToClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', 'true');
    temp.style.position = 'absolute';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(temp);
    return copied;
  }
}

function trackEvent(eventName, payload) {
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...payload });
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }
  if (typeof window.ym === 'function' && Number.isFinite(window.__YA_COUNTER_ID__)) {
    window.ym(window.__YA_COUNTER_ID__, 'reachGoal', eventName, payload);
  }
}
