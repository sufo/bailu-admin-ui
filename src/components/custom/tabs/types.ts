import { PropType,ExtractDefaultPropTypes} from "vue";
export type TabMode = 'line' | 'bar' | 'button' | 'chrome';
// interface CommonProps {
//   style?: Record<string, string | number>;
//   /** 样式的类名 */
//   class?: string | (string | Record<string, boolean> | undefined)[];
// }

export const tabsProps = {
  //暗黑模式
  themeMode: {
    type: String,
    default: 'dark',
  },
  //tab模式
  mode: {
    type: String as import("vue").PropType<TabMode>,
    default: 'chrome'
  },
  // //tab样式类名
  // class: {
  //   type: import("vue").PropType<CommonProps['class']>,
  //   default: ''
  // },

  // style: {
  //   // type: import("vue").PropType<string | import("vue").CSSProperties>,
  //   type: Object as import("vue").PropType<CommonProps['style']>,
  //   default: ''
  // },

  modelValue: {
    type: String as import("vue").PropType<string>,
    default: '',
  },

  prefixCls: {
    type: String,
    default: ''
  },

  /** 激活时的颜色 */
  activeColor: {
    type: String,
    default: ''
  },

  //大小
  size: {
    type: String as import("vue").PropType<'default' | 'small' | 'large'>,
    default: 'default'
  },

  // /**
  //    * tab 的最小宽度
  //    */
  // minWidth: {
  //   type: Number,
  //   default: 40
  // },
  // /**
  //  * tab 的最大宽度
  //  */
  // maxWidth: {
  //   type: Number,
  //   default: 245
  // },
  /**
     * 两个相邻的 tab 的空隙大小
     */
  gap: {
    type: [String, Number] as import("vue").PropType<string | number>,
    default: 7
  },

  /** 是否显示关闭图标 */
  // closable: {
  //   type: Boolean,
  //   default: true,
  // },
  /**
   * 是否可拖拽
   */
  dragable: {
    type: Boolean,
    default: false,
  },
  /** 点击关闭图标 */
  // onClose: {
  //   type: Function as import("vue").PropType<(key: string | undefined, e: MouseEvent | KeyboardEvent) => void>,
  //   default: () => { }
  // },
  /**切换面板的回调	**/
  onChange: { type: Function as import("vue").PropType<(activeKey: string, e?: Event) => void> },
  /**点击回调 */
  onTabClick: {
    type: Function as import("vue").PropType<(activeKey: string, e?: Event) => void>,
  }

}

// export type TabsProps = import("vue").ExtractPublicPropTypes<typeof tabsProps>
export type TabsProps = ExtractDefaultPropTypes<typeof tabsProps>


/**tab  */
export const tabProps = {
  // prefixCls: { type: String as PropType<string> },
  mode: { type: String as PropType<TabMode>, default: 'chrome' },
  // tab: { type: Object as import("vue").PropType<Tab & { closeIcon?: () => any }> },
  active: { type: String as PropType<string> },
  //使用key作为键时，一直取不到值，不知道为啥
  name: { type: String as PropType<string>, require: true },
  activeColor: { type: String as PropType<string>, default: undefined },
  closable: { type: Boolean as PropType<boolean>, default: true },
  themeMode: { type: String as PropType<ThemeModeType>, default: 'dark' },
  // onClose: { type: Function as PropType<(key: string | undefined, e: MouseEvent | KeyboardEvent) => void> },
  onClick: { type: Function as PropType<(name: string | undefined, e?: Event) => void> },
  // renderWrapper: { type: Function as import("vue").PropType<(node: any) => any> },
  // class: { type: import("vue").PropType<CommonProps['class']>, },
  // style: { type: import("vue").PropType<CommonProps['style']>, },
}
//将tabProps的类型定义抽取出来供外部使用
// export type TabProps = ExtractPublicPropTypes<typeof tabProps>

export type TabProps = {
  mode?: TabMode,
  active?: string,
  name?: string,
  activeColor?: string,
  closable?: boolean,
  themeMode?:ThemeModeType,
  onClick?: (fullPath?: string, e?: Event) => void
}

//slots
type SlotFn = (props?: Record<string, unknown>) => any;
export type Slots = {
  /** 插槽：Tab中间内容 */
  default?: SlotFn;
  /** 插槽: Tab前缀 */
  prefix?: SlotFn;
  /** 插槽: Tab后缀 */
  suffix?: SlotFn;
};