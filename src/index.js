import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import ChemTable from './ChemTable';

export default {
  install: (Vue, options = {}) => {
    const tagName = options.tagName || ChemTable.name;
    const httpInstance = options.httpInstance || null;
    const sortProperty = options.sortProperty || 'query_order_by';
    Vue.prototype.$GRID_SORT_PROPERTY = sortProperty;
    if (httpInstance) Vue.prototype.$GRID_HTTP_INSTANCE = httpInstance;
    Vue.component(tagName, ChemTable);
  }
};
