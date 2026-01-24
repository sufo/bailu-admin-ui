<template>
  <div :class="prefixCls">
    <dark-mode-container class="user-dept-wrap" v-if="!isMobile" v-permission="{value:'sys:dept:list'}">
      <n-input v-model:value="deptName" :placeholder="$t('page.dept.namePlaceholder')">
        <template #suffix><icon icon="ant-design:search-outlined"/></template>
      </n-input>
      <n-tree
          block-line
          :data="depts"
          default-expand-all
          :pattern="deptName"
          expand-on-click
          :override-default-node-click-behavior="override"/>
    </dark-mode-container>
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false"
        :action="{space:{wrap:false}}"
        label-width="80"
        @filledModel="onFormModel"
        :grid="{responsive: 'screen', cols:'3 m:4:xl:5',yGap:10}"/>
        
    <bailu-table tbKey="userTable"
      generic="User"
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      :exportable="exportable"
      adaptive
      :title="$t('page.user.list')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" size="small"
          v-permission="{value:'sys:user:add'}"
          @click="openModal()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
      </template>
    </bailu-table>
    <UserModal v-bind="modalProps" :options="depts" @success="onSuccess"/>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks/common/useDesign'
import {usePermission} from '@/hooks/business/usePermission'
import {useUser} from './use-user'
import { BailuTable } from '@/components/table';
import UserModal from './UserModal.vue';
import { deptApi } from '@/api/admin';
import { useContext } from '@/store/useContext';

defineOptions({name: 'User'})

const {prefixCls} = useDesign("user")
const {isMobile} = storeToRefs(useContext())

const tableRef = ref()
const formModel = ref()
const deptName = ref()
//获取部门数据
const depts = ref()
deptApi.tree().then(val=>{depts.value=val})

const { formItems, columns, request, handler, modalProps, override } = useUser(tableRef, formModel, depts)

const { hasPermission } = usePermission();
const exportable = hasPermission('sys:user:export')

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
  formModel.value = {...unref(_formModel)}
}

</script>

<style lang="scss">
$prefix: '#{$namespace}-user';
.#{$prefix}{
  display: grid;
  width: 100%;
  // grid-template-columns: 16.6% 83.4%;
  grid-template-columns: 16.6% calc(100% - 16.6%);
  grid-template-rows: auto 1fr;
  column-gap: 8px;
  //align-content: stretch; //整个内容行高自适应
  align-items: stretch;
  grid-auto-flow: column; //先列后行
  .n-date-picker--range{width:100%;}
  .user-dept-wrap{
    grid-row-start: 1;
    grid-row-end: 3;
    padding:10px;
    border-radius:4px;
    .app-iconify{color: var(--n-icon-color);}
    .n-tree{margin-top:12px;}
  }
  .bailu-base-form{
    align-self: flex-start;
  }
}
.mobile{
  .#{$prefix}{
    grid-template-columns: 100%;
  }
}
</style>