<template>
  <div :class="prefixCls">
    <base-form labelPlacement="left" :label-width="120"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10, cols:3}"
        :reset-button-options="{show:false}"
        :action="{space:{justify:'end'}}"
        class="justify-self-end"/>
    <bailu-table tbKey="dictTable" 
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive
      :title="$t('common.list')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" size="small"
          v-permission="{value:'sys:dict:add'}"
          @click="openModal()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
      </template>
    </bailu-table>
    <DictModal v-bind="modalProps" @success="onSuccess"/>
    <n-drawer v-model:show="showDrawer" :width="isMobile?'100%':700" placement="right">
      <n-drawer-content :title="$t('page.dict.list')" closable>
        <DictItems :code="code" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import {useDict} from './use-dict'
import { BailuTable } from '@/components/table';
import DictModal from './DictModel.vue'
import DictItems from './item/index.vue'
import { useContext } from '@/store/useContext';

defineOptions({name: 'Dict'})

const {prefixCls} = useDesign("dict")
const {isMobile} = storeToRefs(useContext())
const tableRef = ref()
const { formItems, columns, request, handler, modalProps, showDrawer, code} = useDict(tableRef)

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
$prefix: '#{$namespace}-dict';
.#{$prefix}{
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>