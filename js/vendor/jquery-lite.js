(function (global) {
  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function asCollection(value) {
    if (value instanceof JQ) return value;
    if (value === undefined || value === null) return new JQ([]);
    if (typeof value === 'string') return new JQ(document.querySelectorAll(value));
    if (Array.isArray(value)) return new JQ(value);
    if (value.nodeType || value === window || value === document) return new JQ([value]);
    if (typeof value.length !== 'undefined') return new JQ(toArray(value));
    return new JQ([]);
  }

  function JQ(items) {
    this.items = [];
    if (items === undefined || items === null) return this;
    if (items instanceof JQ) {
      this.items = items.items.slice();
      return this;
    }
    if (typeof items === 'string') {
      if (/^\s*</.test(items) && />\s*$/.test(items)) {
        const template = document.createElement('template');
        template.innerHTML = items;
        this.items = toArray(template.content.childNodes).filter(Boolean);
        return this;
      }

      this.items = toArray(document.querySelectorAll(items)).filter(Boolean);
      return this;
    }
    if (Array.isArray(items)) {
      this.items = items.filter(Boolean);
      return this;
    }
    if (items.nodeType || items === window || items === document) {
      this.items = [items];
      return this;
    }
    if (typeof items.length !== 'undefined') {
      this.items = toArray(items).filter(Boolean);
      return this;
    }
    this.items = [items];
  }

  Object.defineProperty(JQ.prototype, 'length', {
    get: function () {
      return this.items.length;
    },
  });

  JQ.prototype.each = function (callback) {
    this.items.forEach(function (item, index) {
      callback.call(item, index, item);
    });
    return this;
  };

  JQ.prototype.on = function (eventName, handler) {
    this.each(function () {
      this.addEventListener(eventName, handler);
    });
    return this;
  };

  JQ.prototype.attr = function (name, value) {
    if (value === undefined) {
      return this.items[0] ? this.items[0].getAttribute(name) : undefined;
    }

    this.each(function () {
      this.setAttribute(name, String(value));
    });
    return this;
  };

  JQ.prototype.data = function (name, value) {
    const key = name.replace(/-([a-z])/g, function (_, letter) {
      return letter.toUpperCase();
    });

    if (value === undefined) {
      const item = this.items[0];
      if (!item) return undefined;
      return item.dataset ? item.dataset[key] : undefined;
    }

    this.each(function () {
      this.dataset = this.dataset || {};
      this.dataset[key] = value;
    });
    return this;
  };

  JQ.prototype.text = function (value) {
    if (value === undefined) {
      return this.items.map(function (item) {
        return item.textContent || '';
      }).join(' ');
    }

    this.each(function () {
      this.textContent = String(value);
    });
    return this;
  };

  JQ.prototype.empty = function () {
    this.each(function () {
      this.textContent = '';
    });
    return this;
  };

  JQ.prototype.append = function (content) {
    const node = typeof content === 'string' ? document.createTextNode(content) : content;
    this.each(function () {
      if (typeof content === 'object' && content instanceof JQ) {
        content.items.forEach(function (child) {
          this.appendChild(child.cloneNode ? child.cloneNode(true) : child);
        }, this);
      } else if (node) {
        this.appendChild(node.cloneNode ? node.cloneNode(true) : node);
      }
    });
    return this;
  };

  JQ.prototype.find = function (selector) {
    const nodes = [];
    this.each(function () {
      if (this.querySelectorAll) {
        nodes.push.apply(nodes, this.querySelectorAll(selector));
      }
    });
    return new JQ(nodes);
  };

  JQ.prototype.eq = function (index) {
    return new JQ(this.items[index] ? [this.items[index]] : []);
  };

  JQ.prototype.first = function () {
    return new JQ(this.items[0] ? [this.items[0]] : []);
  };

  JQ.prototype.get = function (index) {
    return this.items[index];
  };

  JQ.prototype.addClass = function (className) {
    this.each(function () {
      if (!this.classList) return;
      className.split(/\s+/).filter(Boolean).forEach(function (name) {
        this.classList.add(name);
      }, this);
    });
    return this;
  };

  JQ.prototype.removeClass = function (className) {
    this.each(function () {
      if (!this.classList) return;
      className.split(/\s+/).filter(Boolean).forEach(function (name) {
        this.classList.remove(name);
      }, this);
    });
    return this;
  };

  JQ.prototype.toggleClass = function (className, force) {
    this.each(function () {
      if (!this.classList) return;
      className.split(/\s+/).filter(Boolean).forEach(function (name) {
        if (typeof force === 'boolean') {
          if (force) this.classList.add(name); else this.classList.remove(name);
        } else {
          this.classList.toggle(name);
        }
      }, this);
    });
    return this;
  };

  JQ.prototype.hasClass = function (className) {
    return this.items.some(function (item) {
      return !!(item.classList && item.classList.contains(className));
    });
  };

  JQ.prototype.outerHeight = function () {
    return this.items[0] ? this.items[0].offsetHeight || 0 : 0;
  };

  JQ.prototype.scrollTop = function (value) {
    if (value === undefined) {
      return this.items[0] ? this.items[0].scrollTop || 0 : 0;
    }

    this.each(function () {
      this.scrollTop = value;
    });
    return this;
  };

  JQ.prototype.width = function () {
    return this.items[0] ? this.items[0].clientWidth || 0 : 0;
  };

  global.jQuery = function (args) {
    return new JQ(args);
  };
  global.$ = global.jQuery;
  global.jQuery.fn = JQ.prototype;
})(window);
