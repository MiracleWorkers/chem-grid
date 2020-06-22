export interface ITableConfig {
  rowKey?: string;
  hasPage?: boolean;
  isLoopSelect?: boolean;
  infiniteScroll?: boolean;
  isInitialData?: boolean;
  sortable?: boolean;
  multiple?: boolean;
  showIndex?: boolean;
  url?: string;
  pipe?: Function;
  sortConfig?: string[];
  items: ITableItemConfig[];
}

export interface ITableItemConfig {
  column: string;
  label: string;
  width: number;
  sortable?: boolean;
  slot?: string;
  formatter?: Function;
  pin?: 'left' | 'right' | null;
  hide?: boolean;
}
