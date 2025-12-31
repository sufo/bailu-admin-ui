/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-18 11:33:51
 * @Desc: 
 */
type StyleClsProps = {
  style?: CSSStyleDeclaration,
  class?: string | (string | Record<string, boolean> | undefined)[];
}

type ActionType = 'VIEW' | 'EXPORT' | 'IMPORT' | 'CRAETE' | 'READ' | 'UPDATE' | 'DELETE' | 'Multi-DELETE' | 'CLEAR' | 'EXPAND' | 'COLLAPSE' | 'ENABLE' | 'STATUS' | 'DATA_SCOPE' | 'ASSIGN' | 'RESET_PWD' | 'KICKOUT' | 'LOG' | 'EXEC' | 'RELEASE' | 'REVOCATION'

type LoginModuleKey = keyof typeof import('@/constants/enum').LoginModule

type RoleType = keyof typeof import('@/constants/enum').RoleEnum;

//M目录 C菜单 F按钮
type MenuType = 'M' | 'C' | 'F'

declare interface ActiveEmit {
  (e: 'update:active', module: string | LoginModuleKey): void
}

declare interface TooltipProps {
  /** tooltip显示文本 */
  tooltipContent?: string;
  /** tooltip的位置 */
  placement?: import('naive-ui').PopoverPlacement;
  // placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end';

  /** class类 */
  contentClass?: string;
  /** 反转模式下 */
  inverted?: boolean;

  trigger?: 'hover' | 'click' | 'focus' | 'manual'
}
// interface IconType {
//   // // icon name
//   // icon: String,
//   // // icon color
//   // color?: String,
//   // // icon size
//   // size?: [String, Number],
//   // spin?: Boolean,
//   // prefix?: String

//   // icon name
//   icon: string, //注意这里要小写
//   // icon color
//   color: string,
//   // icon size
//   size: string | number,  //对应props里面的[String, Number]
//   spin: boolean,
//   prefix: string
// }
declare interface ModalProps<T, E = Recordable> {
  //modal show
  show?: boolean;
  'onUpdate:show'?: (show: boolean) => void,
  isEdit?: boolean; //是否修改
  data?: T  //如果是修改， 要修改的表单数据
  // options?: E | Array<E>  //额外需要的数据参数
  options?: E //额外需要的数据参数
}

//基础布局相关属性
declare namespace App {
  // /** 全局头部属性 */
  // interface HeaderProps {
  //   /** 显示logo */ 
  //   showLogo: boolean;
  //   /** 显示头部菜单 */
  //   showHeaderMenu: boolean;
  //   /** 显示菜单折叠按钮 */
  //   showMenuCollapse: boolean;
  // }

  /** 菜单项配置 */
  type Menu = import('naive-ui').MenuOption & {
    name: string, //菜单名称
    routeName: string,  //route name
    path: string,  //route path
    key: string;  //naive ui MenuOption    值为 route name
    label: string;  //naive ui MenuOption     值为 route title
    query?: string; //json string
    icon?: () => import('vue').VNodeChild;
    children?: Menu[];
    i18nKey?: string;
  };

  /** 全局头部属性 */
  interface HeaderProps {
    /** 显示logo */
    showLogo: boolean;
    /** 显示头部菜单 */
    showHeaderMenu: boolean;
    /** 显示菜单折叠按钮 */
    showMenuCollapse: boolean;
  }

  /** 面包屑 */
  type Breadcrumb = Omit<import('naive-ui').DropdownOption, 'icon'> & {
    key: string;
    label: string;
    disabled: boolean;
    hasChildren: boolean;
    icon?: import('vue').Component;
    i18nKey?: string;
    options?: import('naive-ui/es/dropdown/src/interface').DropdownMixedOption[];
  };

  // /** 多页签Tab的路由 */
  // interface TabRoute
  //   extends Pick<import('vue-router').RouteLocationNormalizedLoaded, 'name' | 'path' | 'fullPath' | 'meta'> {
  //   /** 滚动的位置 */
  //   scrollPosition: {
  //     left: number;
  //     top: number;
  //   };
  // }
  /** 多页签Tab的路由 */
  interface TabRoute
    extends Omit<import('vue-router').RouteLocationNormalizedLoaded, 'redirectedFrom' | 'hash' | 'matched'> {
    /** 滚动的位置 */
    scrollPosition: {
      left: number;
      top: number;
    };
  }

  interface MessageTab {
    /** tab的key */
    key: number;
    /** tab名称 */
    name: string;
    /** badge类型 */
    badgeProps?: import('naive-ui').BadgeProps;
    /** 消息数据 */
    // list: MessageList[];
    list: Message[];
  }

  // interface MessageList {
  //   /** 数据唯一值 */
  //   id: number;
  //   /** 头像 */
  //   avatar?: string;
  //   /** 消息icon */
  //   icon?: string;
  //   /** 消息标题 */
  //   title: string;
  //   /** 消息发送时间 */
  //   date?: string;
  //   /** 消息是否已读 */
  //   isRead?: boolean;
  //   /** 消息描述 */
  //   description?: string;
  //   /** 标签名称 */
  //   tagTitle?: string;
  //   /** 标签props */
  //   tagProps?: import('naive-ui').TagProps;
  // }
}

declare type MessageType = 'notice' | 'event' | 'chat'