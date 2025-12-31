<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
    :trap-focus="false"
    :mask-closable="false"
    preset="card"
    :class="prefixCls"
    :title="title">
    <base-form v-bind="bindProps">
      <template #depts>
        <div class="acts"><n-checkbox :on-update:checked="onExpand">展开/折叠</n-checkbox><n-checkbox :on-update:checked="checkAll">全选/全不选</n-checkbox></div>
        <n-tree
          block-line
          :data="depts"
          :default-expand-all="expandAll"
          :default-checked-keys="defaultCheckedKeys"
          v-model:checked-keys="checkedKeys"
          expand-on-click
          checkable cascade/>
      </template>
    </base-form>
  </full-modal>

</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FormItemProps,BaseFormProps } from '@/components/form/types';
import { dataScopeOpts} from '@/constants/options' 
import { roleApi,deptApi } from '@/api/admin'
import {isBoolean} from 'lodash-es'
import {useDesign} from '@/hooks'
import { isArrayEqual} from '@/utils/util'


const { t } = useI18n()
const props = defineProps<ModalProps<Role>>()

const expandAll = ref(false)

const defaultCheckedKeys = ref()
const depts = ref([])
  // ref((unref(props).options as Recordable)?.["checkedIds"])

const emit = defineEmits(["update:show", 'success'])
// const show = ref(props.show) //这样没有响应式
// const show = computed(()=>props.show) //这种写法有效
// const {show} = toRefs(props)  //无法修改

const show = computed({
  get: ()=> props.show,
  set: (val)=> {
    // if(props['onUpdate:show']){
    //   props['onUpdate:show'](val)
    // }
    // else 
    //清空菜单勾选数据
    if(!val){
      defaultCheckedKeys.value = (unref(props).options as Recordable)?.["checkedIds"]||[]
    }
    emit('update:show', val)  //会直接调用 :on-update:show 也就是props['onUpdate:show']   :on:xxx=>@xxx
  }
});

const {prefixCls} = useDesign('role-datascope-modal')

const title = t('page.role.assignDataScope')
const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>{
  const data = props.data;
  return [
    {field: 'name', component: 'NInput',label: t('page.role.name'), defaultValue:data?.['name'], comProps:{disabled: true}},
    {field: 'roleKey', component: 'NInput',label: t('page.role.roleKey'), defaultValue:data?.['roleKey'], comProps:{disabled: true}},
    {field: 'dataScope', component: 'NSelect',label: t('page.role.permScope'), defaultValue:data?.['dataScope']||'1', comProps:{options:dataScopeOpts(t),to:"body"}},
    {field: 'deptIds',label: t('page.role.dataScope'),hide:opt=>opt.dataScope!='2', slot:'depts'},
  ] as Array<FormItemProps>
});

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:100, labelAlign:'right',
  formItems: unref(formItems),
  showFeedback:false,
  grid: {cols:1, xGap:0},
  submitButtonOptions:{label:t('button.okText'), icon:''},
  resetButtonOptions:{label:t('button.cancelText'), icon:''},
  submitOnReset: false,
  action:{
    offset: 0
  },
  formData: props.data,
  onSubmit: async (formModel:Recordable|boolean,done)=>{
    if(isBoolean(formModel)) return
    try{
      // console.log("onSubmit-checkedKeys", checkedKeys.value);
      formModel.deptIds = checkedKeys.value;
      const isChanged = !isArrayEqual(toRaw(formModel.deptIds), toRaw(unref(defaultCheckedKeys)))
      //这里比较要先排除menus，选择的menus单独比较
      if(formModel.dataScope==props.data?.dataScope && !isChanged){
        window.$message?.warning("您没有做任何修改！")
        return
      }
      const {id, dataScope, deptIds} = formModel
      await roleApi.dataScope({id,deptIds,dataScope})
      show.value=false
      emit('success')
    }finally{done();}
  },
  onReset: ()=>{
    show.value = false
  }
} as BaseFormProps))

const checkedKeys = ref()

function onExpand(expand:boolean){
  expandAll.value = expand
}

//全选/反选
function checkAll(checked:boolean){
  if(checked){
    let res:Array<number> = []
    const findIds = (arr:Array<Recordable>, temp:Array<number>=[]):any =>{
      for(const item of arr){
        if(item.children&&item.children.length>0){
          temp.push(item.key)
          findIds(item.children, temp)
        }else{
          temp.push(item.key)
        }
      }
    }
    findIds(toRaw(unref(depts)), res)
    checkedKeys.value = res
  }else{
    checkedKeys.value = []
  }
}

const modalStyle={
  width: '49%',
  minWidth: '520px',
  height:'auto',
  // maxHeight: '80vh',
  overflow: 'hidden'
}

watch(
  show,
  async (val:boolean)=>{
    if(val){
      const result = await deptApi.treeSelect(props.data!!.id);
      defaultCheckedKeys.value = result.checkedIds;
      depts.value = result.list;
    }
  }
)


</script>
<style lang="scss">
$prefix: '#{$namespace}-role-datascope-modal';
.#{$prefix}{
  .bailu-base-form{
    .n-form-item-blank{
      flex-direction: column;
      align-items: flex-start;
      .acts{height:34px;display:flex;align-items:center;gap:20px;}
      .n-tree--checkable{
        margin-top:6px;
        border:1px solid rgb(224, 224, 230);
        width:100%;
      }
    }
  }
}


</style>