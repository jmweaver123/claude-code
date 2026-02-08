/* ============================================
   Compass365 Homepage - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initCounterAnimation();
  initContactForm();
});

/* --- Navigation & Mega Menu --- */
function initNavigation() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const dropdownItems = document.querySelectorAll('.nav__item--has-dropdown');

  if (!toggle || !menu) return;

  // Mobile hamburger toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('nav__toggle--active');
    menu.classList.toggle('nav__menu--active');
    // Close all open dropdowns when closing menu
    if (!menu.classList.contains('nav__menu--active')) {
      dropdownItems.forEach(item => item.classList.remove('nav__item--active'));
    }
  });

  // Dropdown toggle on click (for mobile and keyboard accessibility)
  dropdownItems.forEach(item => {
    const link = item.querySelector(':scope > .nav__link');
    link.addEventListener('click', (e) => {
      // On mobile, always toggle dropdown. On desktop, allow navigation if no href="#"
      if (isMobile() || link.getAttribute('href') === '#') {
        e.preventDefault();
        const isActive = item.classList.contains('nav__item--active');
        // Close sibling dropdowns
        dropdownItems.forEach(sibling => {
          if (sibling !== item) sibling.classList.remove('nav__item--active');
        });
        item.classList.toggle('nav__item--active', !isActive);
      }
    });
  });

  // Close menu when a mega-menu link is clicked
  menu.querySelectorAll('.mega-menu__link, .nav__item:not(.nav__item--has-dropdown) .nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('nav__toggle--active');
      menu.classList.remove('nav__menu--active');
      dropdownItems.forEach(item => item.classList.remove('nav__item--active'));
    });
  });

  // Close menu and dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.classList.remove('nav__toggle--active');
      menu.classList.remove('nav__menu--active');
      dropdownItems.forEach(item => item.classList.remove('nav__item--active'));
    }
  });

  // Close mega menus on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(item => item.classList.remove('nav__item--active'));
      toggle.classList.remove('nav__toggle--active');
      menu.classList.remove('nav__menu--active');
    }
  });
}

function isMobile() {
  return window.innerWidth <= 768;
}

/* --- Scroll Effects --- */
function initScrollEffects() {
  const header = document.getElementById('header');

  // Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  // Fade-in on scroll using IntersectionObserver
  const fadeElements = document.querySelectorAll(
    '.service-card, .solution-card, .testimonial-card, .about__content, .about__visual, .contact__info, .contact__form-wrapper, .section__header'
  );

  fadeElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach(el => observer.observe(el));

  // Stagger animation for grid items
  document.querySelectorAll('.services__grid, .solutions__grid, .testimonials__grid').forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
      item.classList.add(`fade-in-delay-${Math.min(index + 1, 5)}`);
    });
  });
}

/* --- Animated Counters --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'), 10);
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.name || !data.email) {
      showFormMessage(form, 'Please fill in all required fields.', 'error');
      return;
    }

    // Simulate form submission
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      showFormMessage(form, 'Thank you! We\'ll be in touch within 24 hours.', 'success');
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  });
}

function showFormMessage(form, message, type) {
  // Remove existing message
  const existing = form.querySelector('.form__message');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `form__message form__message--${type}`;
  el.textContent = message;
  el.style.cssText = `
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.5rem;
    ${type === 'success'
      ? 'background: rgba(0, 212, 170, 0.1); color: #00D4AA; border: 1px solid rgba(0, 212, 170, 0.2);'
      : 'background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2);'
    }
  `;

  form.appendChild(el);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (el.parentNode) {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }
  }, 5000);
}
