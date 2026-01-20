//=====================layout===========================
// menu type
// menuTypeSidebar: '左侧菜单模式',
// menuTypeMixSidebar: '左侧菜单混合模式',
// menuTypeMix: '顶部菜单混合模式',
// menuTypeTopMenu: '顶部菜单模式',
import { AnimateModeEnum } from '@/constants/enum';
import { ComposerTranslation } from 'vue-i18n';

export const layoutModeLabels = (t: ComposerTranslation): Record<LayoutMode, string> => ({
  // vertical: '左侧菜单模式',
  // horizontal: '顶部菜单模式',
  // 'vertical-mix': '左侧菜单混合模式',
  // 'horizontal-mix': '顶部菜单混合模式'
  vertical: t('preference.menuVertical'),
  horizontal: t('preference.menuHorizontal'),
  'vertical-mix': t('preference.menuVerticalMix'),
  'horizontal-mix': t('preference.menuHorizontalMix')
});

export const layoutModeOptions = (t: ComposerTranslation): OptionWithKey<LayoutMode>[] => [
  {
    value: 'vertical',
    label: layoutModeLabels(t).vertical
  },
  {
    value: 'horizontal',
    label: layoutModeLabels(t).horizontal
  },
  {
    value: 'vertical-mix',
    label: layoutModeLabels(t)['vertical-mix']
  },
  {
    value: 'horizontal-mix',
    label: layoutModeLabels(t)['horizontal-mix']
  }
];


export const animateModeOptions: OptionWithKey<ThemeAnimateMode>[] = [
  {
    value: 'zoom-fade',
    label: AnimateModeEnum['zoom-fade']
  },
  {
    value: 'zoom-out',
    label: AnimateModeEnum['zoom-out']
  },
  {
    value: 'fade-slide',
    label: AnimateModeEnum['fade-slide']
  },
  {
    value: 'fade',
    label: AnimateModeEnum.fade
  },
  {
    value: 'fade-bottom',
    label: AnimateModeEnum['fade-bottom']
  },
  {
    value: 'fade-scale',
    label: AnimateModeEnum['fade-scale']
  }
];

export const scrollModeOptions = (t: ComposerTranslation): OptionWithKey<ScrollMode>[] => [
  {
    value: 'wrapper',
    label: t('preference.outerSCroll')//'外层滚动',
  },
  {
    value: 'content',
    label: t('preference.contentScroll')//'内容滚动'
  }
];

export const topMenuAlignOptions = (t: ComposerTranslation): OptionWithKey<Align>[] => [
  {
    value: 'center',
    label: t('preference.topMenuAlignRight'),
  },
  {
    value: 'start',
    label: t('preference.topMenuAlignLeft'),
  },
  {
    value: 'end',
    label: t('preference.topMenuAlignCenter'),
  },
];

export const tabModeOptions = (t: ComposerTranslation): OptionWithKey<TabMode>[] => [
  {
    value: 'chrome',
    label: t('preference.chromeStyle')
  },
  {
    value: 'button',
    label: t('preference.buttonStyle')
  }
];

export const chargeStatus = (t: ComposerTranslation): String[] => [
  t('common.charging'), t('common.chargeFull'), t('common.disconnectPower')
]


export const densityOptions = (t: ComposerTranslation): OptionWithKey<string>[] => [
  { value: 'large', label: t('layout.table.loose') },
  { value: 'medium', label: t('layout.table.default') },
  { value: 'small', label: t('layout.table.compact') },
]

export const menuType = (t: ComposerTranslation): OptionWithKey<MenuType>[] => [
  { value: "M", label: t('page.menu.dir') },
  { value: "C", label: t('page.menu.menu') },
  { value: "F", label: t('page.menu.button') },
]

export const whetherOptions = (t: ComposerTranslation): { value: boolean, label: string }[] => [
  { value: true, label: t('status.yes') },
  { value: false, label: t('status.no') },
]

export const ifOptions = (t: ComposerTranslation): { value: number, label: string }[] => [
  { value: 1, label: t('status.yes') },
  { value: 2, label: t('status.no') },
]

export const enableOrDisableOpt = (t: ComposerTranslation): { value: number, label: string }[] => [
  { value: 1, label: t('common.enable') },
  { value: 2, label: t('common.disable') },
]

export const visibleOpts = (t: ComposerTranslation): { value: boolean, label: string }[] => [
  { value: true, label: t('status.show') },
  { value: false, label: t('status.hide') },
]

export const sexOptions = (t: ComposerTranslation): OptionWithKey<number>[] => [
  { value: 1, label: t('common.male') },
  { value: 2, label: t('common.female') },
  { value: 0, label: t('common.secret') },
]


export const httpMethods: OptionWithKey<string>[] = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", "label": "DELETE" },
]

// 数据范围选项
export const dataScopeOpts = (t: ComposerTranslation): { value: string, label: string }[] => [
  {
    value: "1",
    label: t("data-scope.all")
  },
  {
    value: "2",
    label: t('data-scope.custome')
  },
  {
    value: "3",
    label: t('data-scope.depart')
  },
  {
    value: "4",
    label: t('data-scope.depart-and-sub')
  },
  {
    value: "5",
    label: t('data-scope.me')
  }
]

//task 调用类型
export const invokeTypeOpts = (t: ComposerTranslation): OptionWithKey<string>[] => [
  { value: 'FUNC', label: t('common.func') },
  { value: 'HTTP', label: "HTTP" },
  { value: 'SHELL', label: "Shell" },
]

export const getSendStatusOpts = (t: ComposerTranslation): OptionWithKey<string>[] => [
  { value: "0", label: t('page.notice.published') },
  { value: "1", label: t('page.notice.unpublished') },
  { value: "2", label: t('page.notice.revoked') },
]

export const getNoticeOpts = (t: ComposerTranslation): OptionWithKey<number>[] => [
  { label: t('page.notice.notice'), value: 1 },
  { label: t('page.notice.announcement'), value: 2 }
]