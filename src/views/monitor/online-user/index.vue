<template>
  <div :class="prefixCls" class="flex-col-stretch">
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10,cols:'2 m:3'}"/>
    <bailu-table tbKey="onlineUserTable"
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive hasIndexCol
      :export="handler('EXPORT')"
      :title="$t('common.list')" :columns="columns">
    </bailu-table>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import { useOnlineUser } from './use-online'
import { BailuTable } from '@/components/table';

defineOptions({name: 'OnlineUser'})
const {prefixCls} = useDesign("online-user")
const tableRef = ref()
const { formItems, columns, request, handler} = useOnlineUser(tableRef)

const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  tableRef.value.setPagination({page:1})
  await tableRef.value.loadData({...formModel})
  done()
}

</script>