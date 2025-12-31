<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-18 16:11:51
 * @Desc: 
-->
<template>
  <div :class="prefixCls">
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :labelWidth="90" :show-feedback="false"
        :action="{space:{wrap:false}}"
        @filledModel="onFormModel"
        :grid="{responsive: 'screen', cols:'3 m:5:xl:6',yGap:10}"/>
        
    <bailu-table tbKey="roleTable" 
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive
      :title="$t('page.role.roleList')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" size="small"
          v-permission="{value:'sys:role:add'}"
          @click="openModal()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
      </template>
    </bailu-table>
    <RoleModal v-bind="modalProps" @success="onSuccess"/>

    <DataScopeModal v-bind="scopeModalProps" @success="onSuccess"/>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import {useRole} from './use-role'
import { BailuTable } from '@/components/table';
import RoleModal from './RoleModal.vue'
import DataScopeModal from './DataScopeModal.vue';

defineOptions({name: 'Role'})

const {prefixCls} = useDesign("role")
const tableRef = ref()
const formModel = ref()
const { formItems, columns, request, handler, modalProps, scopeModalProps} = useRole(tableRef, formModel)

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

function onFormModel(_formModel: Ref<Recordable>){
  formModel.value = unref(_formModel)
}

</script>
<style lang="scss">
$prefix: '#{$namespace}-role';
.#{$prefix}{
  display: flex;
  flex-direction: column;
  height: 100%;
  .n-date-picker--range{width:100%;}
}
</style>