/* Interacciones de SETT 001 desarrolladas con jQuery. */
$(function () {
  const $cursor = $('<div class="dn-cursor" aria-hidden="true"></div>');
  $('body').append($cursor);

  function syncCursorState() {
    const modalOpen = document.querySelector('.dn-modal[open]') !== null;

    if (modalOpen) {
      $('body').css('cursor', 'auto');
      $cursor.css({
        opacity: '0',
        visibility: 'hidden'
      });
      return;
    }

    $('body').css('cursor', 'none');
    $cursor.css({
      opacity: '1',
      visibility: 'visible'
    });
  }

  if (window.MutationObserver) {
    const modalObserver = new MutationObserver(syncCursorState);
    $('.dn-modal').each(function () {
      modalObserver.observe(this, { attributes: true, attributeFilter: ['open'] });
    });
  }

  document.querySelectorAll('.dn-modal').forEach(function (modal) {
    modal.addEventListener('toggle', syncCursorState);
    modal.addEventListener('close', syncCursorState);
    modal.addEventListener('cancel', syncCursorState);
  });

  $(document).on('mousemove', function (event) {
    $cursor.css({
      left: event.clientX + 'px',
      top: event.clientY + 'px'
    });
  });

  $('a, button, input, textarea, [data-dn-buy], .dn-header__cta').on('mouseenter', function () {
    $cursor.addClass('is-hover');
  }).on('mouseleave', function () {
    $cursor.removeClass('is-hover');
  });

  $('.dn-modal').on('cancel close show', syncCursorState);
  $('.dn-subscribe-trigger, .dn-care-modal-open, .dn-modal__close, .dn-subscribe-modal__close').on('click', function () {
    window.setTimeout(syncCursorState, 20);
  });
  window.setInterval(syncCursorState, 100);
  syncCursorState();

  const $header = $('#DnHeader');
  const $pill = $('#DnPill');
  const $hero = $('#dn-portada');
  const $cierre = $('#dn-cierre');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navegación responsive.
  const $menuToggle = $('.dn-menu-toggle');
  const $menu = $('#dn-menu');
  $menuToggle.on('click', function () {
    const isOpen = $(this).attr('aria-expanded') === 'true';
    $(this).attr({ 'aria-expanded': String(!isOpen), 'aria-label': isOpen ? 'Abrir menú' : 'Cerrar menú' });
    $menu.toggleClass('is-open', !isOpen);
  });
  $menu.find('a').on('click', function () {
    $menu.removeClass('is-open');
    $menuToggle.attr({ 'aria-expanded': 'false', 'aria-label': 'Abrir menú' });
  });

  // Carrusel propio deslizante con autoplay, sin plugin de slider.
  const $slides = $('.dn-slider__slide');
  const $track = $('.dn-slider__track');
  const $counter = $('.dn-slider__counter');
  const slideCount = $slides.length;
  let activeSlide = 0;
  let autoplayTimer = null;
  let resumeTimer = null;
  let normalizeTimer = null;

  if (slideCount > 1) {
    $track.prepend($slides.last().clone().removeClass('is-active').attr('aria-hidden', 'true'));
    $track.append($slides.first().clone().removeClass('is-active').attr('aria-hidden', 'true'));
    $track.css({ transition: 'none', transform: 'translate3d(-100%, 0, 0)' });
    $track[0].offsetHeight;
    $track.css('transition', '');
  }

  function startAutoplay() {
    if (autoplayTimer !== null) return;
    autoplayTimer = window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 3000);
  }

  function pauseAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(startAutoplay, 5000);
  }

  function showSlide(index) {
    if (!$slides.length) return;
    const wrapsForward = index >= slideCount;
    const wrapsBackward = index < 0;
    activeSlide = (index + slideCount) % slideCount;
    $counter.text((activeSlide + 1) + ' / ' + slideCount);
    $slides.each(function (slideIndex) {
      const active = slideIndex === activeSlide;
      $(this).toggleClass('is-active', active).attr('aria-hidden', String(!active));
    });

    const visualIndex = wrapsForward ? slideCount + 1 : wrapsBackward ? 0 : activeSlide + 1;
    $track.css('transform', 'translate3d(-' + (visualIndex * 100) + '%, 0, 0)');

    if (wrapsForward || wrapsBackward) {
      $track.off('transitionend.dnSlider');
      window.clearTimeout(normalizeTimer);
      const normalizePosition = function () {
        $track.off('transitionend.dnSlider');
        $track.css({ transition: 'none', transform: 'translate3d(-' + ((activeSlide + 1) * 100) + '%, 0, 0)' });
        $track[0].offsetHeight;
        $track.css('transition', '');
      };
      $track.one('transitionend.dnSlider', function (event) {
        if (event.originalEvent.propertyName === 'transform') normalizePosition();
      });
      normalizeTimer = window.setTimeout(normalizePosition, 650);
    }
  }

  showSlide(0);

  $('[data-slide="prev"]').on('click', function () {
    pauseAutoplay();
    showSlide(activeSlide - 1);
  });
  $('[data-slide="next"]').on('click', function () {
    pauseAutoplay();
    showSlide(activeSlide + 1);
  });
  $('.dn-slider').on('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      pauseAutoplay();
      showSlide(activeSlide - 1);
    }
    if (event.key === 'ArrowRight') {
      pauseAutoplay();
      showSlide(activeSlide + 1);
    }
  });
  startAutoplay();

  // La galería conserva el swipe táctil y permite arrastre con ratón.
  const $details = $('.dn-detalles');
  $details.each(function () {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const $track = $(this);

    function stopDrag() {
      isDragging = false;
      $track.removeClass('is-dragging');
    }

    $track.on('mousedown', function (event) {
      if (event.button !== 0) return;
      isDragging = true;
      startX = event.pageX;
      scrollLeft = this.scrollLeft;
      $track.addClass('is-dragging');
      event.preventDefault();
    });

    $(document).on('mousemove', function (event) {
      if (!isDragging) return;
      $track[0].scrollLeft = scrollLeft - (event.pageX - startX) * 1.35;
    });

    $(document).on('mouseup', stopDrag);
    $(window).on('blur', stopDrag);
  });

  // Acordeón accesible: permite abrir varias respuestas.
  $('.dn-faq__question').on('click', function () {
    const $button = $(this);
    const expanded = $button.attr('aria-expanded') === 'true';
    $button.attr('aria-expanded', String(!expanded));
    const $answer = $button.next('.dn-faq__answer').stop(true, true);
    if (expanded) {
      $answer.slideUp(220, function () { $answer.attr('hidden', true); });
    } else {
      $answer.removeAttr('hidden').hide().slideDown(220);
    }
  });

  // Modal de cuidados.
  const modal = document.getElementById('dn-care-modal');
  $('.dn-care-modal-open').on('click', function () {
    if (modal.showModal) modal.showModal();
    else $(modal).attr('open', true);
  });
  $('.dn-modal__close:not(.dn-subscribe-modal__close)').on('click', function () { modal.close ? modal.close() : $(modal).removeAttr('open'); });
  $(modal).on('click', function (event) {
    if (event.target === modal) modal.close ? modal.close() : $(modal).removeAttr('open');
  });

  // Modal responsive de suscripción.
  const subscribeModal = document.getElementById('dn-subscribe-modal');
  const $subscribeForm = $('#dn-subscribe-form');
  let subscribeModalHandled = false;
  $('.dn-subscribe-trigger').on('click', function () {
    subscribeModalHandled = true;
    if (subscribeModal.showModal) subscribeModal.showModal();
    else $(subscribeModal).attr('open', true);
  });
  $('.dn-subscribe-modal__close').on('click', function () {
    subscribeModalHandled = true;
    subscribeModal.close ? subscribeModal.close() : $(subscribeModal).removeAttr('open');
  });
  $(subscribeModal).on('click', function (event) {
    if (event.target === subscribeModal) {
      subscribeModalHandled = true;
      subscribeModal.close ? subscribeModal.close() : $(subscribeModal).removeAttr('open');
    }
  });
  window.setTimeout(function () {
    if (!subscribeModalHandled && !subscribeModal.open && subscribeModal.showModal) subscribeModal.showModal();
  }, 5000);
  $subscribeForm.on('submit', function (event) {
    event.preventDefault();
    if (!this.reportValidity()) return;
    $('.dn-subscribe-form__status')
      .addClass('is-success')
      .text('¡Listo! Has completado el formulario. El envío de correos aún no está conectado.');
  });

  // Estados de cabecera y botón de compra según el scroll.
  function updateScrollState() {
    const y = $(window).scrollTop();
    const viewportHeight = window.innerHeight;
    $header.toggleClass('is-solid', y > 24);

    if ($pill.length && $hero.length) {
      let showPill = y > $hero.outerHeight() * 0.85;
      if ($cierre.length && $cierre[0].getBoundingClientRect().top < viewportHeight * 0.95) showPill = false;
      $pill.toggleClass('is-on', showPill).attr('aria-hidden', String(!showPill)).attr('tabindex', showPill ? 0 : -1);
    }
  }
  $(window).on('scroll resize', updateScrollState);
  updateScrollState();

  // Reveal de detalles existentes.
  const $animated = $('[data-dn-in], [data-dn-curtain]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    $animated.each(function () { observer.observe(this); });
  } else {
    $animated.addClass('is-in');
  }

  // AOS solo en bloques seleccionados y SimpleParallax en la fotografía de campaña.
  if (window.AOS) AOS.init({ once: true, duration: 800, offset: 80, disable: reduceMotion });
  if (window.simpleParallax && !reduceMotion) {
    const parallaxImage = document.querySelector('.dn-parallax');
    if (parallaxImage) new simpleParallax(parallaxImage, { scale: 1.12, orientation: 'up', delay: 0.4, transition: 'cubic-bezier(0,0,0,1)' });
  }
});
