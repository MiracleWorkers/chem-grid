import '../styles/renderPagination.scss';
import Vue from 'vue';

const pagination = {
  props: {
    pageCount: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 350
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      local_currentPage: this.currentPage,
      local_pageSize: this.pageSize,
      local_total: this.total,
      local_pageCount: this.pageCount
    };
  },
  computed: {
    maxPage() {
      return Math.ceil(this.local_total / this.local_pageSize);
    },
    dynamicPageList() {
      if (this.local_pageCount >= this.maxPage) {
        return Array.from({ length: this.maxPage }, (_, index) => index + 1);
      }
      let firstNum, latterNum;
      let halfNum = Math.ceil(this.local_pageCount / 2);
      if (this.maxPage - this.local_currentPage <= halfNum) {
        latterNum = this.maxPage - this.local_currentPage;
        firstNum = this.local_pageCount - latterNum - 1;
      } else if (this.local_currentPage < halfNum) {
        firstNum = this.local_currentPage - 1;
        latterNum = this.local_pageCount - firstNum - 1;
      } else {
        latterNum = halfNum;
        firstNum = this.local_pageCount - halfNum - 1;
      }
      const preList = Array.from({ length: firstNum }, (_, index) => this.local_currentPage - (index + 1)).reverse();
      const nextList = Array.from({ length: latterNum }, (_, index) => this.local_currentPage + (index + 1));
      return [...preList, this.local_currentPage, ...nextList];
    }
  },
  render() {
    const showFirstButton = this.dynamicPageList.indexOf(1) === -1;
    const showLastButton = this.dynamicPageList.indexOf(this.maxPage) === -1;
    return (
      <div class="render_pagination">
        <ul onClick={this.handlePaginationLink}>
          {showFirstButton ? (
            <li class={this.local_currentPage === 1 ? 'pagination-button_disabled' : null} data-index="first">
              <span class="ag-icon ag-icon-first" data-index="first"></span>
            </li>
          ) : null}
          <li class={this.local_currentPage === 1 ? 'pagination-button_disabled' : null} data-index="preIndex">
            <span class="ag-icon ag-icon-expanded" data-index="preIndex"></span>
          </li>
          {this.dynamicPageList.map(index => {
            const currentActiveStatus = this.local_currentPage === index ? 'pagination-item_active' : null;
            return (
              <li tabindex="0" data-index={index} class={currentActiveStatus}>
                {index}
              </li>
            );
          })}
          <li
            class={this.local_currentPage === this.maxPage ? 'pagination-button_disabled' : null}
            data-index="nextIndex"
          >
            <span class="ag-icon ag-icon-contracted" data-index="nextIndex"></span>
          </li>
          {showLastButton ? (
            <li class={this.local_currentPage === this.maxPage ? 'pagination-button_disabled' : null} data-index="last">
              <span class="ag-icon ag-icon-last" data-index="last"></span>
            </li>
          ) : null}
          <li class="quick-input">
            <span>跳至</span>
            <input type="number" onKeyup={this.handleQuickLink} />
            <span>页</span>
          </li>
        </ul>
      </div>
    );
  },
  methods: {
    handleQuickLink(evt) {
      if (evt.keyCode !== 13) return;
      if (!!evt.target.value) {
        if (+evt.target.value > this.maxPage) {
          evt.target.value = null;
          return;
        }
        this.local_currentPage = +evt.target.value;
        evt.target.value = null;
      }
    },
    handlePaginationLink(bubbleEvent) {
      const { index } = bubbleEvent.target.dataset;
      if (!index) return;
      switch (index) {
        case 'first':
          this.local_currentPage = 1;
          break;
        case 'preIndex':
          this.local_currentPage = this.local_currentPage - 1 > 0 ? this.local_currentPage - 1 : this.local_currentPage;
          break;
        case 'nextIndex':
          this.local_currentPage =
            this.local_currentPage + 1 > this.maxPage ? this.local_currentPage : this.local_currentPage + 1;
          break;
        case 'last':
          this.local_currentPage = this.maxPage;
          break;
        default:
          this.local_currentPage = index * 1;
      }
    }
  }
};

export default Vue.extend(pagination);
