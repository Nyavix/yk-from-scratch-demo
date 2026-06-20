/* From Scratch Bakeshop & Boba — main.js
   GSAP + ScrollTrigger for scroll animations.
   Falls back gracefully if GSAP not loaded. */

(function () {
  'use strict';

  /* ── Nav scroll behaviour ─────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      nav.classList.toggle('mobile-open');
      document.body.style.overflow = nav.classList.contains('mobile-open') ? 'hidden' : '';
    });
    // Close on nav link click
    nav.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Menu tabs ────────────────────────────────────────────────── */
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Scroll reveal (native IntersectionObserver fallback) ─────── */
  if (!window.gsap) {
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.transition = 'opacity .65s ease, transform .65s ease';
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => observer.observe(el));
    } else {
      // No IntersectionObserver — just show everything
      revealEls.forEach(el => el.classList.add('is-visible'));
    }
  }

  /* ── GSAP animations (runs only if GSAP loaded) ───────────────── */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero text reveal
    gsap.from('.hero-text > *', {
      y: 30,
      opacity: 0,
      duration: .9,
      ease: 'power3.out',
      stagger: .12,
      delay: .2,
    });

    // Hero visual parallax
    gsap.to('.hero-visual', {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Blobs drift
    gsap.to('.hero-blob-1', {
      y: -60,
      x: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    // Section reveals via ScrollTrigger
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.from(el, {
        y: 32,
        opacity: 0,
        duration: .75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        }
      });
    });

    // Category cards stagger
    gsap.from('.category-card', {
      y: 40,
      opacity: 0,
      duration: .7,
      ease: 'power2.out',
      stagger: .1,
      scrollTrigger: {
        trigger: '.category-grid',
        start: 'top 85%',
        once: true,
      }
    });

    // Review cards stagger
    gsap.from('.review-card', {
      y: 28,
      opacity: 0,
      duration: .65,
      ease: 'power2.out',
      stagger: .12,
      scrollTrigger: {
        trigger: '.reviews-grid',
        start: 'top 85%',
        once: true,
      }
    });
  }

  // Init GSAP when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
  } else {
    initGSAP();
  }

  /* ── Smooth scroll for anchor links ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
