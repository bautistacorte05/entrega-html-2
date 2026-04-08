// ============================================================
// ANIMATIONS.JS — Bautista.dev
// Intersection Observer, counters, navbar scroll (disabled),
// form feedback.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────
  // 1. NAVBAR SCROLL — (Desactivado por solicitud: Navbar sólido)
  // ─────────────────────────────────────────────
  const navbar = document.querySelector('.custom-navbar');
  // Lógica de scroll eliminada para mantener estado estático y color sólido.


  // ─────────────────────────────────────────────
  // 2. INTERSECTION OBSERVER — Reveal on scroll
  // ─────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }


  // ─────────────────────────────────────────────
  // 3. COUNTER ANIMATION — Para la sección de stats
  // ─────────────────────────────────────────────
  const counters = document.querySelectorAll('.stat-number[data-target]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /**
   * Anima un número desde 0 hasta el valor de data-target
   * @param {HTMLElement} el
   */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  }


  // ─────────────────────────────────────────────
  // 4. PROJECT IMAGE PLACEHOLDERS — (Desactivado para estabilidad)
  // ─────────────────────────────────────────────
  // Se ha removido la lógica de Canvas para evitar conflictos visuales 
  // con las imágenes profesionales del portfolio.


  // ─────────────────────────────────────────────
  // 5. PORTFOLIO FILTER — Filtrar proyectos por categoría
  // ─────────────────────────────────────────────
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards  = document.querySelectorAll('[data-category]');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;

          if (match) {
            card.style.display = '';
            card.classList.remove('visible');
            void card.offsetWidth; // Force reflow
            card.classList.add('visible');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }


  // ─────────────────────────────────────────────
  // 6. CONTACT FORM — Feedback visual al enviar
  // ─────────────────────────────────────────────
  const contactForm = document.querySelector('form[data-contact]');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn          = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      // Estado de carga
      btn.disabled  = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando...';

      // Simular envío
      setTimeout(() => {
        btn.innerHTML   = '<i class="bi bi-check2-circle me-2"></i>¡Mensaje enviado!';
        btn.style.background = 'linear-gradient(135deg, #38ef7d, #11998e)';
        contactForm.reset();

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalText;
          btn.style.background = '';
        }, 3000);
      }, 1200);
    });
  }

});
