<template>
<full-modal v-model:show="show"
    :trap-focus="false"
    :mask-closable="false"
    preset="card"
    :title="$t('page.task.detail')">
    <n-descriptions label-placement="left" :column="2" title="" label-class="fw-600">
      <!-- <n-descriptions-item v-for="(value,key) of task" :key="key">
        <template #label>{{key}}</template>{{ value }}
      </n-descriptions-item> -->
      <template v-for="f of fields" :key="f.field">
      <n-descriptions-item v-if="!(f.field=='httpMethod'&&task?.['protocol']!='HTTP')">
        <template #label>{{f.label}}</template>{{ task?.[f.field] }}
      </n-descriptions-item>
    </template>
  </n-descriptions>
  </full-modal>
</template>
<script setup lang="ts">
import {taskApi} from '@/api/admin'
import { useI18n } from 'vue-i18n';
import { invokeTypeOpts } from '@/constants/options' 

defineOptions({name:'CrontabDetail'})
const {t} = useI18n()
const props = defineProps({
  show:{type: Boolean as PropType<boolean>, default:false},
  'onUpdate:show':{type:Function as PropType<(show:boolean)=>void>},
  taskId: {type: Number as PropType<number>}
})

const emit = defineEmits(["update:show"])

const show = computed({
  get: ()=> props.show,
  set: (val)=> {
    emit('update:show', val)  //会直接调用 :on-update:show 也就是props['onUpdate:show']   :on:xxx=>@xxx
  }
});

const fields=computed(()=>[
  {field:'name',label:t('page.task.name')},{field:'group',label:t('page.task.group')},
  {field:'invokeTarget',label:t('page.task.invokeTarget')},{field:'cronExpression',label:t('page.task.cron')},
  {field:'protocolName',label:t('page.task.invokeType')},{field:'args',label:t('page.task.parameter')},
  {field:'lastExecTime',label:t('page.task.preTime')},{field:'nextTime',label:t('page.task.nextTime')},
  {field:'httpMethod',label:t('page.task.http-method')},{field:'notifyStrategy',label:t('page.task.notify-strategy')},
  {field:'remark',label:t('common.remark')},{field:'entryId',label:'entryId'},
])

const task:Ref<Task|undefined> = ref()

async function fetchTask() {
  const res = await taskApi.info(props.taskId!)
  if(res){
    if(res.protocol){
      const findItem = invokeTypeOpts(t).find(i=>i.value===res.protocol)
      res.protocolName=findItem?findItem.label:res.protocol
    }
    task.value = res
  }
}
// if(props.taskId !== -1){
//   fetchTask()
// }
watch(
  ()=>props.taskId,
  (newVal)=>{
    if(newVal!==-1){fetchTask()}
  },{flush:'post'}
)

</script>