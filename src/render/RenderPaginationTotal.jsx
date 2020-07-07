import Vue from 'vue';
const totalInfo = {
  inject: ['Provider'],
  render(createElement) {
    return createElement('span', { class: 'chem-grid_pagination-total' }, `共 ${this.Provider.pagination.total} 条`);
  }
};

export default Vue.extend(totalInfo);
