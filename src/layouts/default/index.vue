<template>
  <div :style="cssVars" :class="[prefixCls,'relative flex flex-col h-full',{'overflow-y-auto':isWrapperScroll}]"
      :id="isWrapperScroll ? SCROLL_ID : undefined" v-bind="lockEvents">
    <layout-header v-bind="headerProps" 
                   :class="headerLeftSpaceCls"/>
    <layout-tabs :class="[leftSpaceCls]"/>
    <layout-sider :class="siderPaddingCls" />
    <!-- 主体 -->
    <layout-content :id="isContentScroll ? SCROLL_ID : undefined"
      :class="[leftSpaceCls,{'overflow-y-auto': isContentScroll}]" />
    <!---footer-->
    <layout-footer :class="footerLeftSpaceCls"/>
  </div>
  
  <!--widgets-->
  <n-back-top  class="z-100" :listen-to="`#${SCROLL_ID}`"/>
  <setting-drawer v-if="preference.app.showSettingButton"/>
  <transition name="fade-bottom" mode="out-in">
      <lock-screen v-if="lockInfo.isLock"/>
  </transition>
  <!-- <transition name="fade-bottom" mode="out-in" 
    >
      <check-update :visible="true"
      :check-updates-interval="preference.app.checkUpdateInterval"/>
  </transition> -->
</template>
<script lang="ts" setup>
import { useDesign } from '@/hooks';
import {useBasicLayout} from '@/layouts/default/layout'
import LayoutHeader from './header/index.vue'
import LayoutSider from './sider/index.vue'
import LayoutTabs from './tabs/index.vue'
import LayoutContent from './content/index.vue'
import LayoutFooter from './footer/index.vue'
import SettingDrawer from './preference/index.vue'
// import { checkUpdate } from './widget'
import { usePreferenceStore,useLockStore } from '@/store/modules';
import {SCROLL_ID} from '@/constants/consts'
import { useLockPage } from '@/components/lockscreen/useLockPage';

defineOptions({ name: 'BasicLayout' });

const {prefixCls} = useDesign('layout')
const {cssVars,
  headerLeftSpaceCls,
  headerProps,
  leftSpaceCls, 
  siderPaddingCls,
  footerLeftSpaceCls
} = useBasicLayout()

const preference = usePreferenceStore();
const lockStore = useLockStore();
const {lockInfo} = storeToRefs(lockStore)

const lockEvents = useLockPage()
// 滚动模式
const isWrapperScroll = computed(() => preference.app.scrollMode === 'wrapper');
const isContentScroll = computed(() => preference.app.scrollMode === 'content');


//SSE
// const userStore = useUserStore()
// useEventSource(`${import.meta.env.VITE_API_URL}/stream?token=${userStore.getToken}`,{
//     onopen:(e)=>{console.log("open")},
//     onmessage:(data)=>{
//       console.log(data)
//     }
// })


</script>
<style lang="scss">
// @prefix: ~'@{namespace}-layout';
// .@{prefix} {
$prefix: '#{$namespace}-layout';
.#{$prefix} {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
}
.#{$namespace}{
  &-left-space_collapsed{
    padding-left: var(--bailu-sider-collapsed-width);
  }
  &-left-space{
    padding-left: var(--bailu-sider-width);
  }
  &-sider-p-t{
    padding-top: $header-height;
  }
  &-sider-p-b{
    padding-bottom: $footer-height;
  }
 
}
</style>