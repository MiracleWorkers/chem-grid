import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import ChemTable from './ChemTable';

const defaultComponentConfig = {
  tagName: ChemTable.name,
  httpInstance: null,
  sortProperty: 'query_order_by',
  salt: 'chem_grid'
};

export default {
  install: (Vue, customConfig) => {
    const options = { ...defaultComponentConfig, ...customConfig };
    Vue.prototype.$GRID_SORT_PROPERTY = options.sortProperty;
    Vue.prototype.$GRID_HTTP_INSTANCE = options.httpInstance;
    Vue.prototype.$GRID_SALT = options.salt;
    Vue.component(options.tagName, ChemTable);
  }
};
