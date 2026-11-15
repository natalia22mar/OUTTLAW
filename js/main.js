(function ($) {
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncBuyLinks() {
    const $first = $('.dn [data-dn-buy]').first();
    if (!$first.length) return;

    const href = $first.attr('href');
    $('[data-dn-buy]').attr('href', href);
  }

  function splitRevealWords() {
    $('[data-dn-reveal]').each(function () {
      const $block = $(this);
      if ($block.data('reveal-ready')) return;

      const words = $block.text().trim().split(/\s+/);
      $block.empty();
      $block.attr('aria-label', words.join(' '));

      words.forEach((word, index) => {
        const $word = $('<span class="dn-w" aria-hidden="true"></span>').text(word);
        $block.append($word);
        if (index < words.length - 1) {
          $block.append(document.createTextNode(' '));
        }
      });

      $block.data('reveal-ready', true);
    });
  }

  function updateScrollState() {
    const y = $(window).scrollTop();
    const vh = window.innerHeight;
    const $header = $('#DnHeader');
    const $pill = $('#DnPill');
    const $hero = $('#dn-portada');
    const $cierre = $('#dn-cierre');

    $header.toggleClass('is-solid', y > 24);

    if ($pill.length && $hero.length) {
      let showPill = y > $hero.outerHeight() * 0.85;

      const cierreNode = $cierre.get(0);
      if (cierreNode) {
        const cierreTop = cierreNode.getBoundingClientRect().top;
        if (cierreTop < vh * 0.95) {
          showPill = false;
        }
      }

      $pill.toggleClass('is-on', showPill);
      $pill.attr('aria-hidden', showPill ? 'false' : 'true');
      $pill.attr('tabindex', showPill ? '0' : '-1');
    }

    $('[data-dn-reveal]').each(function () {
      const $block = $(this);
      const words = $block.find('.dn-w');
      if (!words.length) return;

      const rect = this.getBoundingClientRect();
      const progress = reducedMotion
        ? 1
        : (vh * 0.85 - rect.top) / (vh * 0.85 - vh * 0.45 + rect.height * 0.6);
      const clamped = Math.max(0, Math.min(1, progress));
      const litCount = Math.round(clamped * words.length);

      words.each(function (index) {
        $(this).toggleClass('is-lit', index < litCount);
      });
    });
  }

  function setupNavigation() {
    const $toggle = $('.dn-nav-toggle');
    const $nav = $('.dn-site-nav');

    $toggle.on('click', function () {
      const isOpen = $nav.hasClass('is-open');
      $nav.toggleClass('is-open', !isOpen);
      $toggle.attr('aria-expanded', String(!isOpen));
    });

    $nav.find('a').on('click', function () {
      if ($(window).width() <= 749) {
        $nav.removeClass('is-open');
        $toggle.attr('aria-expanded', 'false');
      }
    });
  }

  function setupSlider() {
    const $slides = $('.dn-slide');
    const $buttons = $('[data-slider-nav]');
    const $index = $('.dn-slider__index');
    const $total = $('.dn-slider__total');
    let current = 0;
    let autoPlay = null;

    if (!$slides.length) return;

    $total.text(String($slides.length).padStart(2, '0'));

    function renderSlide(index) {
      current = (index + $slides.length) % $slides.length;
      $slides.removeClass('is-active').eq(current).addClass('is-active');
      $index.text(String(current + 1).padStart(2, '0'));
    }

    function restartAutoPlay() {
      if (reducedMotion) return;
      window.clearInterval(autoPlay);
      autoPlay = window.setInterval(() => {
        renderSlide(current + 1);
      }, 3800);
    }

    $buttons.on('click', function () {
      const direction = $(this).data('slider-nav') === 'next' ? 1 : -1;
      renderSlide(current + direction);
      restartAutoPlay();
    });

    renderSlide(0);
    restartAutoPlay();
  }

  function setupParallax() {
    if (window.SimpleParallax) {
      const $images = $('.dn-hero__img, .dn-fundido__media img');
      if ($images.length && !reducedMotion) {
        $images.each(function () {
          new window.SimpleParallax(this, {
            scale: 1.15,
            overflow: true,
            delay: 0.2,
          });
        });
      }
    }
  }

  syncBuyLinks();
  splitRevealWords();
  setupNavigation();
  setupSlider();
  updateScrollState();

  $(window).on('scroll resize', function () {
    updateScrollState();
  });

  AOS.init({
    once: true,
    duration: 800,
    offset: 80,
    easing: 'ease-out-cubic',
    disable: reducedMotion,
  });

  setupParallax();
})(jQuery);
