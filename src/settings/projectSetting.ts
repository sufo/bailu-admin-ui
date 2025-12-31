
// import { TabModeEnum } from "@/constants/enum"
// import {
//   layoutModeOptions, animateModeOptions,
//   topMenuAlignOptions, scrollModeOptions,
//   tabModeOptions,
// } from "@/constants/options"
const setting: Settings = {

  app:{
    storageModel: 'LOCAL',
    //菜单权限模式 STATIC 前端固定路由  DYNAMIC 动态获取
    // permissionMode: 'DYNAMIC',
    showSettingButton: true,
    grayMode: false,
    colorWeak: false,
    showLogo: true,
    dynamicTitle: true,
    scrollMode: 'content',
    showMenuCollapse: true,
    showThemeToggle:true,
    // scrollModeList: scrollModeOptions,
    useOpenBackTop: true,
    closeMessageOnSwitch: true,
    removeAllHttpPending: false,
    showWatermark: false,
    enableCheckUpdate: true,
    checkUpdateInterval: 10
  },

  theme:{
    themeColor: "#1890ff",
    mode: "dark",
    size: 'medium',
    themeColors: [
      "#1890ff",
      "#409EFF",
      "#2d8cf0",
      "#007AFF",
      "#5ac8fa",
      "#5856D6",
      "#536dfe",
      "#9c27b0",
      "#AF52DE",
      "#0096c7",
      "#00C1D4",
      "#34C759",
      "#43a047",
      "#7cb342",
      "#c0ca33",
      "#78DEC7",
      "#e53935",
      "#d81b60",
      "#f4511e",
      "#fb8c00",
      "#ffb300",
      "#fdd835",
      "#6d4c41",
      "#546e7a"
    ],
  
    otherColor: {
      "info": "#0099ad",
      "success": "#52c41a",
      "warning": "#faad14",
      "error": "#f5222d"
    },

  },

  layout: {
    minWidth: 900,
    mode: 'vertical',
    // modeList: layoutModeOptions
  },
  
  header: {
    // height: 48,
    fixed: true,
    visible: true,
    showFullScreen: true,
    useLockPage: true,
    showNotice: true,
    showSearch: true,
    /** 侧边菜单栏反转色 */
    inverted: false,
  },

  menu: {
    inverted: false,
    // collapsed: false,
    width: 220,
    visible: true,
    canDrag: true,
    // fixed: true,  //只能是fixed
    collapsedWidth: 64,
    mixWidth: 80,
    mixCollapsedWidth: 48,
    mixChildMenuWidth: 200,
    // mixSideFixed: false,  //见useAppStore
    topMenuAlign: 'center',
    // topMenuAlignList: topMenuAlignOptions
  },
  tab: {
    // height: 44,
    mode: 'chrome',
    // modeList: tabModeOptions,
    keepAlive: true,
    persist: false,
    canDrag: false,
    visible: true,
    showQuick: false,
    showRedo: true,
    showFull: true,
  },
  footer: {
    visible: true,
    fixed: false,
    inverted: false,
    right: false,
    // height: 48
  },
  transition: {
    enable: true,
    /** 动画类型 */
    animateMode: 'fade-slide',

    // animateModeList: animateModeOptions,

    enablePageLoading: true,

    enableNProgress: true,
  },

  lockTime: 0,  //0 不锁屏

  crumb: {
    visible: true,
    showIcon: true,
  },
  useErrorHandle: false,
  //  Is it possible to embed iframe pages
  canEmbedIFramePage: true,
}

export default setting