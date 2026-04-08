// ============================================================
// ANIMATIONS.JS — Bautista.dev
// Intersection Observer, counters, navbar scroll,
// image placeholders con Canvas, form feedback
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────
  // 1. NAVBAR SCROLL — (Desactivado por solicitud: Navbar sólido)
  // ─────────────────────────────────────────────
  const navbar = document.querySelector('.custom-navbar');
  // Lógica eliminada para mantener estado estático



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
  // 4. PROJECT IMAGE PLACEHOLDERS CON CANVAS
  //    Genera una imagen visualmente rica para cada
  //    tarjeta de proyecto cuando no carga la URL externa.
  // ─────────────────────────────────────────────

  /**
   * Configuración de placeholders por ID de article
   * Cada entrada define: gradiente, ícono y label para el Canvas
   */
  const PROJECT_PLACEHOLDERS = {
    'project-dashboard': {
      colors : ['#1a0a2e', '#2d1b69'],
      accent : '#38ef7d',
      icon   : '📊',
      label  : 'Dashboard Analytics',
    },
    'project-landing': {
      colors : ['#0d1b2a', '#1b4332'],
      accent : '#38ef7d',
      icon   : '🌐',
      label  : 'Agencia Digital',
    },
    'project-ecommerce': {
      colors : ['#1a0a2e', '#11998e'],
      accent : '#38ef7d',
      icon   : '🛒',
      label  : 'E-commerce Store',
    },
    'project-weather': {
      colors : ['#0d1b3e', '#1a3a6c'],
      accent : '#38ef7d',
      icon   : '🌤️',
      label  : 'Weather App',
    },
    'project-restaurant': {
      colors : ['#1a0a10', '#3d1515'],
      accent : '#ef7d38',
      icon   : '🍽️',
      label  : 'Restaurante Online',
    },
    'project-taskmanager': {
      colors : ['#0a1a1a', '#0d3333'],
      accent : '#38ef7d',
      icon   : '✅',
      label  : 'Task Manager',
    },
  };

  /**
   * Dibuja un placeholder en Canvas para un proyecto dado
   * @param {string} projectId  - ID del <article>
   * @param {HTMLImageElement} img - Elemento <img> a reemplazar
   */
  function drawPlaceholder(projectId, img) {
    const config = PROJECT_PLACEHOLDERS[projectId];
    if (!config) return;

    // Crear canvas con las mismas dimensiones del contenedor
    const canvas = document.createElement('canvas');
    const w = img.parentElement.offsetWidth  || 480;
    const h = img.parentElement.offsetHeight || 300;
    canvas.width  = w;
    canvas.height = h;
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-label', config.label);

    const ctx = canvas.getContext('2d');

    // Fondo con gradiente
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, config.colors[0]);
    grad.addColorStop(1, config.colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Grid decorativo de puntos
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    const spacing = 28;
    for (let x = spacing; x < w; x += spacing) {
      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Líneas decorativas
    ctx.strokeStyle = config.accent + '22';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const yPos = (h / 5) * (i + 1);
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(w, yPos);
      ctx.stroke();
    }

    // Círculo de fondo para ícono
    const cx = w / 2;
    const cy = h / 2 - 18;
    const r  = Math.min(w, h) * 0.18;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = config.accent + '18';
    ctx.fill();
    ctx.strokeStyle = config.accent + '55';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ícono emoji
    const fontSize = Math.floor(r * 1.1);
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.icon, cx, cy);

    // Título del proyecto
    ctx.font = `600 ${Math.floor(h * 0.064)}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(config.label, cx, cy + r + h * 0.09);

    // Línea acento inferior
    const lineW = Math.min(120, w * 0.35);
    const lineY = cy + r + h * 0.16;
    ctx.beginPath();
    ctx.moveTo(cx - lineW / 2, lineY);
    ctx.lineTo(cx + lineW / 2, lineY);
    ctx.strokeStyle = config.accent;
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';
    ctx.stroke();

    // Reemplazar img por canvas en el DOM
    img.parentElement.replaceChild(canvas, img);
  }

  /**
   * Inicializa los placeholders:
   * - Intenta cargar la imagen real
   * - Si falla (onerror), dibuja el Canvas placeholder
   * - Si no tiene src válido, dibuja directamente
   */
  function initProjectPlaceholders() {
    Object.keys(PROJECT_PLACEHOLDERS).forEach((projectId) => {
      const article = document.getElementById(projectId);
      if (!article) return;

      const img = article.querySelector('.project-img img');
      if (!img) return;

      // Si ya falló (p.ej. caché rota)
      if (img.complete && img.naturalWidth === 0) {
        drawPlaceholder(projectId, img);
        return;
      }

      // Listener para cuando falle la carga REAL
      img.addEventListener('error', () => {
        console.log(`Image failed for ${projectId}, drawing placeholder...`);
        drawPlaceholder(projectId, img);
      }, { once: true });
    });
  }

  // Ejecutamos después de que el DOM esté listo
  window.addEventListener('load', () => {
    setTimeout(initProjectPlaceholders, 1500); 
  });


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
