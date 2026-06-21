/**
 * Aimeecode Studio - Main Application
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    hidePreloader();
    initScrollProgress();
    initCursorGlow();
    initMobileMenu();
    initSmoothNav();
    initRevealAnimations();
    init3DCards();
    initFAQ();
    initCurrencyToggle();
    initCounters();
    initForms();
    initPlanButtons();
  }

  function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 800);
    });

    setTimeout(() => preloader.classList.add('hidden'), 3000);
  }

  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
  }

  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || window.innerWidth < 768) return;

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => el.classList.add('visible'), 100);
      } else {
        observer.observe(el);
      }
    });
  }

  function init3DCards() {
    const cards = document.querySelectorAll('.card-3d');
    if (window.innerWidth < 768) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        const glow = card.querySelector('.card-glow');
        if (glow) {
          glow.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
          glow.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  function initCurrencyToggle() {
    const usdBtn = document.getElementById('currency-usd');
    const rwfBtn = document.getElementById('currency-rwf');
    if (!usdBtn || !rwfBtn) return;

    const usdPrices = document.querySelectorAll('.usd-price');
    const rwfPrices = document.querySelectorAll('.rwf-price');

    function showUSD() {
      usdBtn.classList.add('active');
      rwfBtn.classList.remove('active');
      usdPrices.forEach(el => el.classList.remove('hidden'));
      rwfPrices.forEach(el => el.classList.add('hidden'));
    }

    function showRWF() {
      rwfBtn.classList.add('active');
      usdBtn.classList.remove('active');
      usdPrices.forEach(el => el.classList.add('hidden'));
      rwfPrices.forEach(el => el.classList.remove('hidden'));
    }

    usdBtn.addEventListener('click', showUSD);
    rwfBtn.addEventListener('click', showRWF);
    showUSD();
  }

  function initCounters() {
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

    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function initForms() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thanks for subscribing! We\'ll keep you updated.');
        newsletterForm.reset();
      });
    }
  }

  function initPlanButtons() {
    document.querySelectorAll('.plan-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const planName = btn.closest('.plan-card')?.querySelector('.plan-name')?.textContent || 'Plan';
        const contact = document.getElementById('contact');
        if (contact) {
          contact.scrollIntoView({ behavior: 'smooth' });
        }
        showToast(`Great choice! Contact us to get started with the ${planName}.`);
      });
    });
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
})();
