<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
    :trap-focus="false"
    :mask-closable="false"
    preset="card"
    :class="prefixCls"
    :title="title">
    <base-form v-bind="bindProps">
      <template #menus>
        <div class="acts"><n-checkbox :on-update:checked="onExpand">展开/折叠</n-checkbox><n-checkbox :on-update:checked="checkAll">全选/全不选</n-checkbox></div>
        <n-tree
          block-line
          :data="menus"
          v-model:checked-keys="checkedKeys"
          :default-expand-all="expandAll"
          :default-checked-keys="defaultCheckedKeys"
          expand-on-click
          checkable cascade/>
      </template>
    </base-form>
  </full-modal>

</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FormItemProps,BaseFormProps } from '@/components/form/types';
import { enableOrDisableOpt} from '@/constants/options' 
import { roleApi } from '@/api/admin'
import {isBoolean} from 'lodash-es'
import {useDesign} from '@/hooks'
import {isFormDataEqual, isArrayEqual} from '@/utils/util'
import { useLocale } from '@/locales/useLocale';

const { t } = useI18n()
const props = defineProps<ModalProps<Role>>()
const locale = useLocale()
const expandAll = ref(false)

const defaultCheckedKeys = ref()
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

const {prefixCls} = useDesign('role-modal')

const title = props.isEdit?t('page.role.edit'):t('page.role.add')
const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>{
  const data = props.data;
  return [
    {field: 'name', component: 'NInput',label: t('page.role.name'), defaultValue:data?.['name']},
    {field: 'roleKey', component: 'NInput',label: t('page.role.roleKey'), defaultValue:data?.['roleKey']},
    {field: 'sort', component: 'NInputNumber',label: t('common.showSort'), defaultValue:data?.['sort']||1},
    {field: 'status', component: 'NRadioButton',label: t('common.status'), defaultValue:data?.['status']||1, comProps:{options:enableOrDisableOpt(t)}},
    {field: 'menus',label: t('page.role.menuPermission'), slot:'menus'},
    {field: 'remark', component: 'NInput',label: t('common.descInfo'), defaultValue:data?.['remark'], comProps:{type:"textarea"}},
  ] as Array<FormItemProps>
});

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:locale.getLocale.value=='zh-CN'?90:130,
  labelAlign:'right',
  formItems: unref(formItems),
  grid: {cols:1, xGap:0},
  rules:{
    name:[{required: true,message: ''}],
    sort:[{required: true,message:''}],
  },
  submitButtonOptions:{label:t('button.okText'), icon:''},
  resetButtonOptions:{label:t('button.cancelText'), icon:''},
  submitOnReset: false,
  // action:{
  //   offset: 0
  // },
  onSubmit: async (formModel:Recordable|boolean,done)=>{
    if(isBoolean(formModel)) return
    try{
      formModel.menus = checkedKeys.value;
      if(props.isEdit){
        formModel.id = props.data?.id
        const checkIds = (props.options as Recordable)?.["checkedIds"]
        const isMenusChanged = !isArrayEqual(toRaw(formModel.menus), toRaw(checkIds))
        //这里比较要先排除menus，选择的menus单独比较
        if(isFormDataEqual(formModel, toRaw(props.data||{}),"menus") && !isMenusChanged){
          window.$message?.warning("您没有做任何修改！")
          return
        }
        formModel["isMenusChanged"] = isMenusChanged
        await roleApi.edit(formModel as Recordable)
      }else{
        await roleApi.create(formModel as Recordable)
      }
      show.value=false
      emit('success')
    }finally{done();}
  },
  onReset: ()=>{
    show.value = false
  }
} as BaseFormProps))

const menus = computed(()=>{
  const options = unref(props).options as Recordable
  // console.log("menus",options?.["menus"])
  return (options?.["menus"]||[])
} )
const checkedKeys = computed({
  get:()=>{
    return defaultCheckedKeys.value
  },
  set:(val)=>{
    // console.log(val)
    defaultCheckedKeys.value=val
  }
})

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
    findIds(toRaw(unref(menus)), res)
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

//监听props异步options
watch(
  ()=>props.options,
  (val:Recordable)=>{defaultCheckedKeys.value = val["checkedIds"]}
)

</script>
<style lang="scss">
$prefix: '#{$namespace}-role-modal';
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