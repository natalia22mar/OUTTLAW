(function (global) {
  function SimpleParallax(element, options) {
    const settings = Object.assign({ scale: 1.15, overflow: true, delay: 0.2 }, options || {});
    const node = element;

    function update() {
      const rect = node.getBoundingClientRect();
      const offset = Math.max(-1, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      const value = (offset * 18) + 'px';
      node.style.transform = 'translate3d(0, ' + value + ', 0) scale(' + settings.scale + ')';
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return {
      node: node,
      options: settings,
    };
  }

  global.SimpleParallax = SimpleParallax;
})(window);
