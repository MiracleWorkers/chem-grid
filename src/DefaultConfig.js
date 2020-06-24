const defaultTableConfig = {
  rowKey: 'id', // 主键
  hasPage: false, // 是否显示分页
  isLoopSelect: true, // 分页模式下是否循环选中
  infiniteScroll: false, // 无限循环模式
  isInitialData: true, // 初始化加载数据
  sortable: true,
  sortConfig: ['desc', 'asc', null],
  multiple: false,
  showIndex: true,
  pageCount: 7
};

const defaultTableItemConfig = {
  sortable: true,
  pin: null,
  hide: false
};

export { defaultTableConfig, defaultTableItemConfig };
