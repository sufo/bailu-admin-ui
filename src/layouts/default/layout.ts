import usePreferenceStore from "@/store/modules/preference";
import { useContext } from "@/store/useContext";
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ThemeEnum } from '@/constants/enum'
import { useAppStore } from "@/store/modules";
import { CSS_PREFIX } from '@/constants/consts'
import { ComputedRef } from 'vue'

type ThemeLayoutMode = LayoutMode
/** 最大的zIndex值 */
const MAX_Z_INDEX = 100;
type Prefix = typeof CSS_PREFIX
type LayoutHeaderProps = Record<ThemeLayoutMode, App.HeaderProps>;
type CssVarsProps = 'headerHeight' | 'tabHeight' | 'siderWidth' | 'siderCollapsedWidth' | 'footerHeight' | 'headerZIndex' | 'tabsZIndex' | 'siderZIndex' | 'footerZIndex';
type CssVars = { [K in CssVarsProps as K extends string ? `--${Prefix}-${KebabCase<K>}` : K]?: string | number; };
export function useBasicLayout(cls = CSS_PREFIX) {

  const ctx = useContext()
  const preference = usePreferenceStore()
  const app = useAppStore()
  const breakpoints = useBreakpoints(breakpointsTailwind);

  const mode = computed(() => {
    const vertical = 'vertical'
    const horizontal = 'horizontal';
    return preference.layout.mode.includes(vertical) ? vertical : horizontal;
  })

  const isMobile = breakpoints.smaller('sm');
  //将isMobile存储到store，通过watch保持其响应式
  watch(
    isMobile,
    (newV) => ctx.setMobile(newV)
  )

  const layoutHeaderProps: LayoutHeaderProps = {
    vertical: {
      showLogo: false,
      showHeaderMenu: false,
      showMenuCollapse: true
    },
    'vertical-mix': {
      showLogo: false,
      showHeaderMenu: false,
      showMenuCollapse: false
    },
    horizontal: {
      showLogo: true,
      showHeaderMenu: true,
      showMenuCollapse: false
    },
    'horizontal-mix': {
      showLogo: true,
      showHeaderMenu: false,
      showMenuCollapse: true
    }
  };

  const headerProps = computed(() => layoutHeaderProps[preference.layout.mode]);

  const siderVisible = computed(() => !isMobile.value && preference.layout.mode !== 'horizontal' && preference.menu.visible);

  const showMobileSider = computed(() => isMobile.value && preference.menu.visible);

  const siderWidth = computed(() => {
    const { width, mixWidth, mixChildMenuWidth } = preference.getMenuSetting;
    const isVerticalMix = preference.layout.mode === 'vertical-mix';
    let w = isVerticalMix ? mixWidth : width;
    if (isVerticalMix && app.mixSiderFixed) {
      w += mixChildMenuWidth;
    }
    return w;
  });
  const siderCollapsedWidth = computed(() => {
    const { collapsedWidth, mixCollapsedWidth, mixChildMenuWidth } = preference.getMenuSetting;
    const isVerticalMix = preference.layout.mode === 'vertical-mix';
    let w = isVerticalMix ? mixCollapsedWidth : collapsedWidth;
    if (isVerticalMix && app.mixSiderFixed) {
      w += mixChildMenuWidth;
    }
    return w;
  });

  //布局class
  const useLayoutCls = (prefixCls = 'bailu', isFixed = false, inverted = false) => {
    return [
      prefixCls,
      `${prefixCls}--${inverted ? ThemeEnum.DARK : ThemeEnum.LIGHT} `,
      {
        [`${prefixCls}--fixed`]: isFixed,
        [`${prefixCls}--mobile`]: unref(isMobile),
      },
    ];
  }

  //header/footer left space class
  //这里实现布局变化采用sider绝对定位来实现
  //菜单在左侧，header和footer需要空出菜单宽度的间距
  const leftSpaceCls = computed(() => {
    if (siderVisible.value && !app.fullContent)
      return app.siderCollapse ? `${cls}-left-space_collapsed` : `${cls}-left-space`
    else return ''
  })

  const cssVars: ComputedRef<CssVars> = computed(() => {
    const headerZIndex = MAX_Z_INDEX - 2;
    const tabsZIndex = MAX_Z_INDEX - 4;
    const siderZIndex = mode.value === 'vertical' ? MAX_Z_INDEX - 1 : MAX_Z_INDEX - 3;
    const footerZIndex = MAX_Z_INDEX - 4;
    return {
      '--bailu-sider-width': `${siderWidth.value}px`,
      '--bailu-sider-collapsed-width': `${siderCollapsedWidth.value}px`,
      '--header-z-index': headerZIndex,
      '--tabs-z-index': tabsZIndex,
      '--sider-z-index': siderZIndex,
      '--foot-z-index': footerZIndex,
      //边框
      '--bailu-border-color': preference.isDark ? 'rgba(255, 255, 255, 0.09)' : '#EFEFF5'
    }
  })

  //header左侧填充
  const headerLeftSpaceCls = computed(() => {
    return mode.value === 'vertical' ? leftSpaceCls.value : ''
  })

  //footer左侧填充
  const footerLeftSpaceCls = computed(() => {
    if (app.fullContent) return ''
    if (mode.value === 'vertical') {
      return leftSpaceCls.value
    } else {
      const footer = preference.footerSetting
      if (!footer.fixed || footer.right)
        return leftSpaceCls.value
      else return ''
    }
  });

  //sider padding class
  const siderPaddingCls = computed(() => {
    let cls = '';

    if (preference.getHeaderSetting.visible && !headerLeftSpaceCls.value) {
      cls += `${cls}-sider-p-t`;
    }
    if (preference.footerSetting.visible && !footerLeftSpaceCls.value) {
      cls += ` ${cls}-sider-p-b`;
    }
    return cls;
  })

  return {
    mode,
    isMobile,
    useLayoutCls,
    // useDarkWrapCls,
    // darkWrapCls,
    leftSpaceCls,
    headerLeftSpaceCls,
    footerLeftSpaceCls,
    siderPaddingCls,
    cssVars,
    headerProps,
    siderVisible,
    showMobileSider,
    siderWidth,
    siderCollapsedWidth
  };
}