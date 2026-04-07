/* ============================================
   FrameLab Studio — Main JavaScript
   Minimal, performant interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Loading Screen ---
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealAnimations();
      }, 1800);
    });
    document.body.style.overflow = 'hidden';
  }

  // --- Sticky Navbar ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Mobile Menu ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Scroll Reveal ---
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  if (!loader) initRevealAnimations();

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Counter Animation ---
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    const duration = 2000;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const startTime = performance.now();
        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(counter);
  });

  // --- Portfolio Modal ---
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-project]');
  const modal = document.querySelector('.case-study-modal');

  if (modal) {
    const closeBtn = modal.querySelector('.case-study-close');

    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const data = getProjectData(item.dataset.project);
        const content = modal.querySelector('.case-study-content');
        content.innerHTML = `
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;letter-spacing:-0.01em;margin-bottom:12px;color:var(--text);">${data.title}</h2>
          <p style="font-size:13px;font-weight:500;color:var(--tan-dark);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:24px;">${data.category}</p>
          <p style="font-size:15px;color:var(--text-secondary);line-height:1.8;margin-bottom:24px;">${data.description}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${data.tags.map(t => `<span style="padding:4px 12px;background:rgba(193,169,141,0.12);border-radius:100px;font-size:12px;color:var(--text-secondary);">${t}</span>`).join('')}
          </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Active Nav ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Dynamic Year ---
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    yearEl.innerHTML = yearEl.innerHTML.replace(/© \d{4}/, `© ${new Date().getFullYear()}`);
  }
});

// --- Project Data ---
function getProjectData(id) {
  const projects = {
    'luxe-hotel': {
      title: 'Luxe Hôtel & Spa',
      category: 'Site Vitrine Premium',
      description: 'Refonte complète du site web pour un hôtel 5 étoiles. Design immersif, système de réservation intégré, et expérience utilisateur exceptionnelle. Augmentation des réservations directes de 45% en 3 mois.',
      tags: ['UI/UX Design', 'Développement', 'SEO', 'Animations']
    },
    'fintech-app': {
      title: 'NeoBank Dashboard',
      category: 'Application Web',
      description: 'Dashboard bancaire moderne avec visualisations de données en temps réel, système de paiement sécurisé et intégration API complète.',
      tags: ['React', 'Node.js', 'UI Design', 'Sécurité']
    },
    'fashion-brand': {
      title: 'Maison Élégance',
      category: 'E-commerce Premium',
      description: 'Boutique en ligne haut de gamme pour une marque de mode. Design éditorial, animations fluides et expérience d\'achat immersive.',
      tags: ['E-commerce', 'Design', 'Performance', 'Mobile-First']
    },
    'saas-platform': {
      title: 'CloudFlow SaaS',
      category: 'Plateforme Web',
      description: 'Plateforme SaaS de gestion de projet avec dashboard analytique, collaboration en temps réel et architecture scalable.',
      tags: ['Vue.js', 'API REST', 'Dashboard', 'Cloud']
    },
    'restaurant': {
      title: 'Le Comptoir Gastronomique',
      category: 'Site Vitrine & Réservation',
      description: 'Site immersif pour un restaurant gastronomique étoilé avec système de réservation en ligne et menu digital interactif.',
      tags: ['Design Premium', 'Réservation', 'Mobile', 'SEO Local']
    },
    'startup': {
      title: 'TechVision AI',
      category: 'Landing Page & Branding',
      description: 'Landing page percutante pour une startup IA. Design futuriste, storytelling visuel et tunnel de conversion optimisé.',
      tags: ['Landing Page', 'WebGL', 'Conversion', 'Branding']
    }
  };
  return projects[id] || { title: 'Projet', category: 'Web Design', description: 'Un projet réalisé avec passion et précision.', tags: ['Design', 'Développement'] };
}

/* =====================
   EMAILJS CONFIG
   ===================== */
const EMAILJS_PUBLIC_KEY  = 'bWHccbmqGYvzIs0v_';
const EMAILJS_SERVICE_ID  = 'service_4j4ygop';
const EMAILJS_CONTACT_TPL = 'template_c99gdwh';
const EMAILJS_BOOKING_TPL = 'template_9ss443d';

const EMAILJS_READY = typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'VOTRE_CLE_PUBLIQUE';
if (EMAILJS_READY) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// --- Contact Form ---
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit-btn');
  const feedback  = document.getElementById('form-feedback');
  const origHTML  = submitBtn.innerHTML;
  let lastSubmit  = 0;

  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  function showFeedback(msg, type) { if (feedback) feedback.innerHTML = `<div class="form-feedback-msg ${type}">${msg}</div>`; }
  function resetBtn() { submitBtn.disabled = false; submitBtn.innerHTML = origHTML; submitBtn.style.background = ''; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (feedback) feedback.innerHTML = '';

    const now = Date.now();
    if (now - lastSubmit < 30000) { showFeedback('Veuillez patienter 30 secondes.', 'error'); return; }

    const nameVal = document.getElementById('name').value.trim();
    const emailVal = document.getElementById('email').value.trim();
    const messageVal = document.getElementById('message').value.trim();

    if (!isValidEmail(emailVal)) { showFeedback('Adresse email invalide.', 'error'); return; }
    if (messageVal.length < 20) { showFeedback('Message trop court (20 caractères min.).', 'error'); return; }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Envoi en cours…</span>';

    const params = {
      from_name: nameVal,
      from_email: emailVal,
      project_type: document.getElementById('project-type').value,
      budget: document.getElementById('budget').value,
      message: messageVal
    };

    if (!EMAILJS_READY) {
      showFeedback('Contactez-nous : <a href="mailto:framelabstudio.fr@gmail.com">framelabstudio.fr@gmail.com</a>', 'error');
      resetBtn(); return;
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TPL, params);
      lastSubmit = Date.now();
      submitBtn.innerHTML = '<span>Envoyé ✓</span>';
      submitBtn.style.background = 'var(--bg-dark)';
      showFeedback('Message envoyé ! Nous vous répondrons dans les 24h.', 'success');
      setTimeout(() => { resetBtn(); form.reset(); if (feedback) feedback.innerHTML = ''; }, 5000);
    } catch {
      showFeedback('Erreur. Contactez-nous : <a href="mailto:framelabstudio.fr@gmail.com">framelabstudio.fr@gmail.com</a>', 'error');
      resetBtn();
    }
  });
})();

