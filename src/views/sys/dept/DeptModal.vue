<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
    :trap-focus="false"
    :mask-closable="false"
    preset="card"
    :title="title">
    <base-form v-bind="bindProps" />
  </full-modal>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FormItemProps,BaseFormProps } from '@/components/form/types';
import { enableOrDisableOpt} from '@/constants/options' 
import {deptApi} from '@/api/admin'
import {isBoolean} from 'lodash-es'
import { useLocale } from '@/locales/useLocale';

const { t } = useI18n()
const {getLocale} = useLocale()
const props = defineProps<ModalProps<Dept>>()

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
    emit('update:show', val)  //会直接调用 :on-update:show 也就是props['onUpdate:show']   :on:xxx=>@xxx
  }
});

const title = props.isEdit?t('page.dept.edit'):t('page.dept.add')
const depts:Ref<Dept[]> = ref([])
const formItems:ComputedRef<FormItemProps[]> = computed(()=>{
  const data = props.data;
  return [
    {field: 'pid', component: 'NTreeSelect',label: t('page.dept.parentLevel'), defaultValue:data?.['pid'], comProps:{options:unref(depts), labelField:'name', keyField:'id', clearable:true}},
    {field: 'name', component: 'NInput',label: t('page.dept.name'), defaultValue:data?.['name']},
    {field: 'sort', component: 'NInputNumber',label: t('common.showSort'), defaultValue:data?.['sort']},
    {field: 'leader', component: 'NInput',label: t('page.dept.leader'), defaultValue:data?.['leader']},
    {field: 'phone', component: 'NInput',label: t('page.dept.telephone'), defaultValue:data?.['phone']},
    {field: 'email', component: 'NInput',label: t('login.email'), defaultValue:data?.['email']},
    {field: 'status', component: 'NRadioButton',label: t('common.status'), defaultValue:data?.['status']||1, comProps:{options:enableOrDisableOpt(t)}},
  ]
});

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth: getLocale.value === 'zh-CN' ? 120 : 160, 
  labelAlign:'right',
  formItems: unref(formItems),
  grid: {cols:"1 m:2", xGap:30},
  rules:{
    name:[{required: true,message: t('page.dept.nameNotEmpty')}],
    sort:[{required: true,message:'显示排序不能为空！'}],
  },
  submitButtonOptions:{label:t('button.okText'), icon:''},
  resetButtonOptions:{label:t('button.cancelText'), icon:''},
  submitOnReset: false,
  // action:{
  //   offset: 1
  // },
  onSubmit: async (formModel:Recordable|boolean,done)=>{
    if(isBoolean(formModel)) return
    try{
      // console.log("formModel",formModel);
      if(props.isEdit){
        formModel.id = props.data?.id
        await deptApi.edit(formModel as Recordable)
      }else{
        await deptApi.create(formModel as Recordable)
      }
      show.value=false
      //刷新下下拉框数据
      fetchDepts()
      emit('success')
    }finally{done();}
  },
  onReset: ()=>{
    show.value = false
  }
} as BaseFormProps))

async function fetchDepts(){
  const res = await deptApi.index({})
  depts.value = res
}

const modalStyle={
  width: '60%',
  minWidth: '680px',
  height:'auto',
  maxHeight: '80vh',
  overflow: 'hidden'
}

//获取下拉框
onMounted(()=>{fetchDepts()})

</script>