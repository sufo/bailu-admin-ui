<template>
  <div :class="prefixCls" class="flex flex-col h-full">
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10, xGap:30}"
        :label-width="isMobile?'80':''"/>
    <bailu-table tbKey="deptTable" 
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive
      :pagination="false"
      :title="$t('page.dept.deptList')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" size="small"
          v-permission="{value:'sys:dept:add'}"
          @click="openModal()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
      </template>
    </bailu-table>
    <MenuModal v-bind="modalProps" @success="onSuccess"/>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import {useDept} from './use-dept'
import { BailuTable } from '@/components/table';
import MenuModal from './DeptModal.vue'
import { useContext } from '@/store/useContext';

defineOptions({name: 'Dept'})
const {isMobile} = storeToRefs(useContext())
const {prefixCls} = useDesign("dept")
const tableRef = ref()
const { formItems, columns, request, handler, modalProps } = useDept(tableRef)

const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  await tableRef.value.loadData({...formModel})
  done()
}

function openModal(){
  handler("CRAETE")
}


//成功刷新当前页面
async function onSuccess(){
  //刷新路由和menus
  tableRef.value.loadData()
}

</script>
