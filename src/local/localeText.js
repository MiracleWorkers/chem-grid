const localeText = {
  // for filter panel
  page: 'Page',
  more: 'More',
  to: 'To',
  of: 'Of',
  next: 'Next',
  last: 'Last',
  first: 'First',
  previous: 'Previous',
  loadingOoo: '正在加载...',

  // for set filter
  selectAll: '选择全部',
  searchOoo: '查找...',
  blanks: 'Blanks',

  // for number filter and text filter
  filterOoo: 'Filter...',
  equals: 'Equals',
  notEqual: 'NotEqual',

  // for the date filter
  dateFormatOoo: 'Yyyy-mm-dd',

  // for number filter
  lessThan: 'LessThan',
  greaterThan: 'GreaterThan',
  lessThanOrEqual: 'LessThanOrEqual',
  greaterThanOrEqual: 'GreaterThanOrEqual',
  inRange: 'InRange',
  inRangeStart: 'RangeStart',
  inRangeEnd: 'RangeEnd',

  // for text filter
  contains: 'Contains',
  notContains: 'NotContains',
  startsWith: 'Starts with',
  endsWith: 'Ends with',

  // filter conditions
  andCondition: 'AND',
  orCondition: 'OR',

  // filter buttons
  applyFilter: 'Apply',
  resetFilter: 'Reset',
  clearFilter: 'Clear',

  // the header of the default group column
  group: 'Group',

  // tool panel
  columns: 'Columns',
  filters: 'Filters',
  rowGroupColumns: 'Pivot Cols',
  rowGroupColumnsEmptyMessage: 'drag cols to group',
  valueColumns: 'Value Cols',
  pivotMode: 'Pivot-Mode',
  groups: 'Groups',
  values: 'Values',
  pivots: 'Pivots',
  valueColumnsEmptyMessage: 'drag cols to aggregate',
  pivotColumnsEmptyMessage: 'drag here to pivot',
  toolPanelButton: 'tool panel',

  // other
  noRowsToShow: '暂无数据',
  enabled: 'Enabled',

  // enterprise menu
  pinColumn: '固定列',
  valueAggregation: 'laValue Agg',
  autosizeThiscolumn: '本列自动宽度',
  autosizeAllColumns: '所有列自动宽度',
  groupBy: 'laGroup by',
  ungroupBy: 'laUnGroup by',
  resetColumns: '重置所有列',
  expandAll: 'laOpen-em-up',
  collapseAll: 'laClose-em-up',
  toolPanel: 'laTool Panel',
  export: '导出',
  csvExport: '导出 CSV',
  excelExport: '导出 Excel(.xlsx)',
  excelXmlExport: '导出 Excel(.xml)',

  // enterprise menu (charts)
  pivotChartAndPivotMode: 'laPivot Chart & Pivot Mode',
  pivotChart: 'laPivot Chart',
  chartRange: 'laChart Range',

  columnChart: 'laColumn',
  groupedColumn: 'laGrouped',
  stackedColumn: 'laStacked',
  normalizedColumn: 'la100% Stacked',

  barChart: 'laBar',
  groupedBar: 'laGrouped',
  stackedBar: 'laStacked',
  normalizedBar: 'la100% Stacked',

  pieChart: 'laPie',
  pie: 'laPie',
  doughnut: 'laDoughnut',

  line: 'laLine',

  xyChart: 'laX Y (Scatter)',
  scatter: 'laScatter',
  bubble: 'laBubble',

  areaChart: 'laArea',
  area: 'laArea',
  stackedArea: 'laStacked',
  normalizedArea: 'la100% Stacked',

  // enterprise menu pinning
  pinLeft: '左边',
  pinRight: '右边',
  noPin: '取消固定',

  // enterprise menu aggregation and status bar
  sum: 'laSum',
  min: 'laMin',
  max: 'laMax',
  none: 'laNone',
  count: 'laCount',
  average: 'laAverage',
  filteredRows: 'laFiltered',
  selectedRows: 'laSelected',
  totalRows: 'laTotal Rows',
  totalAndFilteredRows: 'laRows',

  // standard menu
  copy: '复制',
  copyWithHeaders: '复制 + 标题',
  ctrlC: 'Ctrl + C',
  paste: '粘贴',
  ctrlV: 'Ctrl + V',

  // charts
  pivotChartTitle: 'laPivot Chart',
  rangeChartTitle: 'laRange Chart',
  settings: 'laSettings',
  data: 'laData',
  format: 'laFormat',
  categories: 'laCategories',
  defaultCategory: '(laNone)',
  series: 'laSeries',
  xyValues: 'laX Y Values',
  paired: 'laPaired Mode',
  axis: 'laAxis',
  color: 'laColor',
  thickness: 'laThickness',
  xType: 'laX Type',
  automatic: 'laAutomatic',
  category: 'laCategory',
  number: 'laNumber',
  time: 'laTime',
  xRotation: 'laX Rotation',
  yRotation: 'laY Rotation',
  ticks: 'laTicks',
  width: 'laWidth',
  length: 'laLength',
  padding: 'laPadding',
  chart: 'laChart',
  title: 'laTitle',
  background: 'laBackground',
  font: 'laFont',
  top: 'laTop',
  right: 'laRight',
  bottom: 'laBottom',
  left: 'laLeft',
  labels: 'laLabels',
  size: 'laSize',
  minSize: 'laMinimum Size',
  maxSize: 'laMaximum Size',
  legend: 'Legend',
  position: 'Position',
  markerSize: 'Marker Size',
  markerStroke: 'Marker Stroke',
  markerPadding: 'Marker Padding',
  itemPaddingX: 'Item Padding X',
  itemPaddingY: 'Item Padding Y',
  strokeWidth: 'Stroke Width',
  offset: 'Offset',
  offsets: 'Offsets',
  tooltips: 'Tooltips',
  callout: 'Callout',
  markers: 'Markers',
  shadow: 'Shadow',
  blur: 'Blur',
  xOffset: 'X Offset',
  yOffset: 'Y Offset',
  lineWidth: 'Line Width',
  normal: 'Normal',
  bold: 'Bold',
  italic: 'Italic',
  boldItalic: 'Bold Italic',
  predefined: 'Predefined',
  fillOpacity: 'Fill Opacity',
  strokeOpacity: 'Line Opacity',
  columnGroup: 'Column',
  barGroup: 'Bar',
  pieGroup: 'Pie',
  lineGroup: 'Line',
  scatterGroup: 'Scatter',
  areaGroup: 'Area',
  groupedColumnTooltip: 'Grouped',
  stackedColumnTooltip: 'Stacked',
  normalizedColumnTooltip: '100% Stacked',
  groupedBarTooltip: 'Grouped',
  stackedBarTooltip: 'Stacked',
  normalizedBarTooltip: '100% Stacked',
  pieTooltip: 'Pie',
  doughnutTooltip: 'Doughnut',
  lineTooltip: 'Line',
  groupedAreaTooltip: 'Grouped',
  stackedAreaTooltip: 'Stacked',
  normalizedAreaTooltip: '100% Stacked',
  scatterTooltip: 'Scatter',
  bubbleTooltip: 'Bubble',
  noDataToChart: 'No data available to be charted.',
  pivotChartRequiresPivotMode: 'Pivot Chart requires Pivot Mode enabled.'
};

export default localeText;
