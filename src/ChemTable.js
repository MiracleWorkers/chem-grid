import { AgGridVue } from 'ag-grid-vue';
import localeText from './local/localeText';
import 'chem-table-enterprise';

import mixinSource from './mixins/TableSource';
import mixinIframeComponents from './mixins/TableSlotComponents';
import { defaultTableConfig, defaultTableItemConfig } from './DefaultConfig';
import { isObject, isArray, swapArrElement, setLocalStorage, getLocalStorage, deepClone } from './utils';

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
      localColumns: [],
      panelColumns: [],

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
  created() {
    this.localColumns = this.generateColumnConfig();
    this.panelColumns = this.generateColumnConfig();
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
      const { infiniteScroll, sortConfig } = {
        ...defaultTableConfig,
        ...this.config
      };

      const _statusBarConfig = {
        statusPanels: [{ statusPanel: 'renderPaginationTotal', align: 'left' }, { statusPanel: 'renderPagination' }]
      };

      const _customizePanel = {
        toolPanels: [
          {
            id: 'customizeColumns',
            labelDefault: '自定义',
            iconKey: 'aggregation',
            toolPanel: 'renderCustomizePanel'
          }
        ]
      };

      const _customizeIcon = {
        aggregation: '<span class="ag-icon ag-icon-aggregation"></span>'
      };

      return {
        rowModelType: infiniteScroll ? 'infinite' : 'clientSide',
        localeText: Object.freeze(localeText),
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        suppressDragLeaveHidesColumns: true, // 禁止列拖动隐藏
        rowDeselection: true, // 通过space取消选择
        suppressMultiSort: true, // 不允许多排序
        enableRangeSelection: true,
        sortingOrder: sortConfig,
        frameworkComponents: this.$_registerSlotComponents(),
        statusBar: _statusBarConfig, // 底部状态栏
        sideBar: _customizePanel, // 自定义侧边栏
        icons: _customizeIcon, // 自定义图标
        ...this.$attrs
      };
    }
  },
  methods: {
    generateColumnConfig() {
      const { sortable, showIndex, multiple, url } = {
        ...defaultTableConfig,
        ...this.config
      };
      const _columnDefs = [];
      if (multiple || defaultTableConfig.multiple) {
        _columnDefs.push({
          colId: '_checkbox',
          pinned: 'left',
          width: 40,
          hide: false,
          checkboxSelection: true,
          suppressMenu: true,
          headerCheckboxSelection: true
        });
      }
      if (showIndex || defaultTableConfig.showIndex) {
        _columnDefs.push({
          headerName: '#',
          colId: '_rowNum',
          pinned: 'left',
          hide: false,
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
          colId: item.column,
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

      return this.smartRemakeColumnsSet(_columnDefs);
    },
    smartRemakeColumnsSet(columnConfig) {
      const _passInConfig = deepClone(columnConfig);
      const _storageConfig = getLocalStorage(this.$GRID_SALT + '_' + this.config.id) || [];
      const _processed = [];
      _storageConfig.forEach(column => {
        const _target = _passInConfig.find(c => c.colId === column.colId || c.headerName === column.headerName);
        if (_target) {
          _processed.push({
            ..._target,
            pinned: column.pinned,
            hide: column.hide,
            width: column.width
          });
          _target._isDeal = true;
        }
      });
      const noDealList = _passInConfig.filter(c => !c._isDeal);
      return [..._processed, ...noDealList];
    },
    validateConfig(config) {
      const { items, id } = config;
      if (!id) {
        console.error('[chem-grid]:id字段为必填项,请配置并确认其唯一性，该字段用于localStorage中自定义配置的存储');
        return false;
      } else if (!Array.isArray(items)) {
        console.error('[chem-grid]:items配置项需为Array,请检查配置');
        return false;
      } else if (!items.every(item => item.column)) {
        console.error('[chem-grid]:items中每个列都需配置column字段,请检查配置');
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
    handleSyncStorageSet() {
      setLocalStorage(this.$GRID_SALT + '_' + this.config.id, this.panelColumns);
    },
    onColumnMoved({ column: { colId }, toIndex }) {
      const _movingColumnIndex = this.panelColumns.findIndex(c => c.field === colId);
      this.panelColumns = swapArrElement(this.panelColumns, _movingColumnIndex, toIndex);
      this.handleSyncStorageSet();
    },
    onColumnPinned({ column: { colId }, pinned }) {
      const _pinnedColumnIndex = this.panelColumns.findIndex(c => c.field === colId);
      this.panelColumns[_pinnedColumnIndex].pinned = pinned;
      this.handleSyncStorageSet();
    },
    onColumnResized({ column: { actualWidth, colId }, finished }) {
      if (finished === false) return;
      const _resizeColumnIndex = this.panelColumns.findIndex(c => c.field === colId || c.colId === colId);
      this.panelColumns[_resizeColumnIndex].width = actualWidth;
      this.handleSyncStorageSet();
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
          gridOptions: this.localGridOption,
          columnDefs: this.localColumns
        },
        on: {
          ...this.$listeners,
          sortChanged: this.onSortChanged,
          selectionChanged: this.$_syncSelectedData,
          rowDoubleClicked: this.onRowDoubleClicked,
          cellKeyDown: this.onCellKeyDown,
          columnMoved: this.onColumnMoved,
          columnPinned: this.onColumnPinned,
          columnResized: this.onColumnResized
        }
      },
      AgGridVue
    );
  }
};
