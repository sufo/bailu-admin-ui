<template>
  <div :class="prefixCls" class="flex-col-stretch">
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10,cols:'3 m:4 l:5 xl:6'}"/>
    <bailu-table tbKey="loginLogTable"
      :request="request"
      ref="tableRef"
      v-model:checked-row-keys="checkedRowKeys"
      :row-key="row=>row.id"
      adaptive hasIndexCol hasSection
      :export="handler('EXPORT')"
      :title="$t('common.list')" :columns="columns">
      <template #toolbar>
        <n-button size="small" ghost 
          :disabled="checkedRowKeys.length==0"
          v-permission="{value:'monitor:loginlog:remove'}"
          @click="openDialog('DELETE')">
          <template #icon><icon icon="ant-design:delete-outlined"/></template>
          {{$t('button.del')}}</n-button>
        <n-button ghost type="error" size="small"
          v-permission="{value:'monitor:loginlog:remove'}"
          @click="openDialog('CLEAR')">
          <template #icon><icon icon="ant-design:delete-outlined"/></template>
          {{$t('button.clear')}}</n-button>
      </template>
    </bailu-table>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import {useLoginLog} from './use-log'
import { BailuTable } from '@/components/table';

defineOptions({name: 'LoginLog'})
const {prefixCls} = useDesign("login-log")
const tableRef = ref()
const { formItems, columns, request, handler,checkedRowKeys} = useLoginLog(tableRef)
const {t} = useI18n()

const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  tableRef.value.setPagination({page:1})
  await tableRef.value.loadData({...formModel})
  done()
}

function openDialog(type:ActionType){
  window.$dialog?.warning({
    title:t('common.warn'),
    content: type==='CLEAR'?t('page.loginLog.cleanWarn'):t('tips.removeWarn'),
    positiveText:t('button.confirm'),
    negativeText:t('button.cancelText'),
    onPositiveClick: ()=>{
        handler(type)
    }
  })
}


</script>