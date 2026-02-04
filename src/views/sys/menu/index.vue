<template>
  <div :class="prefixCls">
    <search-form labelPlacement="left"
      :label-width="120"
      @submit="onSearch" :formItems="formItems"
      :show-feedback="false" :grid="{yGap:10}"/>
    <bailu-table tbKey="menuTable" 
      :request="request"
      :afterRequest="afterRequest"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive
      :pagination="false"
      :title="$t('page.menu.menuList')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" size="small"
          v-permission="{value:'sys:menu:add'}"
          @click="openModal()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
      </template>
    </bailu-table>
    <MenuModal v-bind="menuModalProps" @success="onSuccess"/>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import {useDesign} from '@/hooks'
import { BailuTable } from '@/components/table';
import { useMenu } from './use-menu';
import MenuModal from './MenuModal.vue'
import { useAsyncRouteStore } from '@/store/modules';


defineOptions({name:"Menu"})
const { prefixCls } = useDesign('menu')
const tableRef = ref()
const { formItems, columns, request, afterRequest, handler, menuModalProps, fetchApis} = useMenu(tableRef)
const router = useRouter()

const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  await tableRef.value.loadData({...formModel})
  done()
}

function openModal(){
  handler("CRAETE")
}

const routeStore = useAsyncRouteStore()

//成功刷新当前页面
async function onSuccess(){
  //刷新路由和menus
  routeStore.setDynamicAddedRoute(false)
  await routeStore.initRoute(router)
  tableRef.value.loadData()
}


//初始化api数据
fetchApis()

</script>
<style lang="scss">
$prefix: '#{$namespace}-menu';
.#{$prefix}{
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>