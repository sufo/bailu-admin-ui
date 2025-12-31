
import {FormItemProps} from '@/components/form/types'
import { TableColumn } from '@/components/table/types';
import { enableOrDisableOpt, invokeTypeOpts } from '@/constants/options';
import { taskApi } from '@/api/admin'
import {NSwitch,NTag} from 'naive-ui'
import { TableAction } from '@/components/table';

export function useCron(tableRef: Ref, isMobile=ref(false)){
  const {t} = useI18n();
  const show = ref(false);
  const taskId = ref(-1);
  const showDrawer = ref(false);
  const checkedRowKeys = ref<Array<string | number>>([]);
  const formItems:ComputedRef<Array<FormItemProps>> = computed(()=>[
    {field: 'name', component: 'NInput', label: t('page.task.name')},
    {field: 'status', component: 'NSelect', label: t('common.status'),
      comProps:{options:enableOrDisableOpt(t)}} 
  ]);
  const columns: ComputedRef<Array<TableColumn<Task>>> = computed(()=>[
    {key: 'name', hide:false, align:'center', width:100, title:t('page.task.name')},
    {key: 'group', hide:false, align:'center', width:100, title:t('page.task.group')},
    {key: 'invokeTarget', hide:false, align:'center', width:100, title:t('page.task.invokeTarget')},
    {key: 'cronExpression', hide:false, align:'center', width:100, title:t('page.task.cron')},
    {key: 'protocol', hide:false, align:'center', width:100, title:t('page.task.invokeType'),
      render(row){
        row.loading = false;
        return h(
          NTag, 
          {type:'info'},
          {default:()=>invokeTypeOpts.find(i=>i.value===row.protocol)?.label}
        )
      }
    },
    {key: 'args', hide:false, align:'center', width:100, title:t('page.task.parameter')},
    {key: 'lastExecTime', hide:false, align:'center',ellipsis: true, width:100, title:t('page.task.preTime')},
    {key: 'nextTime', hide:false, align:'center', ellipsis: true,width:100, title:t('page.task.nextTime')},
    {key: 'status', hide:false, align:'center', width:80, title:t('common.status'),
      render(row){
        row.loading = false;
        return h(
          NSwitch, 
          { rubberBand:false, 
            value:row.status,
            loading:row.loading,
            'checked-value': 1,
            'unchecked-value':2,
            "onUpdate:value":(val)=>handler("STATUS",row, val)},
        )
      }
    },
    {key: 'action', hide:false, align:'center', fixed:isMobile.value?undefined:'right',width:200, title:t('common.action'),
      render(row){
        return h(
          'div',
          {class:'flex-center'},
          [
            h(TableAction,
              { stopButtonPropagation:true,
                row,
                actions:[
                  {permission:'monitor:task:query', label:t('common.log'),
                    onClick: handler.bind(null,"LOG",row)
                  },
                  {permission:'monitor:task:edit', label:t('button.exec'),
                    onClick: handler.bind(null,"EXEC",row)
                  },
                  {permission:'monitor:task:query', label:t('button.detail'),
                    onClick: handler.bind(null,"VIEW",row)
                  },
                  //修改
                  {permission:'monitor:task:edit', type:'primary', label:t('button.edit'),
                    onClick: handler.bind(null,"UPDATE",row)
                  }, 
                  { //删除
                    permission:'monitor:task:remove',type:'error', label:t('button.del'),
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

  async function request<T>(params: Recordable):Promise<void|Task[]>{
    try{
      return await taskApi.index(params)
    }catch(e){
      Promise.reject(e)
    }
  }

  const modalProps:Ref<ModalProps<Task>> = 
    ref({show:false,isEdit:false, ['onUpdate:show']:(show)=>modalProps.value['show']=show})
  
  const detailModalProps = 
    ref({show:false,taskId:-1, ['onUpdate:show']:(show:boolean)=>detailModalProps.value['show']=show})

  async function handler(operType:ActionType, _row?:Task, ...args:Array<string|boolean|number>){
    if(operType==='CRAETE'){
      show.value = true
      modalProps.value={
        ...unref(modalProps),
        show: unref(show),
        isEdit: false,
        data:undefined
      }
    }else if(operType==='UPDATE'){
      show.value = true
      modalProps.value={
        ...unref(modalProps),
        show: unref(show),
        isEdit: true,
        data:_row!!
      }
    }else if(operType==='DELETE'){
      const res  = await taskApi.remove(_row!.id+'')
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }else if(operType==='Multi-DELETE'){
      const res  = await taskApi.remove(checkedRowKeys.value.join(","))
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }else if(operType==='STATUS'){
      _row!.loading =true
      let status = args[0] as number
      const res = await taskApi.status(_row!.id, status)
      _row!.loading =false
      if(res){
        _row!.status = status
      }
    }else if(operType==='LOG'){
      taskId.value = _row!.id as number
      showDrawer.value=true

    }else if(operType==='EXEC'){
      window.$dialog?.warning({
        title:t('tips.systemPrompt'),
        content: t('tips.taskExecImmediately',{v:_row?.name}),
        positiveText: t('button.confirm'),
        negativeText: t('button.cancelText'),
        onPositiveClick: async () => {
          _row!.loading =true
          const res = await taskApi.invoke(_row!.id)
          _row!.loading =false
          if(res){
            window.$message?.success("任务执行中...")
          }
        },
      })
      
    }else if(operType==='VIEW'){
      taskId.value = _row!.id as number
      detailModalProps.value={
        ...unref(detailModalProps),
        taskId: _row!.id as number,
        show: true
      }

    }else if(operType==='EXPORT'){
      console.log("导出")
    }
  };

  return {
    formItems,
    columns,
    checkedRowKeys,
    request,
    modalProps,
    handler,
    taskId,
    showDrawer,
    detailModalProps
  }
}