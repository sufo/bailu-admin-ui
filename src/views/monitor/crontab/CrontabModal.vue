<template>
  <full-modal v-model:show="show"
    :style="modalStyle" 
    :trap-focus="false"
    :mask-closable="false"
    preset="card"
    :title="title">
    <base-form v-bind="bindProps" @fill-model="getModel">
      <template #cronExpression="scopeSlot">
        <n-input-group>
          <!-- <n-input :style="{ width: '75%' }" v-model:value="scopeSlot.value"/> -->
          <!-- <n-input-group-label @click="openCronModel(scopeSlot.value)">{{$t('page.task.cron') }}<icon icon="" /></n-input-group-label> -->
          <n-input v-model:value="model[scopeSlot.field]"/>
          <n-dropdown :trigger="isMobile?'click':'hover'" :options="cronExOptions" placement="bottom-end" @select="onExSelect">
            <n-input-group-label class="flex-center"><icon icon="carbon:chevron-down"/></n-input-group-label>
          </n-dropdown>
        </n-input-group>
      </template>
    </base-form>
  </full-modal>
  <n-modal :style="{width:isMobile?'100%':'60%'}" :showIcon="false" v-model:show="showCron" preset="dialog" :title="$t('page.task.cronGen')">
    <crontab :expression="expression" @fill="fillValue" @close="showCron=false"/>
  </n-modal>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FormItemProps,BaseFormProps } from '@/components/form/types';
import { enableOrDisableOpt,invokeTypeOpts, httpMethods} from '@/constants/options' 
import {taskApi,options} from '@/api/admin'
import {isBoolean} from 'lodash-es'
import Crontab from '@/components/crontab/index.vue'
import { useContext } from '@/store/useContext';

const { t } = useI18n()
const props = defineProps<ModalProps<Task>>()
const {isMobile} = storeToRefs(useContext())
const emit = defineEmits(["update:show", 'success'])

const show = computed({
  get: ()=> props.show,
  set: (val)=> {
    emit('update:show', val)  //会直接调用 :on-update:show 也就是props['onUpdate:show']   :on:xxx=>@xxx
  }
});
let model:Ref<Recordable>=ref({})
const jobs:Ref<OptionWithKey<string>[]> = ref([])
const notifyStrategies:Ref<OptionWithKey<number>[]> = ref([])


const title = props.isEdit?t('page.task.edit'):t('page.task.create')
const formItems:ComputedRef<FormItemProps[]> = computed(()=>{
  const data = props.data;
  return [
    {field: 'name', component: 'NInput',label: t('page.task.name'), defaultValue:data?.['name']},
    {field: 'group', component: 'NInput',label: t('page.task.group'), defaultValue:data?.['group']},
    {field: 'protocol', component: 'NSelect',label: t('page.task.invokeType'), defaultValue:data?.['protocol']||'FUNC', comProps:{ options:invokeTypeOpts, 'onUpdate:value':()=>{model.value['invokeTarget']=''}}},
    {field: 'invokeTarget', component: (formData:Recordable)=>formData['protocol']=='FUNC'?'NSelect':'NInput',label: t('page.task.invokeTarget'), comProps:{options:jobs.value}, defaultValue:data?.['invokeTarget']},
    {field: 'args', component: 'NInput',label: t('page.task.parameter'), defaultValue:data?.['args']},
    {field: 'httpMethod', component: 'NSelect',label: t('page.task.http-method'),hide:v=>v.protocol!='HTTP' ,comProps:{options:httpMethods}, defaultValue:data?.['httpMethod']},
    {field: 'cronExpression', slot: "cronExpression", label: t('page.task.cron'), defaultValue:data?.['cronExpression']},
    {field: 'notifyStrategy', component: 'NSelect',label: t('page.task.notify-strategy'), defaultValue:data?.['notifyStrategy']||"1", comProps:{options:notifyStrategies.value}},
    //通知 TODO
    {field: 'status', component: 'NRadioButton',label: t('common.status'), defaultValue:data?.['status']||1, comProps:{options:enableOrDisableOpt(t)}},
    {field: 'remark', component: 'NInput',label: t('common.remark'), comProps:{type:"textarea"}, defaultValue:data?.['remark']},
  ]
});
const cronExOptions = [
  {label:t('dt.per-min'), key:'0 * * * * ?'},
  {label:t('dt.per-hour'), key:'0 0 * * * ?'},
  {label:t('dt.per-midnight'), key:'0 0 0 * * ?'},
  {label:t('dt.1st-midnight'), key:'0 0 0 1 * ?'},
  {label:t('dt.last-day-of-month-0'), key:'0 0 0 L * ?'},
  {label:t('dt.sunday-0'), key:'0 0 0 ? * 1'},
  {
    key: 'header-divider',
    type: 'divider'
  },
  {label:t('common.custom'), key:'custom'},
]

const bindProps:ComputedRef<BaseFormProps> = computed(()=>({
  labelPlacement:"left",
  labelWidth:130, labelAlign:'right',
  formItems: unref(formItems),
  grid: {cols:'1 s:2', xGap:20},
  rules:{
    name:[{required: true,message: t('page.dept.nameNotEmpty')}],
    group:[{required: true,message:''}],
    protocol:[{required: true,message:''}],
    invokeTarget:[{required: true,message:'',trigger:'change'}],
    httpMethod:[{required: true,message:''}],
    cronExpression:[{required: true,message:''}],
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
      if(props.isEdit){
        formModel.id = props.data?.id
        await taskApi.edit(formModel as Recordable)
      }else{
        await taskApi.create(formModel as Recordable)
      }
      show.value=false
      emit('success')
    }finally{done();}
  },
  onReset: ()=>{
    show.value = false
  }
} as BaseFormProps))


async function fetchJobs(){
  const res = await taskApi.jobs()
  if(res){
    jobs.value = res
  }
}
async function fetchOptions(code:string){
  const res = await options(code)
  if(res){
    notifyStrategies.value = res
    // console.log("notifyStrategies",notifyStrategies.value)
  }
}

function getModel(_model:Ref<Recordable>){
  // console.log("getModel", getModel)
  model = _model
}

function onExSelect(key:string){
  if(key=='custom'){
    openCronModel(model.value['cronExpression']||'')
  }
  else model.value['cronExpression'] = key
}

const showCron = ref(false)
const expression = ref('')
function openCronModel(value:string){
  expression.value = value
  showCron.value = true
}
function fillValue(value:string){
  model.value.cronExpression = value
  showCron.value=false
}

const modalStyle={
  width: '60%',
  minWidth: '800px',
  height:'auto',
  maxHeight: '80vh',
  overflow: 'hidden'
}

fetchJobs()
fetchOptions('notify_strategy')
</script>