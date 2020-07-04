interface ITableConfig {
  id: string;
  rowKey?: string;
  hasPage?: boolean;
  infiniteScroll?: boolean;
  isInitialData?: boolean;
  sortable?: boolean;
  multiple?: boolean;
  showIndex?: boolean;
  url?: string;
  pipe?: Function;
  sortConfig?: string[];
  pageCount?: number;
  items: ITableItemConfig[];
  buttons?: ITableOperateConfig;
}

interface ITableItemConfig {
  column: string;
  label: string;
  width: number;
  sortable?: boolean;
  slot?: string;
  formatter?: Function;
  pin?: 'left' | 'right' | null;
  hide?: boolean;
}

interface ITableOperateConfig {
  label: string;
  auth?: string;
  show?: boolean | Function<boolean>;
  click: Function;
}
