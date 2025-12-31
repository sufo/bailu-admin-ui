<template>
  <div :class="prefixCls">
    <search-form labelPlacement="left"
        :label-width="160"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10,cols:3}"
        :action="actionProps"
        class="justify-self-end"/>
    <bailu-table tbKey="dictItemsTable" 
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive
      :title="$t('page.dict.list')" :columns="columns">
      <template #toolbar v-permission="{value:'sys:dict:add'}">
        <n-button ghost type="primary" size="small"
          @click="openModal()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
      </template>
    </bailu-table>
    <modal v-bind="modalProps" @success="onSuccess"/>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import {useDictItem} from './use-dict-item'
import { BailuTable } from '@/components/table';
import modal from './Modal.vue'
import { ActionsProps } from '@/components/form/types';

defineOptions({name: 'DictItem'})

const props = defineProps<{
  code:string
}>()
const {prefixCls} = useDesign("dict")
const tableRef = ref()
const { formItems, columns, request, handler, modalProps} = useDictItem(tableRef, toRef(props,'code'))
// console.log("formItemsxxx",formItems)
const actionProps:ActionsProps = {
  space:{justify:'start',wrap:false, 
    size: [6,12]
  }
}


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
<style lang="scss">
$prefix: '#{namespace}-dict';
.#{$prefix}{
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>