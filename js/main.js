document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
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
});
