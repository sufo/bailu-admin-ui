
<!--分配用户-->
<template>
  <div :class="prefixCls">
    <base-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :labelWidth="70" :show-feedback="false"
        :grid="{responsive: 'screen', cols:'2 m:5:xl:6',yGap:10}"
        class="justify-self-end"/>
    <bailu-table key="assignTable" 
      :request="request"
      ref="tableRef"
      :row-key="(row:Role)=>row.id"
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
  </div>
</template>
<script setup lang="ts">
import { useDesign } from '@/hooks';
import { FormItemProps } from '@/components/form/types';
import { TableColumn} from '@/components/table/types';

const {prefixCls} = useDesign("assign-users")
const { t } = useI18n() ;
const tableRef = ref()

const formItems: Array<FormItemProps> = [
    {field: 'name', component: 'NInput', label: t('page.user.name')},
    {field: 'phone', component: 'NInput', label: t('login.mobile'), comProps:{type:'number'}},
  ];

const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  await tableRef.value.loadData({...formModel})
  done()
}

const request = async function request<T>(params: Recordable):Promise<void|Role[]>{
    try{
      // return await roleList(rest)
    }catch(e){
      return Promise.reject(e)
    } 
  };

const columns:Array<TableColumn<Role>> = []

const openModal = ()=>{}
</script>