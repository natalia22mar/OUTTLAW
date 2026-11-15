(function (global) {
  const AOS = {
    init: function (options) {
      const settings = Object.assign({
        once: true,
        duration: 800,
        offset: 80,
        easing: 'ease-out-cubic',
      }, options || {});

      document.documentElement.setAttribute('data-aos-setup', 'true');
      const nodes = document.querySelectorAll('[data-aos], [data-dn-in], [data-dn-curtain]');
      nodes.forEach(function (node) {
        node.classList.add('aos-init');
        if (settings.once) {
          node.setAttribute('data-aos-once', 'true');
        }
      });

      requestAnimationFrame(function () {
        nodes.forEach(function (node) {
          node.classList.add('aos-animate');
        });
      });
      return settings;
    },
  };

  global.AOS = AOS;
})(window);
