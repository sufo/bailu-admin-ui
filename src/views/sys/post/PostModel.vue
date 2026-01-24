<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
    :trap-focus="false"
    :mask-closable="false"
    preset="card"
    :class="prefixCls"
    :title="title">
    <base-form v-bind="bindProps">
    </base-form>
  </full-modal>

</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FormItemProps,BaseFormProps } from '@/components/form/types';
import { enableOrDisableOpt} from '@/constants/options' 
import { postApi } from '@/api/admin'
import {isBoolean} from 'lodash-es'
import {useDesign} from '@/hooks'

const { t } = useI18n()
const props = defineProps<ModalProps<Post>>()


const emit = defineEmits(["update:show", 'success'])
// const show = ref(props.show) //这样没有响应式
// const show = computed(()=>props.show) //这种写法有效
// const {show} = toRefs(props)  //无法修改

const show = computed({
  get: ()=> props.show,
  set: (val)=> {
    emit('update:show', val)  //会直接调用 :on-update:show 也就是props['onUpdate:show']   :on:xxx=>@xxx
  }
});

const {prefixCls} = useDesign('post-modal')

const title = props.isEdit?t('page.post.edit'):t('page.post.add')
const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>{
  const data = props.data;
  return [
    {field: 'name', component: 'NInput',label: t('page.post.name'), defaultValue:data?.['name']},
    {field: 'postCode', component: 'NInput',label: t('page.post.code'), defaultValue:data?.['postCode']},
    {field: 'sort', component: 'NInputNumber',label: t('common.showSort'), defaultValue:data?.['sort']||1},
    {field: 'status', component: 'NRadioButton',label: t('common.status'), defaultValue:data?.['status']||1, comProps:{options:enableOrDisableOpt(t)}},
    {field: 'remark', component: 'NInput',label: t('common.remark'), defaultValue:data?.['remark'], comProps:{type:"textarea"}},
  ] as Array<FormItemProps>
});

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:120, labelAlign:'right',
  formItems: unref(formItems),
  grid: {cols:1, xGap:0},
  rules:{
    name:[{required: true,message: ''}],
    postCode:[{required: true,message: ''}],
    sort:[{required: true,message:''}],
  },
  submitButtonOptions:{label:t('button.okText'), icon:''},
  resetButtonOptions:{label:t('button.cancelText'), icon:''},
  submitOnReset: false,
  action:{
    offset: 0
  },
  onSubmit: async (formModel:Recordable|boolean,done)=>{
    if(isBoolean(formModel)) return
    try{
      if(props.isEdit){
        formModel.id = props.data?.id
        await postApi.edit(formModel as Recordable)
      }else{
        await postApi.create(formModel as Recordable)
      }
      show.value=false
      //刷新下下拉框数据
      emit('success')
    }finally{done();}
  },
  onReset: ()=>{
    show.value = false
  }
} as BaseFormProps))


const modalStyle={
  width: '49%',
  minWidth: '520px',
  height:'auto',
  // maxHeight: '80vh',
  overflow: 'hidden'
}


</script>