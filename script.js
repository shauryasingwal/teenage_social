/* ============================================================
   LUNEYA — script.js
   All functionality from Version A, cleanly organized.
   ============================================================ */

'use strict';

/* ── THEME SYSTEM ────────────────────────────────────────── */

const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('luneya-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('luneya-theme');
  const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  setTheme(saved || 'light');
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!localStorage.getItem('luneya-theme')) {
    setTheme(e.matches ? 'light' : 'dark');
  }
});

initTheme();

/* ── MOBILE MENU ─────────────────────────────────────────── */

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

mobileMenuBtn.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  mobileMenuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
  if (icon) icon.textContent = open ? 'close' : 'menu';
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
    const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = 'menu';
  });
});

/* ── SCROLL REVEAL ───────────────────────────────────────── */

const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = [...entry.target.parentNode.querySelectorAll('.reveal')];
          const idx = siblings.indexOf(entry.target);
          const existingDelay = parseFloat(entry.target.style.transitionDelay || '0');
          if (!existingDelay) {
            entry.target.style.transitionDelay = Math.min(idx * 0.06, 0.3) + 's';
          }
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ── NAVBAR SCROLL STATE ─────────────────────────────────── */

const navbar = document.getElementById('navbar');

function syncNavbarState() {
  navbar.classList.toggle('is-scrolled', window.scrollY > 20);
}

syncNavbarState();
window.addEventListener('scroll', syncNavbarState, { passive: true });

/* ── DESKTOP LOGIN BUTTON VISIBILITY ─────────────────────── */

function checkNavWidth() {
  const loginBtn = document.getElementById('nav-login');
  if (loginBtn) {
    loginBtn.style.display = window.innerWidth >= 768 ? 'inline-flex' : 'none';
  }
}

checkNavWidth();
window.addEventListener('resize', checkNavWidth);

/* ── FAQ ACCORDION ───────────────────────────────────────── */

const faqItems = document.querySelectorAll('.faq-item');

function closeFaqItem(item) {
  const answer = item.querySelector('.faq-answer');
  const question = item.querySelector('.faq-question');
  item.classList.remove('open');
  question.setAttribute('aria-expanded', 'false');
  answer.style.height = answer.scrollHeight + 'px';
  requestAnimationFrame(() => {
    answer.style.height = '0px';
  });
}

function openFaqItem(item) {
  const answer = item.querySelector('.faq-answer');
  const question = item.querySelector('.faq-question');
  item.classList.add('open');
  question.setAttribute('aria-expanded', 'true');
  answer.style.height = answer.scrollHeight + 'px';
}

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  answer.addEventListener('transitionend', () => {
    if (item.classList.contains('open')) {
      answer.style.height = 'auto';
    }
  });

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all others
    faqItems.forEach(other => {
      if (other !== item && other.classList.contains('open')) {
        closeFaqItem(other);
      }
    });

    if (isOpen) {
      closeFaqItem(item);
    } else {
      openFaqItem(item);
    }
  });
});

/* ── ANIMATED COUNTERS ───────────────────────────────────── */

function animateCounter(element, target) {
  const isPercentage = element.textContent.includes('%');
  const duration = 1800;
  const startTime = Date.now();

  const tick = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(target * progress);

    element.textContent = isPercentage ? current + '%' : current.toLocaleString();

    if (progress < 1) requestAnimationFrame(tick);
  };
  tick();
}

const statEls = document.querySelectorAll('.about-stat .num');
if (statEls.length > 0) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const text = entry.target.textContent.trim();
          if (text === '61%') animateCounter(entry.target, 61);
          // Non-numeric stats stay as-is
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach(el => statObserver.observe(el));
}

/* ── CONFETTI ────────────────────────────────────────────── */

function createConfetti() {
  const colors = ['#c4aaf0', '#9b77d8', '#7cc99a', '#4cd7f6', '#f0c0ff'];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random() * 100 + '%';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (2 + Math.random()) + 's';
    el.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

/* ── TOAST ───────────────────────────────────────────────── */

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9998;
    padding: 12px 20px; border-radius: 10px;
    font-family: 'Inter', system-ui, sans-serif; font-size: 14px;
    border: 1px solid ${type === 'success' ? 'rgba(124,201,154,0.4)' : 'rgba(255,107,107,0.4)'};
    background: ${type === 'success' ? 'rgba(124,201,154,0.15)' : 'rgba(255,107,107,0.15)'};
    color: ${type === 'success' ? '#7cc99a' : '#ff6b6b'};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    transition: opacity 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ── EMAIL VALIDATION ────────────────────────────────────── */

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── FORM HANDLING ───────────────────────────────────────── */

document.querySelectorAll('form').forEach(form => {
  const input = form.querySelector('input[type="email"]');
  const button = form.querySelector('button[type="submit"]');

  if (!input || !button) return;

  input.addEventListener('blur', () => {
    if (input.value && !validateEmail(input.value)) {
      input.style.borderColor = '#ff6b6b';
      showToast('Please enter a valid email', 'error');
    } else {
      input.style.borderColor = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = input.value.trim();

    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email', 'error');
      input.style.borderColor = '#ff6b6b';
      return;
    }

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Joining…';

    setTimeout(() => {
      createConfetti();
      showToast('You are on the waitlist! 🎉', 'success');
      button.textContent = "You're in ✓";
      button.style.opacity = '0.6';
      input.value = '';
      input.style.borderColor = '';

      setTimeout(() => {
        button.disabled = false;
        button.style.opacity = '1';
        button.textContent = originalText;
        form.reset();
      }, 3500);
    }, 1100);
  });
});

/* ── SMOOTH SCROLL ANCHORS ───────────────────────────────── */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar.offsetHeight + 24;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    }
  });
});
