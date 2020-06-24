import { filterObjectNull, isFunction } from '../utils';
export default {
  methods: {
    async $_fetchSourceData() {
      const { url, pipe } = this.config;
      if (!url) return; // fetch data not by url config
      this.showGridLoading();
      try {
        let fetchResponse = await this.$GRID_HTTP_INSTANCE(this.config.url, {
          params: filterObjectNull({
            ...this.localParams,
            currentPage: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          })
        });
        // 1. 通过处理函数管道进行数据手动处理
        if (pipe && isFunction(pipe)) {
          fetchResponse = pipe(fetchResponse);
        }
        const {
          customPageList,
          customTotal = {},
          page: { totalItem = 10 }
        } = fetchResponse;
        this.gridApi.setRowData(customPageList);
        // 2. 设置统计信息
        if (customTotal && Object.keys(customTotal).length) {
          this.gridApi.setPinnedBottomRowData([{ _rowNum: '合计', ...customTotal }]);
        }
        // 3. 重新勾选之前选中
        this.$_checkSelectedRow();
        // 4. 分页信息设置
        this.pagination.total = totalItem;
      } finally {
        this.hideGridLoading();
      }
    },
    $_syncSelectedData() {
      const _primaryKey = this.rowKey;
      const _currentPageData = [];
      this.gridApi.forEachNode(node => _currentPageData.push(node.data));
      const _currentPageSelected = this.gridApi.getSelectedRows();
      const _currentPageUnselect = _currentPageData.filter(
        item => !_currentPageSelected.some(row => row[_primaryKey] === item[_primaryKey])
      );
      const removeAfter = this.localSelected.filter(
        item => !_currentPageUnselect.some(row => row[_primaryKey] === item[_primaryKey])
      );
      _currentPageSelected.forEach(item => {
        if (!removeAfter.some(row => row[_primaryKey] === item[_primaryKey])) {
          removeAfter.push(item);
        }
      });
      this.localSelected = removeAfter;
    },
    $_checkSelectedRow() {
      const _primaryKey = this.rowKey;
      this.gridApi.forEachNode(node => {
        node.setSelected(this.localSelected.some(item => item[_primaryKey] === node.data[_primaryKey]));
      });
    }
  }
};
