<template>
  <base-form labelPlacement="left"
      :label-width="70"
      @submit="onSearch" :formItems="formItems"
      :show-feedback="false" 
      :grid="{xGap:0,cols:'16 xl:16'}"
      :action="{span:5}"
      class="justify-self-end"/>
  <bailu-table tbKey="crontabLogTable" 
    :request="request"
    ref="tableRef" class="mt-0!"
    v-model:checked-row-keys="checkedRowKeys"
    :row-key="row=>row.id"
    adaptive hasSection
    :title="' '" :columns="columns">
    <template #toolbar>
      <n-button :size="preference.theme.size" ghost type="error"
        :disabled="checkedRowKeys.length==0"
        v-permission="{value:'monitor:task:remove'}"
        @click="openDialog('DELETE')">
        <template #icon><icon icon="ant-design:delete-outlined"/></template>
        {{$t('button.del')}}</n-button>
    </template>
  </bailu-table>
</template>
<script setup lang="ts">
import { BailuTable } from '@/components/table';
import { FormItemProps } from '@/components/form/types';
import {TableColumn} from '@/components/table/types'
import {NTag} from 'naive-ui'
import { taskApi,options} from '@/api/admin';
import { usePreferenceStore } from '@/store/modules';
import {TableAction} from '@/components/table'

defineOptions({name: 'CrontabLog'})

const props = defineProps<{
  taskId:number
}>()
// const {prefixCls} = useDesign("crontab-log")
const tableRef = ref()
const {t} = useI18n()
const preference = usePreferenceStore()
const taskExecStatus:Ref<Array<OptionWithKey<number>>>=ref([])
const checkedRowKeys = ref<Array<string | number>>([]);

const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>[
  {field: 'dateRange', component: 'NDatePicker',span:7, label: t('common.createTime'),comProps:{type:'daterange'}},
  {field: 'status', component: 'NSelect',span:4, label: t('common.status'),
      comProps:{options:taskExecStatus.value}} 
]);
const tagType = ['info','success','error','warning'] as const
const columns: ComputedRef<Array<TableColumn<TaskLog>>> = computed(()=>[
    {key: 'taskName', hide:false, align:'center',ellipsis: true, width:100, title:t('page.task.name')},
    // {key: 'invokeTarget', hide:false, align:'center', width:100, title:t('page.task.invokeTarget')},
    {key: 'result', hide:false, align:'center',ellipsis: true, width:100, title:t('page.task.log-info')},
    {key: 'totalTime', hide:false, align:'center',ellipsis: true, width:120, title:t('page.task.execTime')},
    {key: 'exceptInfo', hide:false, align:'center',ellipsis: true, width:120, title:t('page.task.except')},
    {key: 'startTime', hide:false, align:'center',ellipsis: true, width:120, title:t('common.createTime')},
    {key: 'status', hide:false, align:'center',ellipsis: true, width:90, title:t('page.task.execStatus'),
      render(row){
        row.loading = false;
        return h(
          NTag, 
          {type:tagType[row.status-1]},
          {default:()=>taskExecStatus.value?.find(e=>e.value==row.status)?.label}
        )
      }
    },
    {key: 'action', hide:false, align:'center', fixed:'right',width:60, title:t('common.action'),
      render(row){
        return h(
          'div',
          {class:'flex-center'},
          [
            h(TableAction,
              { stopButtonPropagation:true,
                row,
                actions:[
                  { //删除
                    permission:'sys:tasklog:remove',type:'error', label:t('button.del'),
                    popConfirm:{message:t('tips.confirmRemove'),onPositiveClick:(e:MouseEvent)=>handler("DELETE",row)}
                  },
                ]
              },

            )
          ]
        )
      }
    }

  ]); 

async function request<T>(params: Recordable):Promise<void|PagesResult<TaskLog[]>>{
  try{
    const {dateRange, ...rest} = params
    if(dateRange&&dateRange.length==2){
      rest["beginDate"] = dateRange[0];
      rest["endDate"] = dateRange[1];
    }
    return await taskApi.logs(props.taskId, rest)
  }catch(e){
    Promise.reject(e)
  }
};

async function handler(operType:ActionType, _row ?: TaskLog){
  if(operType==='DELETE'){
      const res  = await taskApi.remove(_row!.id+'')
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
  }else if(operType==='Multi-DELETE'){
    const res = await taskApi.removeLogs(checkedRowKeys.value.join(","))
    if(res){
      tableRef.value.loadData()
    }
  }
}

// const actionProps:ActionsProps = {
//   space:{justify:'start',wrap:false, 
//     size: [6,12]
//   }
// }


function openDialog(type:ActionType){
  window.$dialog?.warning({
    title:t('common.warn'),
    content: t('tips.removeWarn'),
    positiveText:t('button.confirm'),
    negativeText:t('button.cancelText'),
    onPositiveClick: ()=>{
        handler(type)
    }
  })
}

const onSearch = async (formModel:Recordable, done: ()=>void)=>{
  await tableRef.value.loadData({...formModel})
  done()
}

async function fetchTaskLogStates(){
  const res = await options("task_exec_status")
  if(res){
    taskExecStatus.value = res
  }
}

fetchTaskLogStates()
</script>