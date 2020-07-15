import { gridComponent } from './component';
interface ITableItemConfig {
  column: string;
  label: string;
  width: number;
  sortable?: boolean;
  slot?: string;
  formatter?: Function;
  pin?: 'left' | 'right' | null;
  hide?: boolean;
  buttons?: ITableOperateConfig[];
}

interface ITableOperateConfig {
  label: string;
  auth?: string;
  show?: boolean;
  disabled?: boolean;
  click: Function;
}

interface IAuthColumn {
  code: string;
  name: string;
}

export interface ITableConfig {
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
}
export interface ITableAuth {
  columns: IAuthColumn[];
  buttons: string[];
}

export declare class chemGrid extends gridComponent {
  /**
   * 配置表格用于展示的配置项
   * @default null
   * @type ITableItemConfig
   */
  config: ITableItemConfig;

  /**
   * 用于通过url查询时用到的参数
   * @default {}
   * @type Record<string, any>
   */
  params?: Record<string, any>;

  /**
   * 表格列权限和按钮权限配置
   * @default {}
   * @type ITableAuth
   */
  auth?: ITableAuth;

  /**
   * 表格合计信息展示
   * @default {}
   * @type Record<string, any>
   */
  totalInfo?: Record<string, any>;

  /**
   * 删除本地缓存的表格配置，重置表格配置
   */
  resetColumnsConfig(): void;

  /**
   * 获取表格的数据
   * @returns {Record<string, any>}
   */
  getData(): Record<string, any>;

  /**
   * 设置表格展示数据
   * @param {Record<string, any>[]} sourceData 数据
   */
  setData(sourceData: Record<string, any>[]): void;

  /**
   * 手动刷新表格，重新调用接口获取数据
   * @param {boolean} isReset 完全重置 - 将删除之前已选择row
   */
  refresh(isReset: boolean): void;

  /**
   * 打开表格Loading
   */
  showGridLoading(): void;

  /**
   * 关闭表格Loading
   */
  hideGridLoading(): void;
}
