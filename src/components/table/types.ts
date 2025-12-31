/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-03-11 11:51:12
 * @Desc: 
 */
import {
  DataTableProps, DataTableColumn, dataTableProps as naiveDataTableProps,
  ButtonProps, buttonProps,
  PopconfirmProps as NaivePopconfirmProps,
  DropdownProps as NaiveDropdownProps, PaginationProps
} from 'naive-ui'
import { PropType, VNodeChild, ExtractPublicPropTypes } from 'vue'
import { i18n } from '@/locales/i18n'
import { MenuMixedOption as NaiveMenuMixedOption } from 'naive-ui/es/menu/src/interface';
// import {ExtractPublicPropTypes} from 'naive-ui/es/_utils/naive'

//button size
export type Size = 'tiny' | 'small' | 'medium' | 'large';

export declare type TableColumn<T = Recordable> = DataTableColumn<T> & { hide: boolean, key?: string | number, title?: string | ((column: DataTableColumn) => VNodeChild) }

/**
 * 撑满内容区自适应高度相关配置
 */
export declare type AdaptiveConfig = {
  /** 表格距离页面底部的偏移量，默认值为 `96` */
  offsetBottom?: number;
  /** 是否固定表头，默认值为 `true` */
  fixHeader?: boolean;
  /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
  timeout?: number;
  /** 表头的 `z-index`，默认值为 `100` */
  zIndex?: number;
};

const { themeOverrides, builtinThemeOverrides, theme, pagination, ...rest } = naiveDataTableProps
export const dataTableProps = {
  ...rest,
  // remote: {type: Boolean as PropType<boolean>, default:true},
  tableLayout: { type: String as PropType<"fixed" | "auto">, default: "auto" },
  tbKey: { type: [String, Number] as PropType<string | number>, default: 't1' }, //唯一键,主要针对单页面多个表格
  title: { type: String as PropType<string>, default: i18n.global.t('layout.table.list') },//表格标题
  hasIndexCol: { type: Boolean as PropType<boolean>, default: false }, //是否序号列
  onExport: { type: Function as PropType<() => void | Promise<void>> }, //导出，传递才会显示导出按钮
  columns: { type: Array as PropType<Array<TableColumn>>, default: () => [] },  //hide表示列是否隐藏
  /** 表格是否撑满内容区自适应高度，默认 `false` */
  adaptive: { type: Boolean },
  /** 撑满内容区自适应高度相关配置 */
  adaptiveConfig: { type: Object as PropType<AdaptiveConfig>, default: { offsetBottom: 70, fixHeader: true, timeout: 60, zIndex: 100 } },
  //请求MenuMixedOption
  beforeRequest: { type: Function as PropType<(...arg: any[]) => void | Promise<any>> },
  request: { type: Function as PropType<(...arg: any[]) => Promise<any>> },
  afterRequest: { type: Function as PropType<(...arg: any[]) => void | Promise<any>> },
  disableAutoLoad: { type: Boolean, default: false }, //是否关闭页面载入自动请求数据
  //覆盖naiveDataTableProps里面的pagination,将默认值该为true，也就是默认是有分页的
  pagination: { type: [Boolean, Object] as PropType<false | PaginationProps>, default: { pageSlot: 6 } },
  hasSection: { type: Boolean as PropType<boolean>, default: false },//是否有勾选列
  hideToolbar: { type: Boolean as PropType<boolean>, default: false }
}

// export declare const tableProps :{
//   key: {type: PropType<string|number>; default: 't1'}; //唯一键,主要针对单页面多个表格
//   title: {type: PropType<string>; default: '列表'};//表格标题  //i18n.global.t('layout.table.list')
//   hasIndexCol: {type: PropType<boolean>; default:false}; //是否序号列
//   columns: {type: PropType<Array<TableColumn>>; default: []};  //hide表示列是否隐藏
//   /** 表格是否撑满内容区自适应高度，默认 `false` */
//   adaptive: {type:PropType<boolean>;default:false};
//   /** 撑满内容区自适应高度相关配置 */
//   // adaptiveConfig: {type: PropType<AdaptiveConfig>; default: {offsetBottom:96, fixHeader:true,timeout:60,zIndex:100}};
//   //请求
//   beforeRequest: {type: PropType<(...arg: any[]) => void | Promise<any>>;default:undefined};
//   request: {type: PropType<(...arg: any[]) => void | Promise<any>>;default:undefined};
//   afterRequest: {type: PropType<(...arg: any[]) => void | Promise<any>>;default:undefined};
//   disableAutoLoad: {type: PropType<boolean>, default:false} //是否关闭页面载入自动请求数据
// }

// export type TableProps = ExtractPublicPropTypes<typeof tableProps> //& Exclude<DataTableProps, 'theme'|'themeOverrides'|'builtinThemeOverrides'>


