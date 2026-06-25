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
  if (hudAlt)  hudAlt.textContent  = randDrift(33500, 200, 0).replace(',', ',');
  if (hudHdg)  hudHdg.textContent  = String(randDrift(184, 4, 0)).padStart(3, '0');
  if (hudSpd)  hudSpd.textContent  = randDrift(412, 6, 0);
  if (hudBtr)  hudBtr.textContent  = randDrift(97.4, 0.3, 1);
  if (hudOtp)  hudOtp.textContent  = randDrift(88.2, 0.4, 1);
  if (hudFuel) hudFuel.textContent = randDrift(98.1, 0.2, 1);
}

setInterval(tickHud, 1800);

/* =====================
   INTERSECTION OBSERVER
   - Reveal elements
   - Animate skill bars
   - Animate SVGs
   ===================== */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add .reveal class to selected elements and observe
const revealTargets = [
  ...document.querySelectorAll('.exp-block'),
  ...document.querySelectorAll('.edu-item'),
  ...document.querySelectorAll('.skill-cat'),
  ...document.querySelectorAll('.about-text'),
  ...document.querySelectorAll('.about-edu'),
];
revealTargets.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// SVG illustrations
const svgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      svgObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.exp-svg').forEach(svg => svgObserver.observe(svg));

// Skill bars
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.dataset.w;
        setTimeout(() => { fill.style.width = w + '%'; }, 100);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-categories').forEach(el => barObserver.observe(el));

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
