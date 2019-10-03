"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VTimePicker/VTimePickerTitle.sass");

var _pickerButton = _interopRequireDefault(require("../../mixins/picker-button"));

var _util = require("../VDatePicker/util");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _VTimePicker = require("./VTimePicker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
// Utils
var _default = (0, _mixins.default)(_pickerButton.default
/* @vue/component */
).extend({
  name: 'v-time-picker-title',
  props: {
    ampm: Boolean,
    disabled: Boolean,
    hour: Number,
    minute: Number,
    second: Number,
    period: {
      type: String,
      validator: function validator(period) {
        return period === 'am' || period === 'pm';
      }
    },
    readonly: Boolean,
    useSeconds: Boolean,
    selecting: Number
  },
  methods: {
    genTime: function genTime() {
      var hour = this.hour;

      if (this.ampm) {
        hour = hour ? (hour - 1) % 12 + 1 : 12;
      }

      var displayedHour = this.hour == null ? '--' : this.ampm ? String(hour) : (0, _util.pad)(hour);
      var displayedMinute = this.minute == null ? '--' : (0, _util.pad)(this.minute);
      var titleContent = [this.genPickerButton('selecting', _VTimePicker.SelectingTimes.Hour, displayedHour, this.disabled), this.$createElement('span', ':'), this.genPickerButton('selecting', _VTimePicker.SelectingTimes.Minute, displayedMinute, this.disabled)];

      if (this.useSeconds) {
        var displayedSecond = this.second == null ? '--' : (0, _util.pad)(this.second);
        titleContent.push(this.$createElement('span', ':'));
        titleContent.push(this.genPickerButton('selecting', _VTimePicker.SelectingTimes.Second, displayedSecond, this.disabled));
      }

      return this.$createElement('div', {
        class: 'v-time-picker-title__time'
      }, titleContent);
    },
    genAmPm: function genAmPm() {
      return this.$createElement('div', {
        staticClass: 'v-time-picker-title__ampm'
      }, [this.genPickerButton('period', 'am', 'am', this.disabled || this.readonly), this.genPickerButton('period', 'pm', 'pm', this.disabled || this.readonly)]);
    }
  },
  render: function render(h) {
    var children = [this.genTime()];
    this.ampm && children.push(this.genAmPm());
    return h('div', {
      staticClass: 'v-time-picker-title'
    }, children);
  }
});

exports.default = _default;
//# sourceMappingURL=VTimePickerTitle.js.map