import '../styles/renderPagination.scss';
import Vue from 'vue';

/**
 * -----------------------
 *  组件内部使用的数据被定义在父组件中，直接通过Provide/Inject来获取父组件中的值，然后进行操作
 *  注意: 该组件数据流不为单项数据流，直接修改了父组件的值
 * -----------------------
 */
const pagination = {
  inject: ['Provider'],
  computed: {
    maxPage() {
      const { pageSize, total } = this.Provider.pagination;
      return Math.ceil(total / pageSize);
    },
    dynamicPageList() {
      const { currentPage, pageCount } = this.Provider.pagination;
      if (pageCount >= this.maxPage) {
        return Array.from({ length: this.maxPage }, (_, index) => index + 1);
      }
      let firstNum, latterNum;
      let halfNum = Math.ceil(pageCount / 2);
      if (this.maxPage - currentPage <= halfNum) {
        latterNum = this.maxPage - currentPage;
        firstNum = pageCount - latterNum - 1;
      } else if (currentPage < halfNum) {
        firstNum = currentPage - 1;
        latterNum = pageCount - firstNum - 1;
      } else {
        latterNum = halfNum;
        firstNum = pageCount - halfNum - 1;
      }
      const preList = Array.from({ length: firstNum }, (_, index) => currentPage - (index + 1)).reverse();
      const nextList = Array.from({ length: latterNum }, (_, index) => currentPage + (index + 1));
      return [...preList, currentPage, ...nextList];
    }
  },
  render() {
    const { currentPage, disabled } = this.Provider.pagination;
    const showFirstButton = this.dynamicPageList.indexOf(1) === -1;
    const showLastButton = this.dynamicPageList.indexOf(this.maxPage) === -1;
    return (
      <div class="render_pagination">
        <ul onClick={this.handlePaginationLink} class={disabled ? 'pagination-disabled' : null}>
          {showFirstButton ? (
            <li class={currentPage === 1 ? 'pagination-button_disabled' : null} data-index="first">
              <span class="ag-icon ag-icon-first" data-index="first"></span>
            </li>
          ) : null}
          <li class={currentPage === 1 ? 'pagination-button_disabled' : null} data-index="preIndex">
            <span class="ag-icon ag-icon-expanded" data-index="preIndex"></span>
          </li>
          {this.dynamicPageList.map(index => {
            const currentActiveStatus = currentPage === index ? 'pagination-item_active' : null;
            return (
              <li tabindex="0" data-index={index} class={currentActiveStatus}>
                {index}
              </li>
            );
          })}
          <li class={currentPage === this.maxPage ? 'pagination-button_disabled' : null} data-index="nextIndex">
            <span class="ag-icon ag-icon-contracted" data-index="nextIndex"></span>
          </li>
          {showLastButton ? (
            <li class={currentPage === this.maxPage ? 'pagination-button_disabled' : null} data-index="last">
              <span class="ag-icon ag-icon-last" data-index="last"></span>
            </li>
          ) : null}
          <li class="select_pagination-size">
            <span class="ag-icon ag-icon-small-down"></span>
            <select vModel={this.Provider.pagination.pageSize} onChange={this.handlePageSizeChange}>
              <option>10</option>
              <option>50</option>
              <option>100</option>
              <option>1000</option>
            </select>
          </li>
          <li class="quick-input">
            <span>跳至</span>
            <input type="number" disabled={disabled} onKeyup={this.handleQuickLink} />
            <span>页</span>
          </li>
        </ul>
      </div>
    );
  },
  methods: {
    handlePageSizeChange() {
      this.Provider.pagination.currentPage = 1;
      this.$nextTick(() => this.Provider.$_fetchSourceData());
    },
    handleQuickLink(evt) {
      if (evt.keyCode !== 13) return;
      if (!!evt.target.value) {
        if (+evt.target.value > this.maxPage) {
          evt.target.value = null;
          return;
        }
        this.Provider.pagination.currentPage = +evt.target.value;
        evt.target.value = null;
        this.Provider.$_fetchSourceData();
      }
    },
    handlePaginationLink(bubbleEvent) {
      const { index } = bubbleEvent.target.dataset;
      const { currentPage } = this.Provider.pagination;
      if (!index) return;
      switch (index) {
        case 'first':
          this.Provider.pagination.currentPage = 1;
          break;
        case 'preIndex':
          this.Provider.pagination.currentPage = currentPage - 1 > 0 ? currentPage - 1 : currentPage;
          break;
        case 'nextIndex':
          this.Provider.pagination.currentPage = currentPage + 1 > this.maxPage ? currentPage : currentPage + 1;
          break;
        case 'last':
          this.Provider.pagination.currentPage = this.maxPage;
          break;
        default:
          this.Provider.pagination.currentPage = index * 1;
      }
      if (this.Provider.pagination.currentPage === currentPage) return;
      this.Provider.$_fetchSourceData();
    }
  }
};

export default Vue.extend(pagination);
