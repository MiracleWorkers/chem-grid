import { AgGridVue } from 'ag-grid-vue';
import localeText from './local/localeText';
import 'chem-table-enterprise';

import mixinSource from './mixins/TableSource';
import mixinIframeComponents from './mixins/TableSlotComponents';
import { defaultTableConfig, defaultTableItemConfig } from './DefaultConfig';
import {
  isObject,
  isArray,
  swapArrElement,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  deepClone
} from './utils';

import RenderPagination from './render/RenderPagination.js';
import RenderPaginationTotal from './render/RenderPaginationTotal.js';
import RenderCustomizePanel from './render/RenderCustomizePanel.js';
import RenderHandleButtons from './render/RenderHandleButtons.js';

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
    },
    totalInfo: {
      required: false,
      validator: value => isObject(value),
      default: () => ({})
    }
  },
  data() {
    return {
      gridApi: null,
      columnApi: null,

      gridOptions: {},
      gridData: [],

      localParams: this.params,
      localSelected: [],
      localColumns: [],
      panelColumns: [],

      registerComponents: {
        renderPagination: RenderPagination,
        renderPaginationTotal: RenderPaginationTotal,
        renderCustomizePanel: RenderCustomizePanel,
        renderHandleButtons: RenderHandleButtons
      },

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
    },
    totalInfo: {
      handler: function(newTotalInfo) {
        this.gridApi.setPinnedBottomRowData([{ _rowNum: '合计', ...newTotalInfo }]);
      },
      deep: true
    },
    config: {
      handler: function() {
        this.localColumns = this.generateColumnConfig();
        this.panelColumns = this.generateColumnConfig();
        this.$nextTick(() => {
          this.gridApi.refreshCells({ force: true, suppressFlash: false });
        });
      },
      deep: true
    }
  },
  created() {
    this.gridOptions = this.generateGridOptions();
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.columnApi = this.gridOptions.columnApi;
    this.registerComponents = { ...this.registerComponents, ...this.$_registerSlotComponents() };
    this.localColumns = this.generateColumnConfig();
    this.panelColumns = this.generateColumnConfig();
    if (this.isInitialData === false) return;
    this.$_fetchSourceData();
  },

  computed: {
    // 权限校验columns
    realColumnsAfterAuth() {
      const { items = [] } = this.config;
      if (!this.auth) return items;
      const authColumns = this.auth ? this.auth.columns : [];

      const _filterItems = [];
      items.forEach(item => {
        const target = authColumns.find(t => t.code === item.column);
        if (target) _filterItems.push({ ...item, label: target.name });
      });
      return _filterItems;
    }
  },
  methods: {
    generateGridOptions() {
      if (this.validateConfig(this.config) === false) return {};
      const { infiniteScroll, sortConfig, multiple } = {
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
        rowSelection: multiple ? 'multiple' : 'single',
        suppressRowClickSelection: true,
        suppressDragLeaveHidesColumns: true, // 禁止列拖动隐藏
        rowDeselection: true, // 通过space取消选择
        suppressMultiSort: true, // 不允许多排序
        enableRangeSelection: true,
        sortingOrder: sortConfig,
        statusBar: _statusBarConfig, // 底部状态栏
        sideBar: _customizePanel, // 自定义侧边栏
        icons: _customizeIcon, // 自定义图标
        immutableColumns: true,
        ...this.$attrs
      };
    },
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
          cellStyle: { display: 'flex', alignItems: 'center' },
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
      // 处理用户传入的配置
      this.realColumnsAfterAuth.forEach(item => {
        const _column = {
          headerName: item.label,
          field: item.column,
          colId: item.column,
          sortable: item.sortable || sortable,
          pinned: item.pin || defaultTableItemConfig.pin,
          hide: item.hide || defaultTableItemConfig.hide,
          resizable: true,
          filter: true,
          menuTabs: ['generalMenuTab', 'filterMenuTab'],
          valueFormatter: ({ value, data }) => {
            if (item.formatter) return item.formatter.call(null, value, data);
            return value;
          }
        };
        if (item.width) _column['width'] = item.width;
        if (item.buttons) {
          _column['cellRendererFramework'] = this.registerComponents.renderHandleButtons(item.buttons);
        }
        if (item.slot) {
          _column['cellRendererFramework'] = this.registerComponents[item.slot];
          _column['autoHeight'] = true;
        }
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
    onColumnMoved({ column, toIndex }) {
      if (column === null) return; // api操作
      const _movingColumnIndex = this.panelColumns.findIndex(c => c.field === column.colId);
      this.panelColumns = swapArrElement(this.panelColumns, _movingColumnIndex, toIndex);
      this.handleSyncStorageSet();
    },
    onColumnPinned({ column, pinned }) {
      if (column === null) return; // api操作
      const _pinnedColumnIndex = this.panelColumns.findIndex(c => c.field === column.colId);
      this.panelColumns[_pinnedColumnIndex].pinned = pinned;
      this.handleSyncStorageSet();
    },
    onColumnResized({ column, finished, source }) {
      if (finished === false || source === 'api' || column === null) return;
      const _resizeColumnIndex = this.panelColumns.findIndex(c => c.field === column.colId || c.colId === column.colId);
      this.panelColumns[_resizeColumnIndex].width = column.actualWidth;
      this.handleSyncStorageSet();
    },
    refresh(isReset = false) {
      this.$_fetchSourceData(isReset);
    },
    setData(sourceData = []) {
      this.gridApi.setRowData(sourceData);
      this.gridData = Object.freeze(sourceData);
    },
    getData() {
      return this.gridData;
    },
    getCustomizeMenuItems(params) {
      const defaultItems = params.defaultItems.slice(0, 3);
      defaultItems.push('separator');
      defaultItems.push({
        name: '重置全部列',
        action: this.resetColumnsConfig
      });
      return defaultItems;
    },
    resetColumnsConfig() {
      removeLocalStorage(this.$GRID_SALT + '_' + this.config.id);
      const initialColumns = this.generateColumnConfig();
      this.panelColumns = deepClone(initialColumns);
      this.localColumns = deepClone(initialColumns);
      this.$nextTick(() => {
        // TODO: 此处gridApi.setColumnDefs无效，后续看版本升级会不会修复
        this.columnApi.resetColumnState();
        initialColumns.forEach(item => {
          this.columnApi.setColumnWidth(item.colId, item.width || 200, true);
        });
      });
    },
    getContextMenuItems() {
      return ['copy', 'copyWithHeaders', 'separator', 'export'];
    }
  },
  render(h) {
    return h(
      AgGridVue.name,
      {
        class: 'ag-theme-balham',
        attrs: {
          context: this,
          gridOptions: this.gridOptions,
          columnDefs: this.localColumns,
          rowData: this.gridData,
          frameworkComponents: this.registerComponents,
          getMainMenuItems: this.getCustomizeMenuItems,
          getContextMenuItems: this.getContextMenuItems
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
