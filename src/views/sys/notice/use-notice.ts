import { FormItemProps } from "@/components/form/types";
import { ActionItem, TableColumn } from "@/components/table/types";
import { noticeApi } from "@/api/admin";
import TableAction from "@/components/table/TableAction.vue";
import { NTag } from "naive-ui";
import {getSendStatusOpts, ifOptions, getNoticeOpts} from '@/constants/options'

export function useNotice(tableRef:Ref,isMobile=ref(false)){
  const {t} = useI18n();
  const types= ['default','success','warning'] as const
  const checkedRowKeys = ref<Array<string | number>>([])

  const formItems: ComputedRef<Array<FormItemProps>> = computed(()=>[
    {field: 'title', component: 'NInput', label: t('common.title')},
    {field: 'type', component: 'NSelect', label: t('common.category'), comProps:{options:getNoticeOpts(t)}},
    {field: 'ifScheduled', component: 'NSelect', label: t('page.notice.scheduled-send'),comProps:{options:ifOptions(t)}},
  ]);  

  const columns: ComputedRef<Array<TableColumn<Notice>>> = computed(()=>[
    {key: 'index', hide:false, align:'center', width:50, title: '#',
      render: (_, index) => {return index + 1}
    },
    {key: 'title', hide:false, align:'center', width:120, title:t('common.title')},
    {key: 'type', hide:false, align:'center', width:90, title:t('common.category'),
      render(row){
        return h(
          NTag, 
          {type:row.type==1?'info':'success'},
          {default:()=>(row.type==1?t('page.notice.notice'):t('page.notice.announcement'))}
        )
      }
    },
    {key: 'sendStatus', hide:false, align:'center', width:80, title:t('common.status'),
      render(row){
        row.loading = false;
        return h(
          NTag, 
          {type:types[parseInt(row.sendStatus)]},
          {default:()=>getSendStatusOpts(t).find(e=>e.value===row.sendStatus)?.label}
        )
      }
    },
    {key: 'sendTime',hide:false, align:'center', width:140, title:t('page.notice.release-time')},
    {key: 'sender', hide:false, align:'center', width:80, title:t('page.notice.sender')},
    {key: 'receivers', hide:false, align:'center', width:80, title:t('page.notice.receiver')},
    {key: 'sendScope', hide:false, align:'center', width:100, title:t('page.notice.scope')},
    {key: 'notifyChannel',hide:false, align:'center', width:100, title:t('page.notice.channal')},
    {key: 'scheduledTime',hide:false, align:'center', width:140, title:t('page.notice.scheduled-time')},
    {key: 'createdAt', align:'center', hide:false,width:140, title:t('common.createTime')},
    {key: 'action', align:'center', width:100, hide:false, fixed:isMobile.value?undefined:'right', title:t('common.action'),
      render(row){

        const editAction:ActionItem = {
          permission:'sys:notice:edit', icon:'bx:edit', type:'primary', 
          tooltip:t('button.edit'),
          onClick: handler.bind(null,"UPDATE",row)
        };
        const releaseAction:ActionItem = {
          permission:'sys:notice:release', icon:'bx:edit', type:'primary', 
          tooltip:t('button.release'),
          onClick: handler.bind(null,"RELEASE",row)
        };
        const cancelAction:ActionItem = {
          permission:'sys:notice:release', icon:'bx:edit', type:'warning', 
          tooltip:t('button.revocation'),
          onClick: handler.bind(null,"REVOCATION",row)
        };
        const actions:ActionItem[] = []
        if(row.sendStatus=='1')
          actions.push(cancelAction)
        else
          actions.push(editAction,releaseAction)

        return h( //id==1为超管，超管不能对其进行任何操作
          'div',
          {class:'flex-center'},
            [
            h(TableAction, 
              { stopButtonPropagation:true,
                row,
                actions:[
                  ...actions,
                  { //删除
                    permission:'sys:notice:remove',icon:'ant-design:delete-outlined',type:'error', 
                    tooltip:t('button.del'),
                    popConfirm:{message:t('tips.confirmRemove'),onPositiveClick:(e:MouseEvent)=>handler("DELETE",row)}
                  },
                ],
              },
              
            )
          ]
        )
      }
    },
  ]);

  const show = ref(false);
  const modalProps:Ref<ModalProps<Notice>> = 
      ref({show:false,isEdit:false, ['onUpdate:show']:(show)=>modalProps.value['show']=show})

  //crud
  async function handler(operType:ActionType, _row?:Notice, ...args:Array<string|boolean|number>){
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
        data: _row
      }
    }if(operType==='DELETE'){
      const res  = await noticeApi.remove(_row!.id+'')
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }else if(operType==='Multi-DELETE'){
      const res  = await noticeApi.remove(checkedRowKeys.value.join(","))
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }
  };

  async function request<T>(formModel: Recordable):Promise<void|Notice[]>{
    try{
      return await noticeApi.index(formModel)
    }catch(e){
      return Promise.reject(e)
    } 
  };

  return {
    formItems,
    columns,
    request,
    modalProps,
    handler,
    checkedRowKeys
  }
}