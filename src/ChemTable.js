import { AgGridVue } from 'ag-grid-vue';
import localeText from './local/localeText';
import 'chem-table-enterprise';

import mixinSource from './mixins/TableSource';
import mixinIframeComponents from './mixins/TableSlotComponents';
import { defaultTableConfig, defaultTableItemConfig } from './DefaultConfig';

export default {
  name: 'chem-table',
  inheritAttrs: false,
  components: { AgGridVue },
  mixins: [mixinSource, mixinIframeComponents],
  provide() {
    return {
      Provider: this
    };
  },
  props: {
    config: {
      required: true,
      default: () => defaultTableConfig
    },
    params: {
      required: false,
      default: () => ({})
    },
    auth: {
      required: false,
      default: () => ({ columns: [], buttons: [] })
    }
  },
  data() {
    return {
      gridApi: null,
      columnApi: null,
      localParams: this.params,
      localSelected: [],
      rowKey: this.config.rowKey || defaultTableConfig.rowKey,
      pagination: {
        pageCount: this.config.pageCount || defaultTableConfig.pageCount,
        pageSize: 50,
        total: 10,
        currentPage: 1,
        disabled: false
      }
    };
  },
  watch: {
    params: {
      handler: function(newParams) {
        this.localParams = newParams;
      },
      deep: true
    }
  },
  mounted() {
    this.gridApi = this.localGridOption.api;
    this.columnApi = this.localGridOption.columnApi;
    if (this.isInitialData === false) return;
    this.$_fetchSourceData();
  },

  computed: {
    localGridOption() {
      if (this.validateConfig(this.config) === false) return {};
      const { infiniteScroll, sortable, items, showIndex, multiple, sortConfig, url } = {
        ...defaultTableConfig,
        ...this.config
      };
      const _columnDefs = [];
      if (multiple || defaultTableConfig.multiple) {
        _columnDefs.push({
          pinned: 'left',
          width: 40,
          checkboxSelection: true,
          suppressMenu: true,
          headerCheckboxSelection: true
        });
      }
      if (showIndex || defaultTableConfig.showIndex) {
        _columnDefs.push({
          headerName: '#',
          field: '_rowNum',
          pinned: 'left',
          width: 50,
          suppressMenu: true,
          valueGetter: params => {
            const value = params.data._rowNum;
            const _currentPage = this.pagination.currentPage;
            const _pageSize = this.pagination.pageSize;
            return value ? value : (_currentPage - 1) * _pageSize + params.node.rowIndex + 1;
          },
          resizable: true
        });
      }
      items.forEach(item => {
        const _column = {
          headerName: item.label,
          field: item.column,
          sortable: item.sortable || sortable,
          pinned: item.pin || defaultTableItemConfig.pin,
          hide: item.hide || defaultTableItemConfig.hide,
          width: item.width || null,
          resizable: true,
          filter: true,
          menuTabs: ['generalMenuTab', 'filterMenuTab'],
          valueFormatter: ({ value, data }) => {
            if (item.formatter) return item.formatter.call(null, value, data);
            return value;
          }
        };
        if (item.slot) _column['cellRenderer'] = item.slot;
        if (url) _column['comparator'] = () => null; // disable sort default action
        _columnDefs.push(_column);
      });

      const statusBarConfig = {
        statusPanels: [{ statusPanel: 'renderPaginationTotal', align: 'left' }, { statusPanel: 'renderPagination' }]
      };

      return {
        columnDefs: _columnDefs,
        rowModelType: infiniteScroll ? 'infinite' : 'clientSide',
        localeText: Object.freeze(localeText),
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        suppressMultiSort: true,
        enableRangeSelection: true,
        sortingOrder: sortConfig,
        frameworkComponents: this.$_registerSlotComponents(),
        statusBar: statusBarConfig,
        ...this.$attrs
      };
    }
  },
  methods: {
    validateConfig(config) {
      const { items } = config;
      if (!Array.isArray(items)) {
        console.error('items配置项需为Array,请检查配置');
        return false;
      } else if (!items.every(item => item.column)) {
        console.error('items中每个列都需配置column字段,请检查配置');
        return false;
      }
      return true;
    },
    showGridLoading() {
      this.pagination.disabled = true;
      this.gridApi.showLoadingOverlay();
    },
    hideGridLoading() {
      this.pagination.disabled = false;
      this.gridApi.hideOverlay();
    },
    // ag-grid可以进行多column排序，但日常业务中不多见，此处仅处理单sort的情况
    listenSortChange() {
      const _currentSortStatus = this.gridApi.getSortModel()[0];
      this.localParams[this.$GRID_SORT_PROPERTY] = _currentSortStatus
        ? `${_currentSortStatus.colId} ${_currentSortStatus.sort}`
        : '';
      this.$_fetchSourceData();
    },
    listenRowDbClicked(params) {
      console.log(params);
    }
  },
  render(h) {
    return h(
      AgGridVue.name,
      {
        class: 'ag-theme-balham',
        attrs: {
          gridOptions: this.localGridOption
        },
        on: {
          sortChanged: this.listenSortChange,
          selectionChanged: this.$_syncSelectedData,
          rowDoubleClicked: this.listenRowDbClicked,
          ...this.$listeners
        }
      },
      AgGridVue
    );
  }
};
