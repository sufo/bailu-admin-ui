<template>
  <div :class="prefixCls" class="flex-col h-full">
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10}"/>
    <bailu-table tbKey="noticeTable" 
      generic="Notice"
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive has-section
      :title="$t('common.list')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" size="small"
          v-permission="{value:'sys:notice:add'}"
          @click="openModal()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
        <n-button size="small" ghost
          :disabled="checkedRowKeys.length==0"
          v-permission="{value:'sys:notice:remove'}"
          @click="openDialog('DELETE')">
          <template #icon><icon icon="ant-design:delete-outlined"/></template>
          {{$t('button.del')}}</n-button>
      </template>
    </bailu-table>
    <notice-modal v-bind="modalProps" @success="onSuccess"/>
  </div>
</template>
<script setup lang="ts">
import { useDesign } from '@/hooks'
import { useNotice } from './use-notice'
import { BailuTable } from '@/components/table';
import NoticeModal from './NoticeModal.vue';
import { useContext } from '@/store/useContext';

defineOptions({name: 'Notice'})
const {prefixCls} = useDesign("notice")
const {t} = useI18n()
const tableRef = ref()
const {isMobile} = storeToRefs(useContext())
const { formItems, columns, request, handler, modalProps, checkedRowKeys } = useNotice(tableRef,isMobile)

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

function openDialog(type:ActionType){
  window.$dialog?.warning({
    title:t('common.warn'),
    content: t('tips.removeWarn'),
    positiveText:t('button.confirm'),
    negativeText:t('button.cancelText'),
    onPositiveClick: ()=>{
        handler(type)
    }
  })
}
</script>