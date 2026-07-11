document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  const dropdown = document.querySelector('.nav .dropdown');

  function closeMenu() {
    nav?.classList.remove('open');
    toggle?.classList.remove('open');
    document.body.classList.remove('menu-open');
    dropdown?.classList.remove('open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    nav.querySelectorAll('a[href]:not([href="#"])').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  if (dropdown) {
    const dropdownToggle = dropdown.querySelector(':scope > a');
    dropdownToggle?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-message');
      const data = Object.fromEntries(new FormData(form));

      if (!data.fullName || !data.email || !data.phone) {
        msg.className = 'form-message error';
        msg.textContent = 'Please fill in all required fields.';
        return;
      }
      if (!data.consent) {
        msg.className = 'form-message error';
        msg.textContent = 'Please agree to the consent terms to continue.';
        return;
      }

      const tsField = form.querySelector('#consentTimestamp');
      if (tsField) tsField.value = new Date().toISOString();

      const params = new URLSearchParams(window.location.search);
      const srcField = form.querySelector('#leadSource');
      if (srcField && params.get('utm_source')) {
        srcField.value = params.get('utm_source');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        msg.className = 'form-message error';
        msg.textContent = 'Please enter a valid email address.';
        return;
      }

      msg.className = 'form-message success';
      msg.textContent = 'Thank you! Your enquiry has been received. We will contact you shortly.';
      form.reset();
    });
  }

  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 50
        ? '0 4px 20px rgba(0,0,0,0.1)' : '0 1px 12px rgba(0,0,0,0.06)';
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const whyCards = document.querySelectorAll('.why-card');
  if (whyCards.length) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      whyCards.forEach((card) => {
        card.classList.add('is-visible', 'is-settled');
      });
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const card = entry.target;
            card.classList.add('is-visible');
            card.addEventListener(
              'animationend',
              () => card.classList.add('is-settled'),
              { once: true }
            );
            observer.unobserve(card);
          });
        },
        { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
      );
      whyCards.forEach((card) => observer.observe(card));
    }
  }
});
