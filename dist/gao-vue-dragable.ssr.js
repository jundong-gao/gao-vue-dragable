'use strict';Object.defineProperty(exports,'__esModule',{value:true});/**
 * Created by WebStorm.
 * User: 高俊东
 * Date: 12/18/20
 * Time: 1:19 PM
 */

var createUUID = function createUUID() {
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
};var script = {
  name: "GaoVueDragable",
  props: ['option', 'data'],
  data: function data() {
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
      handler: function handler() {// console.log('option改变', this.option)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    style: function style() {
      return {
        left: this.setPx(this.data.left),
        top: this.setPx(this.data.top),
        width: this.setPx(this.data.width),
        height: this.setPx(this.data.height),
        zIndex: this.data.zIndex
      };
    },
    dragXStyle: function dragXStyle() {
      return {
        transform: "scale(".concat(1 / this.option.scale, ")"),
        'transform-origin': 'right bottom'
      };
    },
    dragYStyle: function dragYStyle() {
      return {
        transform: "scale(".concat(1 / this.option.scale, ") rotate(-90deg)"),
        'transform-origin': '0 0'
      };
    },
    dianStyle: function dianStyle() {
      return function (position) {
        var size = 3 * (1 / this.option.scale || 1);
        var config = {
          width: size + 'px',
          height: size + 'px'
        };

        switch (position) {
          case 'left-center':
            config.top = "calc(50% - ".concat(size / 2, "px)");
            break;

          case 'top':
            config.left = "calc(50% - ".concat(size / 2, "px)");
            break;

          case 'right-center':
            config.top = "calc(50% - ".concat(size / 2, "px)");
            break;

          case 'bottom':
            config.left = "calc(50% - ".concat(size / 2, "px)");
            break;
        }

        return config;
      };
    }
  },
  methods: {
    setPx: function setPx(val) {
      try {
        return Number(val) + 'px';
      } catch (e) {
        return '0px';
      }
    },
    down: function down(e) {
      var _this = this;

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

      document.onmousemove = function (e) {
        _this.move(e);
      };

      document.onmouseup = function (e) {
        _this.up(e);
      };

      this.$emit('movestart', {
        start: this.start,
        item: this.item
      });
    },
    move: function move(e) {
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

      var newLeft = this.round(this.start.left + (e.clientX - this.start.mouseX) / this.option.scale);
      var newTop = this.round(this.start.top + (e.clientY - this.start.mouseY) / this.option.scale);
      this.$emit('moving', {
        left: newLeft,
        top: newTop
      });
    },
    up: function up(e) {
      this.isDown = false;
      this.dianIsDown = false;
      document.onmousemove = null;
      document.onmouseup = null;
      var left = e.clientX - this.sb_bkx;
      var top = e.clientY - this.sb_bky;
      this.$emit('movestop');
    },
    clickStop: function clickStop() {
      return false;
    },
    dian: function dian(e, obj, type) {
      var _this2 = this;

      if (!this.option.dragable) return;
      this.dianIsDown = true;
      var start = {
        startx: e.clientX,
        starty: e.clientY
      };
      var o_width = obj.width;
      var o_height = obj.height;
      var o_left = obj.left;
      var o_top = obj.top;
      var positon = type;
      var currObj = obj;

      document.onmousemove = function (e) {
        if (!_this2.option.dragable) return;
        if (!_this2.dianIsDown) return;
        var cha = {
          x: e.clientX - start.startx,
          y: e.clientY - start.starty
        };

        switch (positon) {
          case 'left-top':
            currObj.width = _this2.round(_this2.numVal(o_width - cha.x / _this2.option.scale));
            currObj.height = _this2.round(_this2.numVal(o_height - cha.y / _this2.option.scale));
            currObj.left = _this2.round(o_left + cha.x / _this2.option.scale);
            currObj.top = _this2.round(o_top + cha.y / _this2.option.scale);
            break;

          case 'left-center':
            currObj.width = _this2.round(_this2.numVal(o_width - cha.x / _this2.option.scale));
            currObj.left = _this2.round(o_left + cha.x / _this2.option.scale);
            break;

          case 'left-bottom':
            currObj.width = _this2.round(_this2.numVal(o_width - cha.x / _this2.option.scale));
            currObj.height = _this2.round(_this2.numVal(o_height + cha.y / _this2.option.scale));
            currObj.left = _this2.round(o_left + cha.x / _this2.option.scale);
            break;

          case 'left-bottom':
            currObj.width = _this2.round(_this2.numVal(o_width - cha.x / _this2.option.scale));
            currObj.height = _this2.round(_this2.numVal(o_height + cha.y / _this2.option.scale));
            currObj.left = _this2.round(o_left + cha.x / _this2.option.scale);
            break;

          case 'top':
            currObj.height = _this2.round(_this2.numVal(o_height - cha.y / _this2.option.scale));
            currObj.top = _this2.round(o_top + cha.y / _this2.option.scale);
            break;

          case 'bottom':
            currObj.height = _this2.round(_this2.numVal(o_height + cha.y / _this2.option.scale));
            break;

          case 'right-top':
            currObj.width = _this2.round(_this2.numVal(o_width + cha.x / _this2.option.scale));
            currObj.height = _this2.round(_this2.numVal(o_height - cha.y / _this2.option.scale));
            currObj.top = _this2.round(o_top + cha.y / _this2.option.scale);
            break;

          case 'right-center':
            currObj.width = _this2.round(_this2.numVal(o_width + cha.x / _this2.option.scale));
            break;

          case 'right-bottom':
            currObj.width = _this2.round(_this2.numVal(o_width + cha.x / _this2.option.scale));
            currObj.height = _this2.round(_this2.numVal(o_height + cha.y / _this2.option.scale));
            break;
        }
      };

      document.onmouseup = function (e) {
        _this2.$emit('change-size-stop', _this2.data);

        _this2.up(e);
      };
    },
    numVal: function numVal(val) {
      return val < 10 ? 10 : val;
    },
    mouseover: function mouseover(e) {
      if (!this.option.dragable) return;
      this.hoverDrag = true;
      this.$emit('focus');
    },
    mouseleave: function mouseleave(e) {
      if (!this.option.dragable) return;
      this.hoverDrag = false;
      this.$emit('blur');
    },
    round: function round(val) {
      return Math.round(Number(val));
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
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
      "mousedown": function mousedown($event) {
        $event.stopPropagation();
        return _vm.down($event);
      },
      "mouseover": function mouseover($event) {
        $event.stopPropagation();
        return _vm.mouseover($event);
      },
      "mouseleave": _vm.mouseleave,
      "click": function click($event) {
        $event.stopPropagation();
        return _vm.clickStop($event);
      }
    }
  }, [_vm._t("default"), _vm._ssrNode(" " + (_vm.data.active ? "<div class=\"drag-x flex-aic\"" + _vm._ssrStyle(null, _vm.dragXStyle, null) + " data-v-47f7d7c1>" + _vm._ssrEscape("X：" + _vm._s(_vm.data.left)) + "</div> <div class=\"drag-y flex-aic\"" + _vm._ssrStyle(null, _vm.dragYStyle, null) + " data-v-47f7d7c1>" + _vm._ssrEscape("Y：" + _vm._s(_vm.data.top)) + "</div>" : "<!---->") + " " + (_vm.data.active ? "<div class=\"drag-dian drag-left-top\"" + _vm._ssrStyle(null, _vm.dianStyle('left-top'), null) + " data-v-47f7d7c1></div> <div class=\"drag-dian drag-left-center\"" + _vm._ssrStyle(null, _vm.dianStyle('left-center'), null) + " data-v-47f7d7c1></div> <div class=\"drag-dian drag-left-bottom\"" + _vm._ssrStyle(null, _vm.dianStyle('left-bottom'), null) + " data-v-47f7d7c1></div> <div class=\"drag-dian drag-top\"" + _vm._ssrStyle(null, _vm.dianStyle('top'), null) + " data-v-47f7d7c1></div> <div class=\"drag-dian drag-bottom\"" + _vm._ssrStyle(null, _vm.dianStyle('bottom'), null) + " data-v-47f7d7c1></div> <div class=\"drag-dian drag-right-top\"" + _vm._ssrStyle(null, _vm.dianStyle('right-top'), null) + " data-v-47f7d7c1></div> <div class=\"drag-dian drag-right-center\"" + _vm._ssrStyle(null, _vm.dianStyle('right-center'), null) + " data-v-47f7d7c1></div> <div class=\"drag-dian drag-right-bottom\"" + _vm._ssrStyle(null, _vm.dianStyle('right-bottom'), null) + " data-v-47f7d7c1></div>" : "<!---->"))], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-47f7d7c1_0", {
    source: ".drag[data-v-47f7d7c1]{z-index:1;width:50px;height:50px;position:absolute;cursor:pointer;user-select:none}.drag.active .drag-x[data-v-47f7d7c1]{font-size:12px;line-height:15px;display:block;position:absolute;left:-100px;top:-15px;width:100px;text-align:right;color:rgba(0,0,255,.5);border-bottom:1px solid rgba(0,0,255,.1);padding-right:10px;box-sizing:border-box}.drag.active .drag-y[data-v-47f7d7c1]{font-size:12px;line-height:15px;display:block;position:absolute;left:0;top:0;padding-left:10px;box-sizing:border-box;width:100px;color:rgba(0,0,255,.5);border-top:1px solid rgba(0,0,255,.1)}.drag.hover[data-v-47f7d7c1]{background-color:rgba(0,0,255,.1)}.drag.active[data-v-47f7d7c1]{background-color:rgba(0,0,255,.3)}.drag-dian[data-v-47f7d7c1]{position:absolute;background-color:#fff;border:1px solid #000}.drag-left-top[data-v-47f7d7c1]{left:0;top:0;cursor:nw-resize}.drag-left-center[data-v-47f7d7c1]{left:0;cursor:w-resize}.drag-left-bottom[data-v-47f7d7c1]{left:0;bottom:0;cursor:sw-resize}.drag-right-top[data-v-47f7d7c1]{right:0;top:0;cursor:ne-resize}.drag-right-center[data-v-47f7d7c1]{right:0;cursor:e-resize}.drag-right-bottom[data-v-47f7d7c1]{right:0;bottom:0;cursor:se-resize}.drag-top[data-v-47f7d7c1]{top:0;cursor:n-resize}.drag-bottom[data-v-47f7d7c1]{bottom:0;cursor:s-resize}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-47f7d7c1";
/* module identifier */

var __vue_module_identifier__ = "data-v-47f7d7c1";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

var install = function installGaoVueDragable(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('GaoVueDragable', __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;