// --- Booking System ---
(function() {
  const openBtn = document.getElementById('open-booking-btn');
  const modal = document.getElementById('booking-modal');
  if (!openBtn || !modal) return;

  const overlay = document.getElementById('booking-overlay');
  const closeBtn = document.getElementById('booking-close');
  const datesWrap = document.getElementById('booking-dates');
  const timeBlock = document.getElementById('booking-time-block');
  const formBlock = document.getElementById('booking-form-block');
  const summaryEl = document.getElementById('booking-summary');
  const bookForm = document.getElementById('booking-form');
  const bFeedback = document.getElementById('booking-feedback');
  const bSubmitBtn = document.getElementById('booking-submit-btn');

  let selDate = null, selTime = null;
  const origBtnHTML = bSubmitBtn ? bSubmitBtn.innerHTML : '';

  function nextBusinessDays(count) {
    const result = [];
    const dow = ['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'];
    const mon = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (result.length < count) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        result.push({
          label: `${dow[d.getDay()]} ${d.getDate()} ${mon[d.getMonth()]}`,
          full: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return result;
  }

  function buildDates() {
    datesWrap.innerHTML = '';
    nextBusinessDays(8).forEach(day => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'date-chip';
      btn.textContent = day.label;
      btn.dataset.full = day.full;
      btn.addEventListener('click', () => {
        datesWrap.querySelectorAll('.date-chip').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selDate = day.full;
        selTime = null;
        modal.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        timeBlock.hidden = false;
        formBlock.hidden = true;
        timeBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      datesWrap.appendChild(btn);
    });
  }

  modal.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      modal.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selTime = slot.dataset.time;
      if (summaryEl) summaryEl.textContent = `Rendez-vous : ${selDate} à ${selTime}`;
      formBlock.hidden = false;
      formBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  function openModal() {
    selDate = null; selTime = null;
    buildDates();
    timeBlock.hidden = true;
    formBlock.hidden = true;
    if (bFeedback) bFeedback.innerHTML = '';
    if (bookForm) bookForm.reset();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  if (bookForm && bSubmitBtn) {
    bookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!selDate || !selTime) {
        if (bFeedback) bFeedback.innerHTML = '<div class="form-feedback-msg error">Sélectionnez une date et un horaire.</div>';
        return;
      }
      bSubmitBtn.disabled = true;
      bSubmitBtn.innerHTML = '<span>Confirmation…</span>';
      if (bFeedback) bFeedback.innerHTML = '';

      const params = {
        from_name: document.getElementById('booking-name').value.trim(),
        from_email: document.getElementById('booking-email').value.trim(),
        booking_project: document.getElementById('booking-project').value.trim(),
        booking_date: selDate,
        booking_time: selTime
      };

      if (!EMAILJS_READY) {
        if (bFeedback) bFeedback.innerHTML = '<div class="form-feedback-msg error">Contactez-nous : <a href="mailto:framelabstudio.fr@gmail.com">framelabstudio.fr@gmail.com</a></div>';
        bSubmitBtn.disabled = false;
        bSubmitBtn.innerHTML = origBtnHTML;
        return;
      }

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BOOKING_TPL, params);
        bSubmitBtn.innerHTML = '<span>Confirmé ✓</span>';
        bSubmitBtn.style.background = 'var(--bg-dark)';
        if (bFeedback) bFeedback.innerHTML = `<div class="form-feedback-msg success">Appel le <strong>${selDate}</strong> à <strong>${selTime}</strong> confirmé !</div>`;
        setTimeout(() => {
          closeModal();
          bookForm.reset();
          bSubmitBtn.disabled = false;
          bSubmitBtn.innerHTML = origBtnHTML;
          bSubmitBtn.style.background = '';
        }, 4500);
      } catch {
        if (bFeedback) bFeedback.innerHTML = '<div class="form-feedback-msg error">Erreur. Contactez-nous : <a href="mailto:framelabstudio.fr@gmail.com">framelabstudio.fr@gmail.com</a></div>';
        bSubmitBtn.disabled = false;
        bSubmitBtn.innerHTML = origBtnHTML;
      }
    });
  }
})();

// --- Cookie Consent ---
(function() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (localStorage.getItem('cookie-consent')) return;
  setTimeout(() => banner.classList.add('visible'), 1500);

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.classList.remove('visible');
  });
  document.getElementById('cookie-reject')?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'rejected');
    banner.classList.remove('visible');
  });
})();
