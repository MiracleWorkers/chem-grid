import Vue from 'vue';

export default {
  methods: {
    // 表格用到的自定义组件注册，其中包含 配置项中对应的slot + 自定义组件(如分页器)
    $_registerSlotComponents() {
      const _components = {};
      // ScopedSlotComponents
      const _scopedSlots = this.$scopedSlots;
      Object.keys(_scopedSlots).forEach(key => {
        _components[key] = Vue.extend({
          render: function(h) {
            const { data = {}, rowIndex, rowPinned } = this.params.node;
            return rowPinned
              ? h('span', this.params.value)
              : _scopedSlots[key]({
                  model: data,
                  $index: rowIndex
                });
          }
        });
      });
      return _components;
    }
  }
};
