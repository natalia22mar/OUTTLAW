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

  syncCursorState();

  const unitPrice = 49;
  const maxQuantity = 28;
  const $quantity = $('#product-quantity');
  const $total = $('#product-total');
  const $decrease = $('#quantity-decrease');
  const $increase = $('#quantity-increase');
  const $mainImage = $('#product-main-image');

  function updateQuantity(value) {
    const parsed = Number.parseInt(value, 10);
    const quantity = Number.isFinite(parsed) ? Math.min(maxQuantity, Math.max(1, parsed)) : 1;
    $quantity.val(quantity);
    $total.text(new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(unitPrice * quantity));
    $decrease.prop('disabled', quantity <= 1);
    $increase.prop('disabled', quantity >= maxQuantity);
  }

  $decrease.on('click', function () {
    updateQuantity(Number($quantity.val()) - 1);
  });
  $increase.on('click', function () {
    updateQuantity(Number($quantity.val()) + 1);
  });
  $quantity.on('input change', function () {
    updateQuantity(this.value);
  });

  $('.product-gallery__thumb').on('click', function () {
    const $thumb = $(this);
    const imagePath = $thumb.attr('data-image');
    const imageAlt = $thumb.attr('data-alt');

    $('.product-gallery__thumb').removeClass('is-selected').attr('aria-pressed', 'false');
    $thumb.addClass('is-selected').attr('aria-pressed', 'true');
    $mainImage.stop(true, true).fadeOut(120, function () {
      $mainImage.attr({ src: imagePath, alt: imageAlt }).fadeIn(180);
    });
  });

  updateQuantity($quantity.val());
});
