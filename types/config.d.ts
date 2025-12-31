
// type TabMode = keyof typeof import('@/constants/enum').TabModeEnum;
// type TabMode = typeof import('@/constants/consts').tabModeOptions[number]['value']
type TabMode = 'chrome' | 'button'
type LocaleType = 'zh-CN' | 'en' | 'ru' | 'ja' | 'ko';
/**
  * 布局模式
  * - vertical: 左侧菜单模式
  * - horizontal: 顶部菜单模式
  * - vertical-mix: 左侧菜单混合模式
  * - horizontal-mix: 顶部菜单混合模式
*/
type LayoutMode = 'vertical' | 'horizontal' | 'vertical-mix' | 'horizontal-mix';

/** 主题模式 */
type ThemeModeType = 'auto' | 'dark' | 'light';


/**
   * 过渡动画类型
   * - zoom-fade: 渐变
   * - zoom-out: 闪现
   * - fade-slide: 滑动
   * - fade: 消退
   * - fade-bottom: 底部消退
   * - fade-scale: 缩放消退
   */
type ThemeAnimateMode = 'zoom-fade' | 'zoom-out' | 'fade-slide' | 'fade' | 'fade-bottom' | 'fade-scale';
type ScrollMode = 'wrapper' | 'content';
type Align = 'start' | 'center' | 'end';
type Size = 'small' | 'medium' | 'large'
//表格密度
type Density = 'large' | 'medium' | 'small'

interface Settings {

  /**通用设置 */
  app: AppPreference,
  /** 主题配置 */
  theme: ThemePreference;
  //布局
  layout: Layout
  // menuType: MenuTypeEnum;
  header: Header;
  // menuSetting
  menu: Menu;
  // Multi-tab settings
  tab: Tab;
  // Animation configuration
  transition: Transition;

  /** 底部样式 */
  footer: Footer;

  // Lock screen time
  lockTime: number;

  //breadcrumbs
  crumb: Crumb;

  // Use error-handler-plugin
  useErrorHandle: boolean;
  
  //  Is it possible to embed iframe pages
  canEmbedIFramePage: boolean;
 
  //[x: string]: any; //动态添加属性  //导致DeepPartial<Settings>传值类型问题
}

/**主题配置 */
interface ThemePreference {
  // darkMode: boolean,
  // followSystemTheme: boolean,
  /** 当前主题 */
  mode: ThemeModeType;
  /** 主题颜色 */
  themeColor: string;
  /** 主题颜色列表 */
  themeColors: string[];
  /** 其他颜色 */
  otherColor: OtherColor;
  //尺寸大小
  size: Size,
}

interface AppPreference{
  // Whether to display the logo
  showLogo: boolean;
  /** 滚动模式 */
  scrollMode: ScrollMode;
  /** 开启动态标题 */
  dynamicTitle: boolean;
  // Website gray mode, open for possible mourning dates
  grayMode: boolean;
  // Whether to turn on the color weak mode
  colorWeak: boolean;
  // Whether to display the menu Collapse icon
  // useless
  showMenuCollapse: boolean
  // scrollModeList: OptionWithKey<ScrollMode>[]

  // Whether to show the theme toggle button
  showThemeToggle: boolean,
  // Whether to show the configuration button
  showSettingButton: boolean;

  //Whether to display the watermark
  showWatermark: boolean  

  // Whether to delete unclosed messages and notify when switching the interface
  closeMessageOnSwitch: boolean;

  removeAllHttpPending: boolean;

  // Whether to open back to top
  useOpenBackTop: boolean;

  // Storage location
  storageModel: 'LOCAL' | 'SESSION';

  //菜单权限模式 STATIC 前端固定路由  DYNAMIC 动态获取
  //权限模式
  // permissionMode: 'STATIC' | 'DYNAMIC';

  // 是否开启检查更新
  enableCheckUpdate: boolean;
  /** 检查更新轮询时间（分钟）*/
  checkUpdateInterval: number;
}


