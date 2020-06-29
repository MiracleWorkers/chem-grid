import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import ChemTable from './ChemTable';

const defaultComponentConfig = {
  tagName: ChemTable.name,
  httpInstance: null,
  sortProperty: 'query_order_by'
};

export default {
  install: (Vue, customConfig) => {
    const options = { ...defaultComponentConfig, ...customConfig };
    Vue.prototype.$GRID_SORT_PROPERTY = options.sortProperty;
    Vue.prototype.$GRID_HTTP_INSTANCE = options.httpInstance;
    Vue.component(options.tagName, ChemTable);
  }
};
