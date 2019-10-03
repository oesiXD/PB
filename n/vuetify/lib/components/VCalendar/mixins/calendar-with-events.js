// Styles
import "../../../../src/components/VCalendar/mixins/calendar-with-events.sass"; // Directives

import ripple from '../../../directives/ripple'; // Mixins

import CalendarBase from './calendar-base'; // Util

import props from '../util/props';
import { getDayIdentifier, parseTime } from '../util/timestamp';
import { parseEvent, isEventOn } from '../util/events';
/* @vue/component */

export default CalendarBase.extend({
  name: 'calendar-with-events',
  directives: {
    ripple
  },
  props: props.events,
  computed: {
    noEvents() {
      return this.events.length === 0;
    },

    parsedEvents() {
      return this.events.map((input, index) => parseEvent(input, index, this.eventStart, this.eventEnd));
    },

    eventColorFunction() {
      return typeof this.eventColor === 'function' ? this.eventColor : () => this.eventColor;
    },

    eventTextColorFunction() {
      return typeof this.eventTextColor === 'function' ? this.eventTextColor : () => this.eventTextColor;
    },

    eventNameFunction() {
      return typeof this.eventName === 'function' ? this.eventName : (event, timedEvent) => {
        const name = event.input[this.eventName];

        if (event.start.hasTime) {
          if (timedEvent) {
            const showStart = event.start.hour < 12 && event.end.hour >= 12;
            const start = this.formatTime(event.start, showStart);
            const end = this.formatTime(event.end, true);
            return `<strong>${name}</strong><br>${start} - ${end}`;
          } else {
            const time = this.formatTime(event.start, true);
            return `<strong>${time}</strong> ${name}`;
          }
        }

        return name;
      };
    }

  },
  methods: {
    formatTime(withTime, ampm) {
      const suffix = ampm ? withTime.hour < 12 ? 'a' : 'p' : '';
      const hour = withTime.hour % 12 || 12;
      const minute = withTime.minute;
      return minute > 0 ? minute < 10 ? `${hour}:0${minute}${suffix}` : `${hour}:${minute}${suffix}` : `${hour}${suffix}`;
    },

    updateEventVisibility() {
      if (this.noEvents || !this.eventMore) {
        return;
      }

      const eventHeight = this.eventHeight;
      const eventsMap = this.getEventsMap();

      for (const date in eventsMap) {
        const {
          parent,
          events,
          more
        } = eventsMap[date];

        if (!more) {
          break;
        }

        const parentBounds = parent.getBoundingClientRect();
        const last = events.length - 1;
        let hide = false;
        let hidden = 0;

        for (let i = 0; i <= last; i++) {
          if (!hide) {
            const eventBounds = events[i].getBoundingClientRect();
            hide = eventBounds.bottom + eventHeight > parentBounds.bottom && i !== last || events[i].style.display === 'none';
          }

          if (hide) {
            const id = events[i].getAttribute('data-event');
            this.hideEvents(id);
            hidden++;
          }
        }

        if (hide) {
          more.style.display = '';
          more.innerHTML = this.$vuetify.lang.t(this.eventMoreText, hidden);
        } else {
          more.style.display = 'none';
        }
      }
    },

    hideEvents(id) {
      const elements = this.$refs.events;
      elements.forEach(el => {
        if (el.getAttribute('data-event') === id) {
          el.style.display = 'none';
        }
      });
    },

    getEventsMap() {
      const eventsMap = {};
      const elements = this.$refs.events;

      if (!elements || !elements.forEach) {
        return eventsMap;
      }

      elements.forEach(el => {
        const date = el.getAttribute('data-date');

        if (el.parentElement && date) {
          if (!(date in eventsMap)) {
            eventsMap[date] = {
              parent: el.parentElement,
              more: null,
              events: []
            };
          }

          if (el.getAttribute('data-more')) {
            eventsMap[date].more = el;
          } else {
            eventsMap[date].events.push(el);
            el.style.display = '';
          }
        }
      });
      return eventsMap;
    },

    genDayEvent({
      offset,
      event
    }, index, day) {
      const eventHeight = this.eventHeight;
      const eventMarginBottom = this.eventMarginBottom;
      const relativeOffset = (offset - index) * (eventHeight + eventMarginBottom); // 1 = margin bottom

      const dayIdentifier = getDayIdentifier(day);
      const start = dayIdentifier === event.startIdentifier;
      const end = dayIdentifier === event.endIdentifier;
      const scope = {
        event: event.input,
        day,
        outside: day.outside,
        start,
        end,
        timed: false
      };
      return this.genEvent(event, scope, start || day.index === 0, false, {
        staticClass: 'v-event',
        class: {
          'v-event-start': start,
          'v-event-end': end
        },
        style: {
          height: `${eventHeight}px`,
          top: `${relativeOffset}px`,
          'margin-bottom': `${eventMarginBottom}px`
        },
        attrs: {
          'data-date': day.date,
          'data-event': event.index
        },
        key: event.index,
        ref: 'events',
        refInFor: true
      });
    },

    genTimedEvent({
      offset,
      event,
      columnCount,
      column
    }, index, day) {
      const dayIdentifier = getDayIdentifier(day);
      const start = event.startIdentifier >= dayIdentifier;
      const end = event.endIdentifier > dayIdentifier;
      const top = start ? day.timeToY(event.start) : 0;
      const bottom = end ? day.timeToY(1440) : day.timeToY(event.end);
      const height = Math.max(this.eventHeight, bottom - top);
      const left = columnCount === -1 ? offset * 5 : column * 100 / columnCount;
      const right = columnCount === -1 ? 0 : Math.max(0, (columnCount - column - 2) * 100 / columnCount + 10);
      const scope = {
        event: event.input,
        day,
        outside: day.outside,
        start,
        end,
        timed: true
      };
      return this.genEvent(event, scope, true, true, {
        staticClass: 'v-event-timed',
        style: {
          top: `${top}px`,
          height: `${height}px`,
          left: `${left}%`,
          right: `${right}%`
        }
      });
    },

    genEvent(event, scope, showName, timedEvent, data) {
      const slot = this.$scopedSlots.event;
      const text = this.eventTextColorFunction(event.input);
      const background = this.eventColorFunction(event.input);
      return this.$createElement('div', this.setTextColor(text, this.setBackgroundColor(background, {
        on: this.getDefaultMouseEventHandlers(':event', nativeEvent => ({ ...scope,
          nativeEvent
        })),
        directives: [{
          name: 'ripple',
          value: this.eventRipple != null ? this.eventRipple : true
        }],
        ...data
      })), slot ? slot(scope) : showName ? [this.genName(event, timedEvent)] : undefined);
    },

    genName(event, timedEvent) {
      return this.$createElement('div', {
        staticClass: 'pl-1',
        domProps: {
          innerHTML: this.eventNameFunction(event, timedEvent)
        }
      });
    },

    genMore(day) {
      return this.$createElement('div', {
        staticClass: 'v-event-more pl-1',
        attrs: {
          'data-date': day.date,
          'data-more': 1
        },
        directives: [{
          name: 'ripple',
          value: this.eventRipple != null ? this.eventRipple : true
        }],
        on: {
          click: () => this.$emit('click:more', day)
        },
        style: {
          display: 'none'
        },
        ref: 'events',
        refInFor: true
      });
    },

    getEventsForDay(day) {
      const identifier = getDayIdentifier(day);
      return this.parsedEvents.filter(event => isEventOn(event, identifier));
    },

    getEventsForDayAll(day) {
      const identifier = getDayIdentifier(day);
      return this.parsedEvents.filter(event => event.allDay && isEventOn(event, identifier));
    },

    getEventsForDayTimed(day) {
      const identifier = getDayIdentifier(day);
      return this.parsedEvents.filter(event => !event.allDay && isEventOn(event, identifier));
    },

    isSameColumn(a, b) {
      const astart = parseTime(a.event.start);
      const bstart = parseTime(b.event.start);
      const diff = astart - bstart;
      const abs = diff < 0 ? -diff : diff;
      return abs < this.eventOverlapThreshold;
    },

    isOverlapping(a, b) {
      const astart = parseTime(a.event.start);
      const bstart = parseTime(b.event.start);

      if (a.offset < b.offset && bstart < astart) {
        const aend = astart + this.eventOverlapThreshold;
        const bend = parseTime(b.event.end);
        return !(astart >= bend || aend <= bstart);
      }

      return false;
    },

    getScopedSlots() {
      if (this.noEvents) {
        return this.$scopedSlots;
      }
      /**
       * Over the span of a week (for example) we want to maintain an event in the same row (for weekly and monthly views).
       * We keep track of those rows by indexToOffset. If the value in that array is -1, then we can place an event at that spot.
       * For a daily view with timed events we arrange them based on columns and offsets. If two or more events start at around the
       * same time (eventOverlapThreshold) they go into columns. If one event starts inside another it is indented the appropriate amount.
       * If one event overlaps another after those adjustments are made those events are placed in columns together instead of any defined
       * indents.
       */


      const parsedEvents = this.parsedEvents;
      const indexToOffset = parsedEvents.map(event => -1);
      const resetOnWeekday = this.weekdays[0];

      const checkReset = day => {
        if (day.weekday === resetOnWeekday) {
          for (let i = 0; i < indexToOffset.length; i++) {
            indexToOffset[i] = -1;
          }
        }
      };

      const getOffset = (visual, visuals) => {
        let offset = indexToOffset[visual.event.index];

        if (offset === -1) {
          let min = Number.MAX_SAFE_INTEGER;
          let max = -1;
          visuals.forEach(other => {
            const otherOffset = indexToOffset[other.event.index];

            if (otherOffset !== -1) {
              min = Math.min(min, otherOffset);
              max = Math.max(max, otherOffset);
            }
          });
          offset = min > 0 && max !== -1 ? min - 1 : max + 1;
          indexToOffset[visual.event.index] = offset;
        }

        return offset;
      };

      const getVisuals = (events, timed) => {
        const visuals = events.map(event => ({
          event,
          offset: 0,
          columnCount: -1,
          column: -1
        })); // sort events by start date/time

        visuals.sort((a, b) => a.event.startTimestampIdentifier - b.event.startTimestampIdentifier);

        if (timed) {
          // timed events can be organized into columns
          visuals.forEach(visual => {
            if (visual.columnCount !== -1) {
              return;
            }

            const columns = [];
            visuals.forEach(other => {
              if (other.columnCount === -1 && this.isSameColumn(visual, other)) {
                columns.push(other);
              }
            });

            if (columns.length > 1) {
              columns.forEach((visual, visualIndex) => {
                visual.column = visualIndex;
                visual.columnCount = columns.length;
              });
            }
          }); // for any not organized into columns, if they overlap another event
          // not in a column they are offset

          visuals.forEach(visual => {
            if (visual.columnCount === -1) {
              visuals.forEach(other => {
                const otherOffset = indexToOffset[other.event.index];

                if (otherOffset !== -1 && other.event.endTimestampIdentifier <= visual.event.startTimestampIdentifier) {
                  indexToOffset[other.event.index] = -1;
                }
              });
              visual.offset = getOffset(visual, visuals);
            }
          }); // for any not organized into columns, if a previous event overlaps this event
          // join them into the columns

          visuals.forEach(visual => {
            if (visual.columnCount === -1) {
              const columns = [visual];
              visuals.forEach(other => {
                if (other !== visual && other.columnCount === -1 && this.isOverlapping(visual, other)) {
                  columns.push(other);
                }
              });

              if (columns.length > 1) {
                columns.forEach((visual, visualIndex) => {
                  visual.column = visualIndex;
                  visual.columnCount = columns.length;
                });
              }
            }
          });
        } else {
          visuals.forEach(visual => {
            visual.offset = getOffset(visual, visuals);
          });
        }

        visuals.sort((a, b) => a.offset - b.offset || a.column - b.column);
        return visuals;
      };

      const getSlotChildren = (day, getter, mapper, timed) => {
        checkReset(day);
        const events = getter(day);
        return events.length === 0 ? undefined : getVisuals(events, timed).map((visual, index) => mapper(visual, index, day));
      };

      return { ...this.$scopedSlots,
        day: day => {
          const children = getSlotChildren(day, this.getEventsForDay, this.genDayEvent, false);

          if (children && children.length > 0 && this.eventMore) {
            children.push(this.genMore(day));
          }

          return children;
        },
        'day-header': day => {
          return getSlotChildren(day, this.getEventsForDayAll, this.genDayEvent, false);
        },
        'day-body': day => {
          return [this.$createElement('div', {
            staticClass: 'v-event-timed-container'
          }, getSlotChildren(day, this.getEventsForDayTimed, this.genTimedEvent, true))];
        }
      };
    }

  }
});
//# sourceMappingURL=calendar-with-events.js.map