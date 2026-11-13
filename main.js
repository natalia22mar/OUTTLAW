/*
  OUTTLAW NUEVA · drop SETT 001 (v2)
  Sin dependencias.
*/

(function () {
  const doc = document;
  const win = window;
  const prefersReducedMotion =
    win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = doc.getElementById('DnHeader');
  const pill = doc.getElementById('DnPill');
  const hero = doc.getElementById('dn-portada');
  const cierre = doc.getElementById('dn-cierre');

  // Todos los COMPRAR apuntan al mismo destino.
  const firstBuyLink = doc.querySelector('.dn [data-dn-buy]');

  if (firstBuyLink) {
    doc.querySelectorAll('[data-dn-buy]').forEach((link) => {
      link.setAttribute('href', firstBuyLink.getAttribute('href'));
    });
  }

  // Frase con efecto palabra a palabra.
  const revealBlocks = Array.from(doc.querySelectorAll('[data-dn-reveal]')).map((element) => {
    const words = element.textContent.trim().split(/\s+/);
    element.textContent = '';
    element.setAttribute('aria-label', words.join(' '));

    const wordSpans = words.map((word, index) => {
      const span = doc.createElement('span');
      span.className = 'dn-w';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = word;
      element.appendChild(span);

      if (index < words.length - 1) {
        element.appendChild(doc.createTextNode(' '));
      }

      return span;
    });

    return { element, words: wordSpans };
  });

  function updateScrollState() {
    const y = win.scrollY || win.pageYOffset;
    const vh = win.innerHeight;

    if (header) {
      header.classList.toggle('is-solid', y > 24);
    }

    if (pill && hero) {
      let shouldShowPill = y > hero.offsetHeight * 0.85;

      if (cierre) {
        const cierreRect = cierre.getBoundingClientRect();
        if (cierreRect.top < vh * 0.95) {
          shouldShowPill = false;
        }
      }

      pill.classList.toggle('is-on', shouldShowPill);
      pill.setAttribute('aria-hidden', shouldShowPill ? 'false' : 'true');
      pill.tabIndex = shouldShowPill ? 0 : -1;
    }

    revealBlocks.forEach(({ element, words }) => {
      const rect = element.getBoundingClientRect();
      const progress = prefersReducedMotion
        ? 1
        : (vh * 0.85 - rect.top) / (vh * 0.85 - vh * 0.45 + rect.height * 0.6);

      const clampedProgress = Math.max(0, Math.min(1, progress));
      const litCount = Math.round(clampedProgress * words.length);

      words.forEach((word, index) => {
        word.classList.toggle('is-lit', index < litCount);
      });
    });
  }

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      ticking = true;
      win.requestAnimationFrame(() => {
        ticking = false;
        updateScrollState();
      });
    }
  }

  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onScroll);
  updateScrollState();

  // Entradas suaves al entrar en viewport.
  const animatedElements = doc.querySelectorAll('[data-dn-in], [data-dn-curtain]');

  if (!('IntersectionObserver' in win) || prefersReducedMotion) {
    animatedElements.forEach((element) => {
      element.classList.add('is-in');
    });
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.05,
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }
})();
