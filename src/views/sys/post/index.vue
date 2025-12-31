<template>
  <div :class="prefixCls" class="flex-col h-full">
    <search-form labelPlacement="left"
        @submit="onSearch" :formItems="formItems"
        :show-feedback="false" :grid="{yGap:10}"/>
    <bailu-table tbKey="deptTable" 
      :request="request"
      ref="tableRef"
      :row-key="row=>row.id"
      adaptive
      :title="$t('page.dept.deptList')" :columns="columns">
      <template #toolbar>
        <n-button ghost type="primary" size="small"
          v-permission="{value:'sys:post:add'}"
          @click="openModal()">
          <template #icon><icon icon="ion:add"/></template>
          {{$t('button.add')}}</n-button>
      </template>
    </bailu-table>
    <PostModal v-bind="modalProps" @success="onSuccess"/>
  </div>
</template>
<script setup lang="ts">
import {useDesign} from '@/hooks'
import {usePost} from './use-post'
import { BailuTable } from '@/components/table';
import PostModal from './PostModel.vue'

defineOptions({name: 'Post'})
const {prefixCls} = useDesign("post")
const tableRef = ref()
const { formItems, columns, request, handler, modalProps } = usePost(tableRef)

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
{/* <style lang="scss">
$prefix: '#{$namespace}-post';
.#{$prefix}{
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style> */}