//继承属性在组件传递时候无效
export interface TableProps<T = Recordable> extends /* @vue-ignore */Omit<DataTableProps, 'theme' | 'themeOverrides' | 'builtinThemeOverrides' | 'pagination'> {
  tbKey?: string | number;  //唯一键,主要针对单页面多个表格
  title?: string;  //表格标题
  hasIndexCol?: boolean; //是否序号列
  exportable?: boolean;//是否有导出功能
  columns?: Array<TableColumn<T>>; //hide表示列是否隐藏
  /** 表格是否撑满内容区自适应高度，默认 `false` */
  adaptive?: boolean;
  /** 撑满内容区自适应高度相关配置 */
  adaptiveConfig?: AdaptiveConfig;
  //请求
  beforeRequest?: (...arg: any[]) => void | Promise<any>;
  request?: (...arg: any[]) => Promise<any>;
  afterRequest?: (...arg: any[]) => void | Promise<any>;
  disableAutoLoad?: boolean; //是否关闭页面载入自动请求数据
  pagination?: false | PaginationProps;
  hasSection?: boolean;//是否有勾选列
  hideToolbar?: boolean;
}

// export interface PaginationProps {
//   page?: number;
//   itemCount?: number; 
//   pageCount?: number; 
//   pageSize?: number; 
//   pageSizes?: Array<number | PaginationSizeOption>; 
//   showSizePicker?: boolean; 
//   showQuickJumper?: boolean; 
//   size?:	'small' | 'medium' | 'large';
//   prefix?: (info: PaginationInfo) => VNodeChild; 
//   suffix?: (info: PaginationInfo) => VNodeChild;
// }

// export type PaginationProps = Omit<ExtractPublicPropTypes<typeof naivePaginationProps>, 'theme'|'themeOverrides'|'builtinThemeOverrides'>


export declare interface TableContext<T = Recordable> {
  loadData: (opt?: Recordable) => Promise<void>;
  setLoading: (loading: boolean) => void;
  emit?: any;
  tableRef?: any;
  bindProps?: ComputedRef<TableProps<T>>;
  tableData?: Ref<Recordable[]>;
}

//table bar
export const tableBarProps = {
  /** 头部最左边的标题 */
  title: {
    type: String,
    default: i18n.global.t('layout.table.list')
  },
  size: {
    //  type: String as PropType<"small" | "medium" | "large">,
    type: String as PropType<Density>,
    default: "medium"
  },
  /** 需要展示的列 */
  columns: {
    type: Array as PropType<Array<TableColumn>>,
    default: () => []
  },
  //导出 传递这个参数才会显示到处按钮
  onExport: {
    type: Function as PropType<() => void | Promise<void>>,
    default: undefined,
  },
  //勾选列是否显示默认false
  selection: {
    type: Boolean,
    default: false,
  }
}


/**
 * 
 * table action
 */
export const actionItem = {
  ...buttonProps,
  onClick: Function as PropType<Fn>,
  label: String,
  icon: String,
  popConfirm: Object as PropType<PopconfirmProps>,
  divider: { type: Boolean as PropType<boolean>, default: true },
  permission: String,
  //是否显示
  show: { type: [Boolean, Function] as PropType<boolean | ((action: ActionItem) => boolean)>, default: true },
  // 权限编码控制是否显示
  tooltip: [String, Object] as PropType<string | TooltipProps>,
  quaternary: { type: Boolean as PropType<boolean>, default: true },
  circle: { type: Boolean as PropType<boolean>, default: true },
  size: { type: String as PropType<Size>, default: 'small' }
}

export interface ActionItem extends /*@vue-ignore*/ButtonProps {
  onClick?: Fn;
  label?: string;
  icon?: string;
  popConfirm?: PopconfirmProps;
  // dropdownOpts?: DropdownOption;
  divider?: boolean;
  // 权限编码控制是否显示
  permission?: string;
  //是否显示
  show?: boolean | ((action: ActionItem) => boolean);
  tooltip?: string | TooltipProps;
  slots?: Array<string>;  //插槽名称
}

export interface PopconfirmProps extends NaivePopconfirmProps {
  // icon?:string|IconProps;
  message?: string | VNode
}

// export type DropdownOption = NaiveDropdownOption & {
//   permission?: string;
// }

type MenuMixedOption = NaiveMenuMixedOption & {
  // [key in keyof NaiveMenuMixedOption]:(NaiveMenuMixedOption[key]
  permission?: string;
}

export type DropdownProps = Omit<NaiveDropdownProps, 'theme' | 'themeOverrides' | 'builtinThemeOverrides' | 'options'> & {
  options: Array<MenuMixedOption>
}

export interface TableActionProps {
  row?: Recordable;  //item数据
  actions?: Array<ActionItem>;
  //更多按钮 暂时不考虑存在多个dropdown的情况
  dropdownAction?: DropdownProps;
  divider?: boolean;
  stopButtonPropagation?: boolean;
}


export type TableBarProps = ExtractPublicPropTypes<typeof tableBarProps>
