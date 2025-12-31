<template>
  <aside v-bind="$attrs" :class="layoutCls" v-show="!app.fullContent" v-if="siderVisible">
    <VerticalMixSider v-if="isVerticalMix"/>
    <VerticalSider v-else/>
  </aside>
  <sider-drawer v-bind="omit($attrs,'class')" v-if="showMobileSider"/>
</template>
<script lang="ts" setup>
import VerticalMixSider from './components/MixSider.vue'
import VerticalSider from './components/LayoutSider.vue'
import {useDesign } from '@/hooks'
import {useAppStore, usePreferenceStore} from '@/store/modules'
import SiderDrawer from './components/SiderDrawer.vue'
import {useBasicLayout} from '../layout'
import { omit } from 'lodash-es';
defineOptions({name:'LayoutSider', inheritAttrs:false})

const { siderVisible, isMobile } = useBasicLayout()


const {prefixCls} = useDesign('layout-sider')
const theme = usePreferenceStore()
const app = useAppStore()

const layoutCls = computed(()=>{
  return [
    prefixCls,'transition-all-300',
    {[`${prefixCls}_collapsed`]: app.siderCollapse},
  ]
})

const isVerticalMix = computed(() => theme.layout.mode === 'vertical-mix');

const showMobileSider = computed(()=> isMobile.value && theme.menu.visible)

</script>
<style lang="scss">
// @prefix: ~'@{namespace}-layout-sider';
// .@{prefix} {
$prefix: '#{$namespace}-layout-sider';
.#{$prefix} {
  position: absolute;
  left: 0;top:0;
  height: 100%;
  z-index: var(--sider-z-index);
  width: var(--bailu-sider-width);
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  &_collapsed {
    width: var(--bailu-sider-collapsed-width);
  }
}
.dark .#{$prefix} {
  box-shadow: 2px 0 8px 0 rgb(0 0 0 / 40%);
}

</style>