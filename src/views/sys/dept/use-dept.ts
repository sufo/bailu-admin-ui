
import {enableOrDisableOpt} from '@/constants/options'
import { FormItemProps } from '@/components/form/types';
import { TableColumn} from '@/components/table/types';
import { NTag } from 'naive-ui';
import { TableAction } from '@/components/table';
import { deptApi } from '@/api/admin';
import dayjs from 'dayjs';
import { usePreferenceStore } from '@/store/modules';


export function useDept(tableRef: Ref){
  const preference = usePreferenceStore()
  const { t } = useI18n() 
  const formItems: ComputedRef<Array<FormItemProps>> = computed(()=>[
    {field: 'name', component: 'NInput',label: t('page.dept.name')},
    {field: 'status', component: 'NSelect', label: t('common.status'),
    comProps:{options:enableOrDisableOpt(t)}}
  ]);

  const columns: ComputedRef<Array<TableColumn>> = computed(()=>[
    {key: 'name', hide:false, align:'center', minWidth:160, title:t('page.dept.name')},
    {key: 'sort', hide:false, align:'center', width:60, title: t('common.sort')},
    {key: 'status', hide:false, align:'center', width:80, title:t('common.status'),
      render(row){
        return h(
          NTag, 
          {type:row.status?'success':'error'},
          {default:()=>enableOrDisableOpt(t).find(e=>e.value==row.status)?.label}
        )
      }
    },
    // {key: 'createdAt', align:'center', hide:false, title:t('common.createTime')},
    {key: 'action', align:'center', width:120, hide:false, fixed:'right', title:t('common.action'),
      render(row){
        return h(
          'div',
          {class:'flex-center'},
          [
            h(TableAction, 
              { stopButtonPropagation:true,
                row,
                actions:[
                  //修改
                  {permission:'sys:dept:edit', icon:'bx:edit', type:'primary', 
                    onClick: handler.bind(null,"UPDATE",row)
                  }, 

                  { //删除
                    permission:'sys:dept:remove',icon:'ant-design:delete-outlined',type:'error', 
                    popConfirm:{message:t('tips.confirmRemove'),onPositiveClick:(e:MouseEvent)=>handler("DELETE",row)}
                  }
                ] 
              },
              // {
              //   default:()=>xxxx,  //默认插槽的
              // }
            )
            
          ]
        )
      }
    },
  ])

  //不分页
  async function request<T>(formModel: Recordable):Promise<void|Dept[]>{
    try{
      return await deptApi.index(formModel)
    }catch(e){
      return 
    } 
  };

  const show = ref(false);
  const modalProps:Ref<ModalProps<Dept>> = 
    ref({show:false,isEdit:false, ['onUpdate:show']:(show)=>modalProps.value['show']=show})

  //crud
  async function handler(operType:ActionType, row?:Recordable){
    const dept = row as Dept
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
        data: dept
      }
    }else if(operType==='DELETE'){
      const res  = await deptApi.remove(dept.id)
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }
  }

  async function afterRequest(data: Dept[]): Promise<void|Dept[]>{
      data.forEach(item=>{
        item.createdAt = dayjs.utc(item.createdAt).local().format(preference.timeTemplate)
      })
      return data
  }

  return {
    formItems,
    columns,
    request,
    afterRequest,
    modalProps,
    handler,
  }
}