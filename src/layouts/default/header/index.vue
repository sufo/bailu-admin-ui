<template>
  <header v-bind="$attrs" v-if="theme.header.visible" :class="headerClass" v-show="!hide">
    <app-logo v-if="theme.app.showLogo && showLogo && !isMobile" 
      :show-title="true" class="h-full flex-x-center"  :img-class="'w-32px h-32px'"/>
    <div v-if="!showHeaderMenu" class="flex-1-hidden flex-y-center h-full">
      <!-- <menu-collapse v-if="theme.showMenuCollapse || isMobile" /> -->
      <menu-collapse v-if="(showMenuCollapse && theme.menu.visible) || isMobile" />
      <breadcrumb v-if="theme.crumb.visible && !isMobile" />
    </div>
    <header-menu :class="`${prefixCls}-menu`" v-else-if="!isMobile" />
    <div class="flex justify-end h-full">
      <app-search v-if="theme.header.showSearch"/>
      <full-screen v-if="theme.header.showFullScreen"/>
      <theme-mode v-if="theme.app.showThemeToggle"/>
      <lang-toggle v-if="locale.isVisible"/>
      <message v-if="theme.header.showNotice"/>
      <setting-button v-if="showButton" />
      <use-avatar />
    </div>
  </header>
  <div :class="`${prefixCls}-placement`" v-if="theme.header.visible"  v-show="!hide && isFixed"></div>
</template>
<script setup lang="ts">
import { usePreferenceStore,useLocaleStore,useAppStore} from '@/store/modules';
import {useBasicLayout} from '@/layouts/default/layout'
import { useDarkStyle, useDesign } from '@/hooks';
import {MenuCollapse, Breadcrumb, HeaderMenu, Message, LangToggle, UseAvatar, ThemeMode, FullScreen,SettingButton} from './components'
import AppSearch from '../search/index.vue'

interface Props {
  // fixed: boolean;
  showLogo : App.HeaderProps['showLogo'];
  showHeaderMenu: App.HeaderProps['showHeaderMenu'];
  showMenuCollapse : App.HeaderProps['showMenuCollapse'];
}

defineOptions({name: 'LayoutHeader', inheritAttrs:false})

defineProps<Props>();

const locale = useLocaleStore()
const theme = usePreferenceStore()
const app = useAppStore()
const { isMobile,useLayoutCls} = useBasicLayout();
const {useDarkWrapCls} = useDarkStyle()
const {prefixCls} = useDesign('layout-header')

const showButton =  ref(theme.app.showSettingButton)
const isFixed = computed(()=>theme.header.fixed)
const inverted = computed(()=>theme.getHeaderSetting.inverted)
const headerClass = computed(() => {
  return [...useLayoutCls(prefixCls ,isFixed.value,inverted.value), 
      useDarkWrapCls(inverted.value),'flex-y-center']
});

const hide = computed(()=>(app.fullContent))
// //仅在 horizontal-mix（顶部菜单混合模式）并且可见和非内容全屏 下才会显示
// const showFullHeaderRef = computed(() => {
//     return (
//       theme.header.visible
//       && theme.layout.mode==='horizontal-mix'
//     );
//   });


</script>
<style lang="scss">
// @prefixCls: ~'@{namespace}-layout-header';
// @logo: ~'@{namespace}-app-logo';
$prefixCls: '#{$namespace}-layout-header';
$logo: '#{$namespace}-app-logo';
// .@{prefixCls}{
.#{$prefixCls}{
  // box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
  box-shadow: 0 1px 2px #00152914;
  height: $header-height;
  z-index: var(--header-z-index); 
  &--fixed{
    position: fixed;
    top:0;left: 0;
    width: 100%;
  }
  .#{$logo} {
    width: var(--bailu-sider-width);
  }
  &-placement {
    height: $header-height;
  }
}
.dark .#{$prefixCls}{
  // box-shadow: 0 1px 2px #E8152914;
  box-shadow: 0 1px 2px rgba(255,255,255, 0.09)
}
</style>