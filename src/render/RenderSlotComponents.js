import Vue from 'vue';
export default {
  methods: {
    $_registerSlotComponents() {
      const _components = {};
      const _scopedSlots = this.$scopedSlots;
      Object.keys(_scopedSlots).forEach(key => {
        _components[key] = Vue.extend({
          data() {
            return {
              useSlot: false,
              scopedModel: null,
              scopedIndex: null
            };
          },
          render: function(h) {
            return this.useSlot
              ? _scopedSlots[key]({
                  model: this.scopedModel,
                  $index: this.scopedIndex
                })
              : h('span', this.params.value);
          },
          mounted() {
            this.scopedModel = this.params.node.data;
            this.scopedIndex = this.params.node.rowIndex;
            if (this.params.node.rowPinned !== 'bottom') this.useSlot = true;
          }
        });
      });
      return _components;
    }
  }
};