/** 布局样式 */
interface Layout {
  /** 最小宽度 */
  minWidth: number;
  /** 布局模式 */
  mode: LayoutMode;
  /** 布局模式列表 */
  // modeList: OptionWithKey<LayoutMode>[];
}

interface Header {
  // height: number;

  // Fixed at the top
  fixed: boolean;
  visible: boolean;
  // Turn on full screen
  showFullScreen: boolean;
  // Whether to show the lock screen
  useLockPage: boolean;
  // Show message center button
  showNotice: boolean;
  showSearch: boolean;
  /** 侧边菜单栏反转色 */
  inverted: boolean;
}

/** 面包屑样式 */
interface Crumb {
  /** 面包屑可见 */
  visible: boolean;
  /** 显示图标 */
  showIcon: boolean;
}

interface Menu {
  /** 侧边菜单栏反转色 */
  inverted: boolean;

  //  Whether to fix the left menu
  // fixed: true,   //must be fixed

  // collapsed: boolean;  //to see appStore
  /** 侧边菜单栏宽度 */
  width: number;

  visible: boolean;
  // Split menu
  // split: false,
  canDrag: boolean,

  //顶部菜单对齐
  topMenuAlign: Align;
  // topMenuAlignList: OptionWithKey<Align>[]
  /** 侧边栏折叠时的宽度 */
  collapsedWidth: number;
  /** vertical-mix模式下侧边栏宽度 */
  mixWidth: number;
  /** vertical-mix模式下侧边栏折叠时的宽度  不显示menu name*/
  mixCollapsedWidth: number;
  /** vertical-mix模式下侧边栏的子菜单的宽度 */
  mixChildMenuWidth: number;
  //vertical-mix模式下 侧边栏的固定状态
  //固定展开菜单
  // mixSideFixed: boolean;  //to see appStore

}

/** 标多页签样式 */
interface Tab {
  /** 多页签高度 */
  // height: number;
  /** 多页签风格 */
  mode: TabMode;
  // modeList: OptionWithKey<TabMode>[]
  /** 开启标签页缓存功能 */
  keepAlive: boolean;
  /** 是否持久化标签 */
  persist: boolean;

  canDrag: boolean;

  visible: boolean;

  //显示快捷操作
  showQuick: boolean;
  // Whether to show the refresh button
  showRedo: boolean,
  // Whether to show the full content button
  showFull: boolean,
}

/** 底部样式 */
interface Footer {
  /* 底部是否可见 */
  visible: boolean;
  /** 是否固定底部 */
  fixed: boolean;
  /** 底部高度 */
  // height: number;
  /** 底部反转色 */
  inverted: boolean;
  /** 底部是否居右(顶部混合菜单模式有效) */
  right: boolean;
}

interface Transition {
  enable: boolean;
  /** 动画类型 */
  animateMode: ThemeAnimateMode;

  /**animation list */
  // animateModeList: OptionWithKey<ThemeAnimateMode>[];

  // Whether to enable page switching loading
  // Only enable when enable=true
  enablePageLoading: boolean,

  // Whether to enable the top progress bar
  enableNProgress: boolean,
}

interface LocaleSetting {
  visible: boolean;
  // Current language
  locale: LocaleType;
  // default language
  fallback: LocaleType;
  // available Locales
  availableLocales: LocaleType[];
}

/** 其他主题颜色 */
interface OtherColor {
  /** 信息 */
  info: string;
  /** 成功 */
  success: string;
  /** 警告 */
  warning: string;
  /** 错误 */
  error: string;
}

// interface TableAPISetting{
//   pageField: string,
//   // 每页数量字段名
//   sizeField: string,
//   // 接口返回的数据字段名
//   listField: string,
//   // 接口返回总页数字段名
//   pagesField: string,
//   //总数字段名
//   countField: string,

//   defaultPageSize: number,
//   pageSizes: Array<number>,

// }

// interface APISetting {
//   code: string,
//   msg: string,
//   type?: string,
//   data: string,
//   table: TableAPISetting
// }