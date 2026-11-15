/* Interacciones de SETT 001 desarrolladas con jQuery. */
$(function () {
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

  // Carrusel propio: controles, puntos y teclado, sin plugin de slider.
  const $slides = $('.dn-slider__slide');
  const $dots = $('.dn-slider__dots');
  let activeSlide = 0;
  function showSlide(index) {
    activeSlide = (index + $slides.length) % $slides.length;
    $slides.each(function (slideIndex) {
      const active = slideIndex === activeSlide;
      $(this).toggleClass('is-active', active).attr('aria-hidden', String(!active));
    });
    $dots.find('button').each(function (dotIndex) {
      $(this).toggleClass('is-active', dotIndex === activeSlide).attr('aria-current', dotIndex === activeSlide ? 'true' : 'false');
    });
    $('.dn-slider__status').text('Imagen ' + (activeSlide + 1) + ' de ' + $slides.length);
  }
  $slides.each(function (index) {
    $('<button>', {
      type: 'button',
      class: 'dn-slider__dot' + (index === 0 ? ' is-active' : ''),
      'aria-label': 'Mostrar imagen ' + (index + 1),
      'aria-current': index === 0 ? 'true' : 'false'
    }).appendTo($dots).on('click', function () { showSlide(index); });
  });
  $('[data-slide="prev"]').on('click', function () { showSlide(activeSlide - 1); });
  $('[data-slide="next"]').on('click', function () { showSlide(activeSlide + 1); });
  $('.dn-slider').on('keydown', function (event) {
    if (event.key === 'ArrowLeft') showSlide(activeSlide - 1);
    if (event.key === 'ArrowRight') showSlide(activeSlide + 1);
  });
  showSlide(0);

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
  $('.dn-modal__close').on('click', function () { modal.close ? modal.close() : $(modal).removeAttr('open'); });
  $(modal).on('click', function (event) {
    if (event.target === modal) modal.close ? modal.close() : $(modal).removeAttr('open');
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
