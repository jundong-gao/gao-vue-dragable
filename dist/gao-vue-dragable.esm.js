/**
 * Created by WebStorm.
 * User: 高俊东
 * Date: 12/18/20
 * Time: 1:19 PM
 */

const createUUID = function () {
  var d = Date.parse(new Date());

  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }

  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
};

var script = {
  name: "GaoVueDragable",
  props: ['option', 'data'],

  data() {
    return {
      key: 'drag' + createUUID(),
      item: {},
      isDown: false,
      dianIsDown: false,
      sb_bkx: 0,
      sb_bky: 0,
      start: {},
      hoverDrag: false
    };
  },

  watch: {
    // data: {
    //     handler() {
    //         this.item = Object.assign({}, this.item, this.data)
    //     },
    //     deep: true,
    //     immediate: true
    // },
    option: {
      handler() {// console.log('option改变', this.option)
      },

      deep: true,
      immediate: true
    }
  },
  computed: {
    style() {
      return {
        left: this.setPx(this.data.left),
        top: this.setPx(this.data.top),
        width: this.setPx(this.data.width),
        height: this.setPx(this.data.height),
        zIndex: this.data.zIndex
      };
    },

    dragXStyle() {
      return {
        transform: `scale(${1 / this.option.scale})`,
        'transform-origin': 'right bottom'
      };
    },

    dragYStyle() {
      return {
        transform: `scale(${1 / this.option.scale}) rotate(-90deg)`,
        'transform-origin': '0 0'
      };
    },

    dianStyle() {
      return function (position) {
        let size = 3 * (1 / this.option.scale || 1);
        let config = {
          width: size + 'px',
          height: size + 'px'
        };

        switch (position) {
          case 'left-center':
            config.top = `calc(50% - ${size / 2}px)`;
            break;

          case 'top':
            config.left = `calc(50% - ${size / 2}px)`;
            break;

          case 'right-center':
            config.top = `calc(50% - ${size / 2}px)`;
            break;

          case 'bottom':
            config.left = `calc(50% - ${size / 2}px)`;
            break;
        }

        return config;
      };
    }

  },
  methods: {
    setPx(val) {
      try {
        return Number(val) + 'px';
      } catch (e) {
        return '0px';
      }
    },

    down(e) {
      if (!this.option.dragable) return;
      this.sb_bkx = e.clientX;
      this.sb_bky = e.clientY;
      this.start = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        left: this.data.left,
        top: this.data.top
      };
      this.isDown = true;

      document.onmousemove = e => {
        this.move(e);
      };

      document.onmouseup = e => {
        this.up(e);
      };

      this.$emit('movestart', {
        start: this.start,
        item: this.item
      });
    },

    move(e) {
      if (!this.option.dragable) return;
      if (!this.isDown) return; // let left = e.clientX - this.sb_bkx
      // let top = e.clientY - this.sb_bky
      // this.item.left = left
      // this.item.top = top
      // 移动选中组件时 偏移的坐标
      // let cha = {
      //     offsetx: (e.clientX - this.start.x) * 2,
      //     offsety: (e.clientY - this.start.y) * 2,
      //
      //     offsetx1: (e.clientX - this.start.x) ,
      //     offsety1: (e.clientY - this.start.y) ,
      //
      //     left: left ,
      //     top: top
      // }
      // console.log(JSON.stringify(cha))

      let newLeft = this.round(this.start.left + (e.clientX - this.start.mouseX) / this.option.scale);
      let newTop = this.round(this.start.top + (e.clientY - this.start.mouseY) / this.option.scale);
      this.$emit('moving', {
        left: newLeft,
        top: newTop
      });
    },

    up(e) {
      this.isDown = false;
      this.dianIsDown = false;
      document.onmousemove = null;
      document.onmouseup = null;
      let left = e.clientX - this.sb_bkx;
      let top = e.clientY - this.sb_bky;
      this.$emit('movestop');
    },

    clickStop() {
      return false;
    },

    dian(e, obj, type) {
      if (!this.option.dragable) return;
      this.dianIsDown = true;
      let start = {
        startx: e.clientX,
        starty: e.clientY
      };
      let o_width = obj.width;
      let o_height = obj.height;
      let o_left = obj.left;
      let o_top = obj.top;
      let positon = type;
      let currObj = obj;

      document.onmousemove = e => {
        if (!this.option.dragable) return;
        if (!this.dianIsDown) return;
        let cha = {
          x: e.clientX - start.startx,
          y: e.clientY - start.starty
        };

        switch (positon) {
          case 'left-top':
            currObj.width = this.round(this.numVal(o_width - cha.x / this.option.scale));
            currObj.height = this.round(this.numVal(o_height - cha.y / this.option.scale));
            currObj.left = this.round(o_left + cha.x / this.option.scale);
            currObj.top = this.round(o_top + cha.y / this.option.scale);
            break;

          case 'left-center':
            currObj.width = this.round(this.numVal(o_width - cha.x / this.option.scale));
            currObj.left = this.round(o_left + cha.x / this.option.scale);
            break;

          case 'left-bottom':
            currObj.width = this.round(this.numVal(o_width - cha.x / this.option.scale));
            currObj.height = this.round(this.numVal(o_height + cha.y / this.option.scale));
            currObj.left = this.round(o_left + cha.x / this.option.scale);
            break;

          case 'left-bottom':
            currObj.width = this.round(this.numVal(o_width - cha.x / this.option.scale));
            currObj.height = this.round(this.numVal(o_height + cha.y / this.option.scale));
            currObj.left = this.round(o_left + cha.x / this.option.scale);
            break;

          case 'top':
            currObj.height = this.round(this.numVal(o_height - cha.y / this.option.scale));
            currObj.top = this.round(o_top + cha.y / this.option.scale);
            break;

          case 'bottom':
            currObj.height = this.round(this.numVal(o_height + cha.y / this.option.scale));
            break;

          case 'right-top':
            currObj.width = this.round(this.numVal(o_width + cha.x / this.option.scale));
            currObj.height = this.round(this.numVal(o_height - cha.y / this.option.scale));
            currObj.top = this.round(o_top + cha.y / this.option.scale);
            break;

          case 'right-center':
            currObj.width = this.round(this.numVal(o_width + cha.x / this.option.scale));
            break;

          case 'right-bottom':
            currObj.width = this.round(this.numVal(o_width + cha.x / this.option.scale));
            currObj.height = this.round(this.numVal(o_height + cha.y / this.option.scale));
            break;
        }
      };

      document.onmouseup = e => {
        this.$emit('change-size-stop', this.data);
        this.up(e);
      };
    },

    numVal(val) {
      return val < 10 ? 10 : val;
    },

    mouseover(e) {
      if (!this.option.dragable) return;
      this.hoverDrag = true;
      this.$emit('focus');
    },

    mouseleave(e) {
      if (!this.option.dragable) return;
      this.hoverDrag = false;
      this.$emit('blur');
    },

    round(val) {
      return Math.round(Number(val));
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    ref: _vm.key,
    staticClass: "drag",
    class: {
      active: _vm.data.active,
      hover: _vm.hoverDrag
    },
    style: _vm.style,
    attrs: {
      "data-left": _vm.data.left,
      "data-top": _vm.data.top,
      "data-scale": 2
    },
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.down($event);
      },
      "mouseover": function ($event) {
        $event.stopPropagation();
        return _vm.mouseover($event);
      },
      "mouseleave": _vm.mouseleave,
      "click": function ($event) {
        $event.stopPropagation();
        return _vm.clickStop($event);
      }
    }
  }, [_vm._t("default"), _vm._v(" "), _vm.data.active ? [_c('div', {
    staticClass: "drag-x flex-aic",
    style: _vm.dragXStyle
  }, [_vm._v("X：" + _vm._s(_vm.data.left))]), _vm._v(" "), _c('div', {
    staticClass: "drag-y flex-aic",
    style: _vm.dragYStyle
  }, [_vm._v("Y：" + _vm._s(_vm.data.top))])] : _vm._e(), _vm._v(" "), _vm.data.active ? [_c('div', {
    staticClass: "drag-dian drag-left-top",
    style: _vm.dianStyle('left-top'),
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.dian($event, _vm.data, 'left-top');
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "drag-dian drag-left-center",
    style: _vm.dianStyle('left-center'),
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.dian($event, _vm.data, 'left-center');
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "drag-dian drag-left-bottom",
    style: _vm.dianStyle('left-bottom'),
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.dian($event, _vm.data, 'left-bottom');
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "drag-dian drag-top",
    style: _vm.dianStyle('top'),
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.dian($event, _vm.data, 'top');
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "drag-dian drag-bottom",
    style: _vm.dianStyle('bottom'),
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.dian($event, _vm.data, 'bottom');
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "drag-dian drag-right-top",
    style: _vm.dianStyle('right-top'),
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.dian($event, _vm.data, 'right-top');
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "drag-dian drag-right-center",
    style: _vm.dianStyle('right-center'),
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.dian($event, _vm.data, 'right-center');
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "drag-dian drag-right-bottom",
    style: _vm.dianStyle('right-bottom'),
    on: {
      "mousedown": function ($event) {
        $event.stopPropagation();
        return _vm.dian($event, _vm.data, 'right-bottom');
      }
    }
  })] : _vm._e()], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-47f7d7c1_0", {
    source: ".drag[data-v-47f7d7c1]{z-index:1;width:50px;height:50px;position:absolute;cursor:pointer;user-select:none}.drag.active .drag-x[data-v-47f7d7c1]{font-size:12px;line-height:15px;display:block;position:absolute;left:-100px;top:-15px;width:100px;text-align:right;color:rgba(0,0,255,.5);border-bottom:1px solid rgba(0,0,255,.1);padding-right:10px;box-sizing:border-box}.drag.active .drag-y[data-v-47f7d7c1]{font-size:12px;line-height:15px;display:block;position:absolute;left:0;top:0;padding-left:10px;box-sizing:border-box;width:100px;color:rgba(0,0,255,.5);border-top:1px solid rgba(0,0,255,.1)}.drag.hover[data-v-47f7d7c1]{background-color:rgba(0,0,255,.1)}.drag.active[data-v-47f7d7c1]{background-color:rgba(0,0,255,.3)}.drag-dian[data-v-47f7d7c1]{position:absolute;background-color:#fff;border:1px solid #000}.drag-left-top[data-v-47f7d7c1]{left:0;top:0;cursor:nw-resize}.drag-left-center[data-v-47f7d7c1]{left:0;cursor:w-resize}.drag-left-bottom[data-v-47f7d7c1]{left:0;bottom:0;cursor:sw-resize}.drag-right-top[data-v-47f7d7c1]{right:0;top:0;cursor:ne-resize}.drag-right-center[data-v-47f7d7c1]{right:0;cursor:e-resize}.drag-right-bottom[data-v-47f7d7c1]{right:0;bottom:0;cursor:se-resize}.drag-top[data-v-47f7d7c1]{top:0;cursor:n-resize}.drag-bottom[data-v-47f7d7c1]{bottom:0;cursor:s-resize}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-47f7d7c1";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component

const install = function installGaoVueDragable(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('GaoVueDragable', __vue_component__);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__;
