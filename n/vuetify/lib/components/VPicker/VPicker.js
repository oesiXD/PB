import "../../../src/components/VPicker/VPicker.sass";
import "../../../src/components/VCard/VCard.sass"; // Mixins

import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable'; // Helpers

import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
/* @vue/component */

export default mixins(Colorable, Themeable).extend({
  name: 'v-picker',
  props: {
    fullWidth: Boolean,
    landscape: Boolean,
    noTitle: Boolean,
    transition: {
      type: String,
      default: 'fade-transition'
    },
    width: {
      type: [Number, String],
      default: 290
    }
  },
  computed: {
    computedTitleColor() {
      const defaultTitleColor = this.isDark ? false : this.color || 'primary';
      return this.color || defaultTitleColor;
    }

  },
  methods: {
    genTitle() {
      return this.$createElement('div', this.setBackgroundColor(this.computedTitleColor, {
        staticClass: 'v-picker__title',
        class: {
          'v-picker__title--landscape': this.landscape
        }
      }), this.$slots.title);
    },

    genBodyTransition() {
      return this.$createElement('transition', {
        props: {
          name: this.transition
        }
      }, this.$slots.default);
    },

    genBody() {
      return this.$createElement('div', {
        staticClass: 'v-picker__body',
        class: {
          'v-picker__body--no-title': this.noTitle,
          ...this.themeClasses
        },
        style: this.fullWidth ? undefined : {
          width: convertToUnit(this.width)
        }
      }, [this.genBodyTransition()]);
    },

    genActions() {
      return this.$createElement('div', {
        staticClass: 'v-picker__actions v-card__actions',
        class: {
          'v-picker__actions--no-title': this.noTitle
        }
      }, this.$slots.actions);
    }

  },

  render(h) {
    return h('div', {
      staticClass: 'v-picker v-card',
      class: {
        'v-picker--landscape': this.landscape,
        'v-picker--full-width': this.fullWidth,
        ...this.themeClasses
      }
    }, [this.$slots.title ? this.genTitle() : null, this.genBody(), this.$slots.actions ? this.genActions() : null]);
  }

});
//# sourceMappingURL=VPicker.js.map