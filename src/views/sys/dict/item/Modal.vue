<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
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
import { dictApi } from '@/api/admin'
import {isBoolean} from 'lodash-es'
import {useDesign} from '@/hooks'
import {enableOrDisableOpt,whetherOptions} from '@/constants/options'

const { t } = useI18n()
const props = defineProps<ModalProps<DictItem>>()

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

const {prefixCls} = useDesign('dict-item-modal')

const title = props.isEdit?t('button.edit'):t('button.add')
const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>{
  const data = props.data;
  return [
    {field: 'label', component: 'NInput',label: t('common.name'), defaultValue:data?.['label']},
    {field: 'value', component: 'NInput',label: t('common.dataVal'), defaultValue:data?.['value']},
    {field: 'sort', component: 'NInputNumber', comProps:{min:1}, label: t('common.sort'), defaultValue:data?.['sort']||1},
    {field: 'isDefault', component: 'NRadioButton',label: t('common.default-val'), defaultValue:data?.['isDefault']||false, comProps:{options:whetherOptions(t)}},
    {field: 'fixed', component: 'NRadioButton',label: t('common.fixed'), defaultValue:data?.['fixed']||false, comProps:{options:whetherOptions(t)}},
    {field: 'status', component: 'NRadioButton',label: t('common.status'), defaultValue:data?.['status']||1, comProps:{options:enableOrDisableOpt(t)}},
    {field: 'remark', component: 'NInput',label: t('common.desc'), defaultValue:data?.['remark'], comProps:{type:"textarea"}},
  ] as Array<FormItemProps>
});

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:100, labelAlign:'right',
  showFeedback:false,
  formItems: unref(formItems),
  grid: {cols:1, xGap:0},
  rules:{
    label:[{required: true,message: ''}],
    value:[{required: true,message: ''}],
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
      formModel.code = props.data?.code
      if(props.isEdit){
        formModel.id = props.data?.id
        await dictApi.itemEdit(formModel as Recordable)
      }else{
        await dictApi.itemCreate(formModel as Recordable)
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