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

  // --- Thank You Modal Logic ---
  function initThankYouModal() {
    if (document.getElementById('thank-you-modal')) return;
    const modalHTML = `
      <div class="modal-overlay" id="thank-you-modal">
        <div class="modal-content">
          <button class="modal-close" onclick="closeThankYouModal()">&times;</button>
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 class="modal-title">Thank You!</h3>
          <p class="modal-desc">Your details have been successfully submitted. Our team will contact you shortly.</p>
          <button class="modal-btn" onclick="closeThankYouModal()">Continue</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  window.closeThankYouModal = function() {
    const modal = document.getElementById('thank-you-modal');
    if (modal) modal.classList.remove('active');
  };

  function showThankYouModal() {
    initThankYouModal();
    const modal = document.getElementById('thank-you-modal');
    if (modal) {
      // Small delay to ensure DOM is ready for transition
      setTimeout(() => modal.classList.add('active'), 10);
    }
  }

  // --- Google Sheets Submission Logic ---
  // IMPORTANT: Replace this URL with your Google Apps Script Web app URL!
  const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzFTLnNX2y4Fqq33a0RHgOZI1U7wXLPV_BDMRs5G9LjTqytVK5e5Mbdd-WtpSGLvQ19Ag/exec";

  function handleGenericFormSubmit(e, form) {
    e.preventDefault();
    const msg = form.querySelector('.form-message');
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
    const originalBtnText = submitBtn ? (submitBtn.innerText || submitBtn.value) : 'Submit';
    
    const data = Object.fromEntries(new FormData(form));
    const isEnquire = form.classList.contains('enquire-form');

    // Validation
    if (msg) {
      if (!data.fullName || !data.phone) {
        msg.className = 'form-message error';
        msg.textContent = 'Please fill in all required fields.';
        return;
      }
      if (!isEnquire && !data.email) {
        msg.className = 'form-message error';
        msg.textContent = 'Please fill in all required fields.';
        return;
      }
      if (isEnquire && (!data.service || !data.postcode)) {
        msg.className = 'form-message error';
        msg.textContent = 'Please fill in all required fields.';
        return;
      }
      if (form.querySelector('input[name="consent"]') && !data.consent) {
        msg.className = 'form-message error';
        msg.textContent = 'Please agree to the consent terms to continue.';
        return;
      }
    }

    const tsField = form.querySelector('#consentTimestamp');
    if (tsField) tsField.value = new Date().toISOString();

    const params = new URLSearchParams(window.location.search);
    const srcField = form.querySelector('#leadSource');
    if (srcField && params.get('utm_source')) {
      srcField.value = params.get('utm_source');
    }

    if (submitBtn) {
      if (submitBtn.innerText) submitBtn.innerText = 'Sending...';
      if (submitBtn.value) submitBtn.value = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    // Submit via POST to Google Apps Script
    fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      body: new FormData(form),
      mode: 'no-cors' // Prevents CORS errors on static sites, but we won't get a readable JSON response
    }).then(() => {
      form.reset();
      if (msg) msg.textContent = '';
      showThankYouModal();
    }).catch(err => {
      console.error('Error submitting form', err);
      if (msg) {
        msg.className = 'form-message error';
        msg.textContent = 'There was an error submitting your details. Please try again.';
      }
    }).finally(() => {
      if (submitBtn) {
        if (submitBtn.innerText) submitBtn.innerText = originalBtnText;
        if (submitBtn.value) submitBtn.value = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    });
  }

  // Attach to Contact & Enquire forms
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleGenericFormSubmit(e, contactForm));
  }
  
  // Attach to Air Conditioning forms
  const acLeadForm = document.getElementById('acLeadForm');
  if (acLeadForm) {
    acLeadForm.addEventListener('submit', (e) => handleGenericFormSubmit(e, acLeadForm));
  }
  const acBottomForm = document.getElementById('acBottomForm');
  if (acBottomForm) {
    acBottomForm.addEventListener('submit', (e) => handleGenericFormSubmit(e, acBottomForm));
  }

  // Attach to Homepage Hero form
  const heroLeadForm = document.getElementById('hero-lead-form');
  if (heroLeadForm) {
    heroLeadForm.addEventListener('submit', (e) => handleGenericFormSubmit(e, heroLeadForm));
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

  // Multi-step form logic (Solar Batteries)
  const multistepForm = document.getElementById('sp-multistep-form');
  if (multistepForm) {
    // Intercept submit
    multistepForm.addEventListener('submit', (e) => {
      handleGenericFormSubmit(e, multistepForm);
    });

    const steps = multistepForm.querySelectorAll('.sp-form-step');
    const radios = multistepForm.querySelectorAll('input[name="has_solar"]');
    const btnsBack = multistepForm.querySelectorAll('.sp-btn-back');
    const btnsContinue = multistepForm.querySelectorAll('.sp-btn-continue[type="button"]');

    function goToStep(targetStep) {
      steps.forEach(step => step.style.display = 'none');
      const targetEl = document.getElementById(`sp-step-${targetStep}`);
      if (targetEl) targetEl.style.display = 'block';
    }

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        goToStep(2);
      });
    });

    btnsBack.forEach(btn => {
      btn.addEventListener('click', () => {
        goToStep(btn.dataset.target);
      });
    });

    btnsContinue.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentStepEl = btn.closest('.sp-form-step');
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let valid = true;
        inputs.forEach(input => {
          if (!input.value) {
            valid = false;
            input.style.borderColor = 'red';
          } else {
            input.style.borderColor = '#ddd';
          }
        });
        
        if (valid) {
          goToStep(btn.dataset.target);
        }
      });
    });
  }
});
