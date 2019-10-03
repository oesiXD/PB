"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This mixin provides `attrs$` and `listeners$` to work around
 * vue bug https://github.com/vuejs/vue/issues/10115
 */
function makeWatcher(property) {
  return {
    handler: function handler(val, oldVal) {
      for (var attr in oldVal) {
        if (!Object.prototype.hasOwnProperty.call(val, attr)) {
          this.$delete(this.$data[property], attr);
        }
      }

      for (var _attr in val) {
        this.$set(this.$data[property], _attr, val[_attr]);
      }
    },
    immediate: true
  };
}

var _default = _vue.default.extend({
  data: function data() {
    return {
      attrs$: {},
      listeners$: {}
    };
  },
  watch: {
    // Work around unwanted re-renders: https://github.com/vuejs/vue/issues/10115
    // Make sure to use `attrs$` instead of `$attrs` (confusing right?)
    $attrs: makeWatcher('attrs$'),
    $listeners: makeWatcher('listeners$')
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map