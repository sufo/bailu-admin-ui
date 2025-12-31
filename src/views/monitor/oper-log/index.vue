<template>
  <div :class="prefixCls" class="flex-col-stretch">
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10}"/>
    <bailu-table tbKey="operTable" 
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive
      :title="$t('common.list')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" size="small"
          v-permission="{value:'monitor:oper:export'}"
          @click="toExport()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.toExport')}}</n-button>
      </template>
    </bailu-table>
    <n-drawer v-model:show="showDrawer" :width="isMobile?'100%':600" placement="right">
      <n-drawer-content :title="$t('page.oper.title')" closable>
        <oper-detail v-bind="row" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import {useOper} from './use-oper'
import { BailuTable } from '@/components/table';
import OperDetail from './Detail.vue'
import { useContext } from '@/store/useContext';
defineOptions({name: 'Operation'})
const {prefixCls} = useDesign("oper")
const {isMobile} = storeToRefs(useContext())
const tableRef = ref()
const { formItems, columns, request, handler, row, showDrawer } = useOper(tableRef)

const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  tableRef.value.setPagination({page:1})
  await tableRef.value.loadData({...formModel})
  done()
}

function toExport(){
  handler("EXPORT")
}

</script>