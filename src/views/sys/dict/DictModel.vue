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
import { dictApi } from '@/api/admin'
import {isBoolean} from 'lodash-es'
import {useDesign} from '@/hooks'

const { t } = useI18n()
const props = defineProps<ModalProps<Dict>>()


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

const {prefixCls} = useDesign('dict-modal')

const title = props.isEdit?t('button.edit'):t('button.add')
const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>{
  const data = props.data;
  return [
    {field: 'name', component: 'NInput',label: t('page.dict.name'), defaultValue:data?.['name']},
    {field: 'code', component: 'NInput',label: t('page.dict.code'), defaultValue:data?.['code']},
    {field: 'description', component: 'NInput',label: t('common.desc'), defaultValue:data?.['description'], comProps:{type:"textarea"}},
  ] as Array<FormItemProps>
});

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:140, labelAlign:'right',
  showFeedback:false,
  formItems: unref(formItems),
  grid: {cols:1, xGap:0},
  rules:{
    name:[{required: true,message: ''}],
    code:[{required: true,message: ''}],
    description:[{required: true,message:''}],
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
      console.log("formModel",formModel);
      if(props.isEdit){
        formModel.id = props.data?.id
        await dictApi.edit(formModel as Recordable)
      }else{
        await dictApi.create(formModel as Recordable)
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