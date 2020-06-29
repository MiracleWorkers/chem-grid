import { AgGridVue } from 'ag-grid-vue';
import localeText from './local/localeText';
import 'chem-table-enterprise';

import mixinSource from './mixins/TableSource';
import mixinIframeComponents from './mixins/TableSlotComponents';
import { defaultTableConfig, defaultTableItemConfig } from './DefaultConfig';
import { isObject, isArray } from './utils';

export default {
  name: 'chem-grid',
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
      validator: value => {
        return isObject(value) && isArray(value.columns) && isArray(value.buttons);
      }
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
    // 权限校验
    realColumnsAndButtons() {
      const { items = [], buttons = [] } = this.config;
      if (!this.auth) return { items, buttons };
      const authColumns = this.auth ? this.auth.columns : [];
      const authButtons = this.auth ? this.auth.buttons : [];

      const _filterItems = [];
      items.forEach(item => {
        const target = authColumns.find(t => t.code === item.column);
        if (target) _filterItems.push({ ...item, label: target.name });
      });
      const _filterButtons = buttons.filter(btn => authButtons.indexOf(btn) > -1);
      return { items: _filterItems, buttons: _filterButtons };
    },
    localGridOption() {
      if (this.validateConfig(this.config) === false) return {};
      const { infiniteScroll, sortable, showIndex, multiple, sortConfig, url } = {
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
      this.realColumnsAndButtons.items.forEach(item => {
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
        rowDeselection: true, // 通过space取消选择
        suppressMultiSort: true, // 不允许多排序
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
    onSortChanged() {
      const _currentSortStatus = this.gridApi.getSortModel()[0];
      this.localParams[this.$GRID_SORT_PROPERTY] = _currentSortStatus
        ? `${_currentSortStatus.colId} ${_currentSortStatus.sort}`
        : '';
      this.$_fetchSourceData();
    },
    onRowDoubleClicked(params) {
      this.$emit('row-select', params.data);
    },
    onCellKeyDown(e) {
      if (e.event.key === 'Enter') {
        this.$emit('row-select', e.data);
      }
    },
    refresh(isReset = false) {
      this.$_fetchSourceData(isReset);
    },
    setData(sourceData = []) {
      this.gridApi.setRowData(sourceData);
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
          sortChanged: this.onSortChanged,
          selectionChanged: this.$_syncSelectedData,
          rowDoubleClicked: this.onRowDoubleClicked,
          cellKeyDown: this.onCellKeyDown,
          ...this.$listeners
        }
      },
      AgGridVue
    );
  }
};
