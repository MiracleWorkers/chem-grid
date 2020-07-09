import 'ag-grid-community/dist/styles/ag-grid.css';
import './styles/theme.scss';

import ChemTable from './ChemTable';

const defaultComponentConfig = {
  tagName: ChemTable.name,
  httpInstance: null,
  resSchema: {
    list: 'customPageList',
    total: 'customTotal',
    page: 'page',
    count: 'totalItem'
  },
  sortProperty: 'query_order_by',
  salt: 'chem_grid'
};

export default {
  install: (Vue, customConfig) => {
    const options = { ...defaultComponentConfig, ...customConfig };
    Vue.prototype.$GRID_SORT_PROPERTY = options.sortProperty;
    Vue.prototype.$GRID_HTTP_INSTANCE = options.httpInstance;
    Vue.prototype.$GRID_RES_SCHEMA = { ...defaultComponentConfig.resSchema, ...options.resSchema };
    Vue.prototype.$GRID_SALT = options.salt;
    Vue.component(options.tagName, ChemTable);
  }
};
