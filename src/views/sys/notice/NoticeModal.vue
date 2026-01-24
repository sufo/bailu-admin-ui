<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
    :trap-focus="false"
    :mask-closable="false"
    :size="preference.theme.size"
    preset="card"
    :segmented="{content:true}"
    :class="prefixCls"
    :title="title">
    <base-form v-bind="bindProps"
     @filled-model="onFillModel">
      <template #content>
        <quill-editor v-model="formModel.content"/>
      </template>
      <template #receiver="scope">
        <template v-if="scope.model.sendScope=='depart'">
          <n-tree-select :options="depts" multiple v-model:value="formModel.receiverArr"/>
        </template>
        <template v-else-if="scope.model.sendScope=='role'">
          <n-select :options="roles" multiple v-model:value="formModel.receiverArr"/>
        </template>
        <template v-else-if="scope.model.sendScope=='user'">
          <n-select @focus="showUserModel=true" multiple v-model:value="formModel.receiverArr" :show="false" tag/>
        </template>
      </template>
    </base-form>
  </full-modal>

  <select-user :options="depts" v-model:show="showUserModel" :data="data?.['receiverArr']" @select="onUserSelect"/>
  
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FormItemProps,BaseFormProps } from '@/components/form/types';
import { noticeApi,options,roleApi,deptApi} from '@/api/admin'
import {isBoolean} from 'lodash-es'
import {useDesign} from '@/hooks'
import SelectUser from './select-user.vue'
import { ShallowRef } from 'vue';
import {usePreferenceStore} from '@/store/modules'
import {getNoticeOpts} from '@/constants/options'

const { t } = useI18n()
const props = defineProps<ModalProps<Notice>>()


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

const {prefixCls} = useDesign('notice-modal')
const preference = usePreferenceStore()

const sendScopeOpts:Ref<OptionWithKey<string>[]>=ref([]);//[{ "value": "all", "label": "所有人", "isDefault": true }, { "value": "user", "label": "指定用户", "isDefault": false }, { "value": "role", "label": "角色", "isDefault": false }, { "value": "depart", "label": "部门", "isDefault": false }]
const roles:ShallowRef<OptionWithKey<string>[]>=ref([]);
const depts=ref([]);
const formModel:Ref<Recordable> = ref({})

const showUserModel=ref(false)

const title = props.isEdit?t('button.edit'):t('button.add')
const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>{
  const data = props.data;
  return [
    {field: 'type', component: 'NRadio',label: t('common.category'), defaultValue:data?.['type']||1,comProps:{options:getNoticeOpts(t)}},
    {field: 'title', component: 'NInput',label: t('common.title'), defaultValue:data?.['title']},
    {
      field: 'sendScope', component: 'NRadioGroup',label: t('page.notice.scope'), 
      defaultValue:data?.['sendScope']||(sendScopeOpts.value.find(s=>s!.isDefault)?.value), 
      comProps:{disabled:formModel.value&&formModel.value.type==2 ,options:unref(sendScopeOpts)}
    },
    {
      field:'receiverArr', slot:"receiver", 
      label: (model)=>sendScopeOpts.value.find(s=>s.value===model.sendScope)?.label,
      hide:(model)=>model.sendScope=='all',
      defaultValue:data?.['receivers']?.split(",")||[]
    },
    {field: 'content', slot:'content', component: '',label: t('common.content'), defaultValue:data?.['content']},
  ] as Array<FormItemProps>
});

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:120, labelAlign:'right',
  showFeedback:false,
  formItems: unref(formItems),
  grid: {cols:1, xGap:0},
  rules:{
    type:{required: true,message: ''},
    title:{required: true,message: ''},
    sendScope:{required: true,message:''},
    content:{required: true,message:''},
    receiverArr:{type: 'array',required: true,message:'',trigger: ['blur', 'change']}
  },
  submitButtonOptions:{label:t('button.okText'), icon:''},
  resetButtonOptions:{label:t('button.cancelText'), icon:''},
  submitOnReset: false,
  action:{
    offset: 0
  },
  onSubmit: async (formModel:Notice|boolean,done)=>{
    if(isBoolean(formModel)) return
    try{
      // console.log("formModel",formModel);
      formModel.receivers = formModel.receiverArr?.join(",")
      if(props.isEdit){
        formModel.id = props.data!.id
        await noticeApi.edit(formModel as Recordable)
      }else{
        await noticeApi.create(formModel)
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


function onFillModel(model:Ref<Recordable>){
  formModel.value = model.value
  // console.log("formModel.value",formModel.value)
}

async function fetchSendScopeOpts(code:string){
  const res = await options<string>(code)
  if(res){
    sendScopeOpts.value = res
  }
}
async function fetchRoles(){
  const res = await roleApi.options()
  if(res){
    roles.value = res
  }
}
async function fetchDepts(){
  const res = await deptApi.tree()
  if(res){
    depts.value = res
  }
}

fetchSendScopeOpts("message_scope_type")

watch(
  ()=>formModel.value?.sendScope,
  async (val)=>{
    formModel.value.receiverArr=[]
    if(val==='role'){
      if(roles.value.length<=0){
        await fetchRoles()
      }
      return unref(roles)
    }else if(val==='depart'||val==='user'){
      if(depts.value.length<=0){
        await fetchDepts()
      }
    }
  }
)

function onUserSelect(selected: Array<string|number>){
  // console.log("selected", selected)
  formModel.value.receiverArr = selected
}


const modalStyle={
  width: '65%',
  minWidth: '520px',
  height:'auto',
  // maxHeight: '80vh',
  overflow: 'hidden'
}

//当选择公告时，则通知范围必须为全体
watch(
  ()=>formModel.value?.type,
  (val)=>{
    if(val==2)formModel.value.sendScope='all'
  }
)


</script>