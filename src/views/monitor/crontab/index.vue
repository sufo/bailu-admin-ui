<template>
  <div :class="prefixCls" class="flex-col-stretch">
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10,cols:'1 s:3'}"/>
    <bailu-table tbKey="crontabTable"
      :request="request"
      ref="tableRef"
      v-model:checked-row-keys="checkedRowKeys"
      :row-key="row=>row.id"
      adaptive hasIndexCol hasSection 
      @export="handler('EXPORT')"
      :title="$t('common.list')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" :size="preference.theme.size"
          v-permission="{value:'monitor:task:add'}"
          @click="handler('CRAETE')">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
        <n-button :size="preference.theme.size" ghost type="error"
          :disabled="checkedRowKeys.length==0"
          v-permission="{value:'monitor:task:remove'}"
          @click="openDialog('DELETE')">
          <template #icon><icon icon="ant-design:delete-outlined"/></template>
          {{$t('button.del')}}</n-button>
      </template>
    </bailu-table>

    <crontab-modal v-bind="modalProps" @success="onSuccess"/>

    <crontab-detail v-bind="detailModalProps" />

    <n-drawer v-model:show="showDrawer" width="60%" placement="right" content-class="drawer-crontab">
      <n-drawer-content :title="$t('page.task.exec-log')" body-content-class="p-0!" closable>
        <crontab-log :taskId="taskId" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks';
import {useCron} from './use-cron';
import { BailuTable } from '@/components/table';
import { usePreferenceStore } from '@/store/modules';
import CrontabModal from './CrontabModal.vue'
import CrontabLog from './Log.vue';
import CrontabDetail from './Detail.vue';
import { useContext } from '@/store/useContext';

defineOptions({name: 'Crontab'})
const {prefixCls} = useDesign("crontab")
const preference = usePreferenceStore()
const tableRef = ref()
const {isMobile} = storeToRefs(useContext())
const { formItems, columns, checkedRowKeys, request, handler, modalProps, taskId, showDrawer,detailModalProps} = useCron(tableRef,isMobile)
const {t} = useI18n()
const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  tableRef.value.setPagination({page:1})
  await tableRef.value.loadData({...formModel})
  done()
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

//成功刷新当前页面
async function onSuccess(){
  //刷新路由和menus
  tableRef.value.loadData()
}

</script>
<style lang="scss">
.drawer-crontab{
  .n-drawer-body-content-wrapper{
    display: flex;
    flex-direction: column;
  }
}
</style>