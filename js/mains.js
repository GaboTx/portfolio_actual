/* =====================
   NAV: scroll state
   ===================== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* =====================
   NAV: mobile burger
   ===================== */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* =====================
   HUD: animated values
   ===================== */
const hudAlt  = document.getElementById('hud-alt');
const hudHdg  = document.getElementById('hud-hdg');
const hudSpd  = document.getElementById('hud-spd');
const hudBtr  = document.getElementById('hud-btr');
const hudOtp  = document.getElementById('hud-otp');
const hudFuel = document.getElementById('hud-fuel');

function randDrift(base, range, decimals) {
  const v = base + (Math.random() - 0.5) * range;
  return decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString();
}

function tickHud() {
  if (hudAlt)  hudAlt.textContent  = (33500 + Math.round((Math.random()-0.5)*200)).toLocaleString();
  if (hudHdg)  hudHdg.textContent  = String(Math.round(184 + (Math.random()-0.5)*4)).padStart(3,'0');
  if (hudSpd)  hudSpd.textContent  = Math.round(412 + (Math.random()-0.5)*6);
  if (hudBtr)  hudBtr.textContent  = randDrift(97.4, 0.3, 1);
  if (hudOtp)  hudOtp.textContent  = randDrift(88.2, 0.4, 1);
  if (hudFuel) hudFuel.textContent = randDrift(98.1, 0.2, 1);
}

setInterval(tickHud, 1800);

/* =====================
   UNIVERSAL REVEAL HELPER
   Marks element visible immediately if already
   in viewport, otherwise uses IntersectionObserver
   ===================== */
function makeVisible(el) {
  el.classList.add('visible');
}

function observeReveal(elements, options = {}) {
  const opts = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px',
    ...options
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        makeVisible(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, opts);

  elements.forEach(el => {
    // If already in viewport on load, show immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // slight delay so CSS transition fires
      setTimeout(() => makeVisible(el), 100);
    } else {
      io.observe(el);
    }
  });
}

/* =====================
   REVEAL: general elements
   ===================== */
const revealTargets = [
  ...document.querySelectorAll('.exp-block'),
  ...document.querySelectorAll('.edu-item'),
  ...document.querySelectorAll('.skill-cat'),
  ...document.querySelectorAll('.about-text'),
  ...document.querySelectorAll('.about-edu'),
];
revealTargets.forEach(el => el.classList.add('reveal'));
observeReveal(revealTargets);

/* =====================
   REVEAL: SVG illustrations
   ===================== */
const svgs = [...document.querySelectorAll('.exp-svg')];
observeReveal(svgs, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

/* =====================
   SKILL BARS: animate width
   ===================== */
const skillSections = [...document.querySelectorAll('.skills-categories')];
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = fill.dataset.w + '%';
        }, i * 80);
      });
      barIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
skillSections.forEach(el => barIO.observe(el));

/* =====================
   SMOOTH SCROLL offset
   (accounts for fixed nav)
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 24;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
