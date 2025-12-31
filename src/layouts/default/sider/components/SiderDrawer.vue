<template>
 <n-drawer :class="prefixCls" :show="!app.siderCollapse" :width="theme.menu.width" 
    display-directive="show" 
    placement="left"
    @mask-click="app.setSiderCollapse(true)">
    <n-drawer-content>
      <layout-sider />
    </n-drawer-content>
  </n-drawer>
</template>
<script setup lang="ts">
import LayoutSider from './LayoutSider.vue';
import { useDesign } from '@/hooks';
import { useAppStore, usePreferenceStore } from '@/store/modules';
import { useContext } from '@/store/useContext';
defineOptions({name: "SiderDrawer"})
const {prefixCls} = useDesign('sider-drawer')
const context = useContext()
const app = useAppStore()
const theme = usePreferenceStore()
const isMobile = computed(()=>context.isMobile)
//移动端 默认菜单不展开
// if(isMobile){
//   app.siderCollapse=true
// }
//移动端 默认菜单不展开
watch(
  ()=>isMobile.value,
  (n:boolean,o:boolean)=>{app.setSiderCollapse(n!==o&&n||true)},
  {immediate:true}
)
</script>

<style lang="scss">
$prefix: '#{$namespace}-sider-drawer';
.#{$prefix}{
  .n-drawer-content .n-drawer-body-content-wrapper {
    padding: 0
  }
}
</style>