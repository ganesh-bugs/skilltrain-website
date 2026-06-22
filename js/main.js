// SkillTrain — Main JS

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const status = document.getElementById('formStatus');
    const originalBtnText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending...';
    if (status) { status.style.display = 'none'; }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#2A9090';
        if (status) {
          status.textContent = "Thank you — we've received your message and will be in touch within 24 hours.";
          status.style.color = '#2A9090';
          status.style.display = 'block';
        }
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      btn.textContent = originalBtnText;
      btn.style.background = '';
      if (status) {
        status.textContent = "Something went wrong sending your message. Please try again, or email us directly.";
        status.style.color = '#C0392B';
        status.style.display = 'block';
      }
    } finally {
      btn.disabled = false;
      setTimeout(() => {
        if (btn.textContent === '✓ Message Sent!') {
          btn.textContent = originalBtnText;
          btn.style.background = '';
        }
      }, 4000);
    }
  });
}

function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

const counterEls = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.counter, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// Email obfuscation — protects against simple bot scraping
// Decodes and injects mailto links at runtime instead of having them in raw HTML
document.querySelectorAll('[data-email-user]').forEach(el => {
  const user = el.getAttribute('data-email-user');
  const domain = el.getAttribute('data-email-domain');
  const email = user + '@' + domain;
  el.setAttribute('href', 'mailto:' + email);
  if (el.textContent.trim() === '' || el.dataset.emailText === 'true') {
    el.textContent = email;
  }
});
