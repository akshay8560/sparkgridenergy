document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Testimonial slider
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots button');
  let currentSlide = 0;

  function showSlide(index) {
    cards.forEach((card, i) => card.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentSlide = index;
  }

  if (cards.length > 0) {
    showSlide(0);
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });
    setInterval(() => {
      showSlide((currentSlide + 1) % cards.length);
    }, 6000);
  }

  // Contact form handling
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-message');
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      if (!data.firstName || !data.lastName || !data.email || !data.phone) {
        msg.className = 'form-message error';
        msg.textContent = 'Please fill in all required fields.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        msg.className = 'form-message error';
        msg.textContent = 'Please enter a valid email address.';
        return;
      }

      msg.className = 'form-message success';
      msg.textContent = 'Thank you! Your submission has been received. We will contact you shortly.';
      form.reset();
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 50
        ? '0 4px 24px rgba(0,0,0,0.1)'
        : '0 2px 16px rgba(0,0,0,0.06)';
    });
  }

  // Active nav link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
