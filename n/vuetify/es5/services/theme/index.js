"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Theme = void 0;

var _service = require("../service");

var ThemeUtils = _interopRequireWildcard(require("./utils"));

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Theme =
/*#__PURE__*/
function (_Service) {
  _inherits(Theme, _Service);

  function Theme() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Theme);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Theme).call(this));
    _this.disabled = false;
    _this.themes = {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      },
      dark: {
        primary: '#2196F3',
        secondary: '#424242',
        accent: '#FF4081',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      }
    };
    _this.defaults = _this.themes;
    _this.isDark = null;
    _this.vueInstance = null;
    _this.vueMeta = false;

    if (options.disable) {
      _this.disabled = true;
      return _possibleConstructorReturn(_this);
    }

    _this.options = options.options;
    _this.dark = Boolean(options.dark);
    var themes = options.themes || {};
    _this.themes = {
      dark: _this.fillVariant(themes.dark, true),
      light: _this.fillVariant(themes.light, false)
    };
    return _this;
  } // When setting css, check for element
  // and apply new values


  _createClass(Theme, [{
    key: "applyTheme",
    // Apply current theme default
    // only called on client side
    value: function applyTheme() {
      if (this.disabled) return this.clearCss();
      this.css = this.generatedStyles;
    }
  }, {
    key: "clearCss",
    value: function clearCss() {
      this.css = '';
    } // Initialize theme for SSR and SPA
    // Attach to ssrContext head or
    // apply new theme to document

  }, {
    key: "init",
    value: function init(root, ssrContext) {
      if (this.disabled) return;
      /* istanbul ignore else */

      if (root.$meta) {
        this.initVueMeta(root);
      } else if (ssrContext) {
        this.initSSR(ssrContext);
      }

      this.initTheme();
    } // Allows for you to set target theme

  }, {
    key: "setTheme",
    value: function setTheme(theme, value) {
      this.themes[theme] = Object.assign(this.themes[theme], value);
      this.applyTheme();
    } // Reset theme defaults

  }, {
    key: "resetThemes",
    value: function resetThemes() {
      this.themes.light = Object.assign({}, this.defaults.light);
      this.themes.dark = Object.assign({}, this.defaults.dark);
      this.applyTheme();
    } // Check for existence of style element

  }, {
    key: "checkOrCreateStyleElement",
    value: function checkOrCreateStyleElement() {
      this.styleEl = document.getElementById('vuetify-theme-stylesheet');
      /* istanbul ignore next */

      if (this.styleEl) return true;
      this.genStyleElement(); // If doesn't have it, create it

      return Boolean(this.styleEl);
    }
  }, {
    key: "fillVariant",
    value: function fillVariant() {
      var theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var dark = arguments.length > 1 ? arguments[1] : undefined;
      var defaultTheme = this.themes[dark ? 'dark' : 'light'];
      return Object.assign({}, defaultTheme, theme);
    } // Generate the style element
    // if applicable

  }, {
    key: "genStyleElement",
    value: function genStyleElement() {
      if (typeof document === 'undefined') return;
      /* istanbul ignore next */

      var options = this.options || {};
      this.styleEl = document.createElement('style');
      this.styleEl.type = 'text/css';
      this.styleEl.id = 'vuetify-theme-stylesheet';

      if (options.cspNonce) {
        this.styleEl.setAttribute('nonce', options.cspNonce);
      }

      document.head.appendChild(this.styleEl);
    }
  }, {
    key: "initVueMeta",
    value: function initVueMeta(root) {
      var _this2 = this;

      this.vueMeta = true;
      var meta = root.$meta();
      var metaKeyName = typeof meta.getOptions === 'function' ? meta.getOptions().keyName : 'metaInfo';
      var metaInfo = root.$options[metaKeyName] || {};

      root.$options[metaKeyName] = function () {
        metaInfo.style = metaInfo.style || [];
        var vuetifyStylesheet = metaInfo.style.find(function (s) {
          return s.id === 'vuetify-theme-stylesheet';
        });

        if (!vuetifyStylesheet) {
          metaInfo.style.push({
            cssText: _this2.generatedStyles,
            type: 'text/css',
            id: 'vuetify-theme-stylesheet',
            nonce: _this2.options && _this2.options.cspNonce || undefined
          });
        } else {
          vuetifyStylesheet.cssText = _this2.generatedStyles;
        }

        return metaInfo;
      };
    }
  }, {
    key: "initSSR",
    value: function initSSR(ssrContext) {
      var options = this.options || {}; // SSR

      var nonce = options.cspNonce ? " nonce=\"".concat(options.cspNonce, "\"") : '';
      ssrContext.head = ssrContext.head || '';
      ssrContext.head += "<style type=\"text/css\" id=\"vuetify-theme-stylesheet\"".concat(nonce, ">").concat(this.generatedStyles, "</style>");
    }
  }, {
    key: "initTheme",
    value: function initTheme() {
      var _this3 = this;

      // Only watch for reactivity on client side
      if (typeof document === 'undefined') return; // If we get here somehow, ensure
      // existing instance is removed

      if (this.vueInstance) this.vueInstance.$destroy(); // Use Vue instance to track reactivity
      // TODO: Update to use RFC if merged
      // https://github.com/vuejs/rfcs/blob/advanced-reactivity-api/active-rfcs/0000-advanced-reactivity-api.md

      this.vueInstance = new _vue.default({
        data: {
          themes: this.themes
        },
        watch: {
          themes: {
            immediate: true,
            deep: true,
            handler: function handler() {
              return _this3.applyTheme();
            }
          }
        }
      });
    }
  }, {
    key: "css",
    set: function set(val) {
      if (this.vueMeta) return;
      this.checkOrCreateStyleElement() && (this.styleEl.innerHTML = val);
    }
  }, {
    key: "dark",
    set: function set(val) {
      var oldDark = this.isDark;
      this.isDark = val; // Only apply theme after dark
      // has already been set before

      oldDark != null && this.applyTheme();
    },
    get: function get() {
      return Boolean(this.isDark);
    }
  }, {
    key: "currentTheme",
    get: function get() {
      var target = this.dark ? 'dark' : 'light';
      return this.themes[target];
    }
  }, {
    key: "generatedStyles",
    get: function get() {
      var theme = this.parsedTheme;
      /* istanbul ignore next */

      var options = this.options || {};
      var css;

      if (options.themeCache != null) {
        css = options.themeCache.get(theme);
        /* istanbul ignore if */

        if (css != null) return css;
      }

      css = ThemeUtils.genStyles(theme, options.customProperties);

      if (options.minifyTheme != null) {
        css = options.minifyTheme(css);
      }

      if (options.themeCache != null) {
        options.themeCache.set(theme, css);
      }

      return css;
    }
  }, {
    key: "parsedTheme",
    get: function get() {
      /* istanbul ignore next */
      var theme = this.currentTheme || {};
      return ThemeUtils.parse(theme);
    }
  }]);

  return Theme;
}(_service.Service);

exports.Theme = Theme;
Theme.property = 'theme';
//# sourceMappingURL=index.js.map