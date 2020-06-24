import Vue from 'vue';
import RenderPagination from '../render/RenderPagination';
import RenderPaginationTotal from '../render/RenderPaginationTotal';

export default {
  methods: {
    // 表格用到的自定义组件注册，其中包含 配置项中对应的slot + 自定义组件(如分页器)
    $_registerSlotComponents() {
      const _components = {};

      // ScopedSlotComponents
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

      // CustomComponents
      _components['renderPagination'] = RenderPagination;
      _components['renderPaginationTotal'] = RenderPaginationTotal;

      return _components;
    }
  }
};
