<template>
  <full-modal v-model:show="show"
    :trap-focus="false"
    :show-icon="false"
    :mask-closable="false"
    preset="dialog"
    :class="prefixCls"
    :style="{width:'75%',height:'90vh'}"
    :negative-text="$t('button.cancelText')"
    :positive-text="$t('button.confirm')"
    @positive-click="onConfirm"
    @negative-click="onCancel"
    :title="$t('page.user.select')">
    <base-form @submit="onSearch" 
        :formItems="formItems"
        :show-feedback="false" 
        :label-width="90"
        labelPlacement="left"
        :grid="{yGap:10}"
        class="justify-self-end">
    </base-form>
    <bailu-table tbKey="userSelectTable" 
      generic="User"
      :request="request"
      ref="tableRef"
      hideToolbar
      v-model:checked-row-keys="checkedRowKeys"
      :row-key="row=>row.username"
      adaptive has-section
      :columns="columns">
    </bailu-table>
  </full-modal>

  
</template>
<script lang="ts" setup>
import { FormItemProps } from "@/components/form/types";
import {TableColumn} from '@/components/table/types';
import { findNode } from '@/utils/tree';
import{sexOptions} from '@/constants/options'
import {NTag} from 'naive-ui'
import { userApi } from "@/api/admin";
import { BailuTable } from '@/components/table';
import { useDesign } from "@/hooks";

defineOptions({name: 'SelectUser'})

const {t} = useI18n()
const tableRef = ref()
const props = defineProps<ModalProps<Array<string|number>>>()
const {prefixCls} = useDesign('select-user-dialog')

const checkedRowKeys = ref<Array<string | number>>(props?.data||[])
const formItems: Array<FormItemProps> = [
  {field: 'username', component: 'NInput', label: t('page.user.name')},
  {field: 'phone', component: 'NInput', label: t('login.mobile')}
]; 

const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  await tableRef.value.loadData({...formModel})
  done()
}

const columns: Array<TableColumn<User>> = [
    {key: 'index', hide:false, align:'center', width:60, title: '#',
      render: (_, index) => {return index + 1}
    },
    {key: 'username', hide:false, align:'center', width:80, title:t('page.user.name')},
    {key: 'nickName', hide:false, align:'center', width:90, title:t('page.user.nickName')},
    {key: 'sex', hide:false, align:'center', width:50, title:t('page.user.sex'),
      render(row){
        let sexItem = sexOptions(t).find(s=>s.value==row.sex)
        let sex = sexItem?sexItem.label:''
        return sex
      }
    },
    {key: 'phone', hide:false, align:'center', width:120, title:t('login.mobile')},
    {key: 'email', hide:false, align:'center', width:120, title:t('login.email')},
    {key: 'dept', hide:false, align:'center', width:100, title:t('page.user.belongDept'),
      render(row:User){
        let deptName = row.deptId
        const findItem = findNode(props.options,e=>e.key===row.deptId, {id:'key'})
        if(findItem) deptName=findItem.label
        return deptName?h(
          NTag, 
          {type:'info'},
          {
            default:()=>deptName
          }
        ):undefined
      }
    },
];

const emit = defineEmits(["update:show", 'select'])
const show = computed({
  get: ()=> props.show,
  set: (val)=> {
    emit('update:show', val)  //会直接调用 :on-update:show 也就是props['onUpdate:show']   :on:xxx=>@xxx
  }
});


async function request<T>(params: Recordable):Promise<void|PagesResult<User[]>>{
    try{
      return await userApi.index(params)
    }catch(e){
      return Promise.reject(e)
    } 
  };

function onConfirm(){
  emit('select', toRaw(unref(checkedRowKeys)))
  show.value = false
}
function onCancel(){
  checkedRowKeys.value = props.data||[]
  show.value = false
}

watch(
  ()=> props.data,
  (val)=>{
    checkedRowKeys.value = val||[]
  }
)
</script>
<style lang="scss">
$con: '#{$namespace}-select-user-dialog';
.#{$con}{
  display:flex;
  flex-direction: column;
  .n-dialog__content{flex:1;display:flex;height:0;flex-direction:column;
  }
}
</style>  