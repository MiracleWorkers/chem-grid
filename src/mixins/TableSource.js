import { filterObjectNull, isFunction, getFucParamsList } from '../utils';
export default {
  methods: {
    // 常规请求数据
    async $_fetchSourceData(isReset = false) {
      const { url, pipe } = this.config;
      if (!url) return; // fetch data not by url config
      this.showGridLoading();
      try {
        let fetchResponse = await this.$_pullResponseByAxiosType();

        const { list, total, page, count } = this.$GRID_RES_SCHEMA;
        let { [list]: _list = [], [total]: _total = {}, [page]: _page = {} } = fetchResponse;

        // 1. 通过处理函数管道进行数据手动处理
        if (pipe && isFunction(pipe)) {
          _list = pipe(_list);
        }

        this.gridData = Object.freeze(_list);
        // 2. 设置统计信息
        if (_total && Object.keys(_total).length) {
          this.$_setPinnedBottomRowData(_total);
        }
        // 3. 重新勾选之前选中
        if (isReset) this.localSelected = [];
        this.$_checkSelectedRow();

        // 4. 分页信息设置
        this.pagination.total = _page[count] || 0;
      } finally {
        this.hideGridLoading();
      }
    },

    // 设置底部统计信息
    $_setPinnedBottomRowData(totalInfoObj) {
      this.gridApi.setPinnedBottomRowData([{ _rowNum: '合计', ...totalInfoObj }]);
    },

    // 打平用户不同方式获取方式： 1. 原生axios 2. 函数 3. 配置项
    $_pullResponseByAxiosType() {
      const _gridParams = filterObjectNull({
        ...this.localParams,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      });

      if (isFunction(this.config.url)) {
        // 不依赖httpInstance，调用url函数
        return this.config.url.call(this, _gridParams);
      }
      const funcParams = getFucParamsList(this.$GRID_HTTP_INSTANCE);
      const funcName = this.$GRID_HTTP_INSTANCE.name;

      if (funcParams.length === 0 && funcName === 'wrap') {
        // axios原始使用方式，只能get方式
        return this.$GRID_HTTP_INSTANCE(this.config.url, {
          params: _gridParams
        });
      } else {
        // 通过配置Schema封装，推荐
        return this.$GRID_HTTP_INSTANCE(this.config.url, _gridParams);
      }
    },

    // clientSide模式勾选
    $_clientSideSelectedData() {
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

    // serverSide模式勾选
    $_serverSideSelectedData() {
      this.localSelected = this.gridApi.getSelectedRows();
    },

    $_checkSelectedRow() {
      const _primaryKey = this.rowKey;
      this.$nextTick(() => {
        this.gridApi.forEachNode(node => {
          node.setSelected(this.localSelected.some(item => item[_primaryKey] === node.data[_primaryKey]));
        });
      });
    },

    // 无限加载数据
    $_infiniteScroll() {
      const sourceData = {
        getRows: params => {
          this.$_pullResponseByAxiosType()
            .then(response => {
              const { pipe } = this.config;
              const { list, total, page, count } = this.$GRID_RES_SCHEMA;
              let { [list]: _list = [], [total]: _total = {}, [page]: _page = {} } = response;

              if (pipe && isFunction(pipe)) {
                _list = pipe(_list);
              }

              if (_total && Object.keys(_total).length) {
                this.$_setPinnedBottomRowData(_total);
              }
              const lastRow = _page[count] > params.request.endRow ? null : _page[count];
              params.successCallback(_list, lastRow);

              this.pagination.currentPage += 1;
            })
            .catch(error => {
              params.failCallback();
              console.error(error);
            });
        }
      };
      return sourceData;
    }
  }
};
