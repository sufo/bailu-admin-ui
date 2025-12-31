import { FormItemProps } from '@/components/form/types';
import { TableColumn} from '@/components/table/types';
import { TableAction } from '@/components/table'
import { dictApi } from '@/api/admin'

export function useDict(tableRef: Ref){

  const {t} = useI18n();

  const formItems: ComputedRef<Array<FormItemProps>> = computed(()=>[
    {field: 'name', component: 'NInput', span:2, label: t('page.dict.nameOrCode')},
  ]);

  const columns: ComputedRef<Array<TableColumn<Dict>>> = computed(()=>[
    {key: 'index', hide:false, align:'center', width:50, title: '#',
      render: (_, index) => {return index + 1}
    },
    {key: 'name', hide:false, align:'center', width:140, title:t('page.dict.name')},
    {key: 'code', hide:false, align:'center', width:160, title:t('page.dict.code')},
    {key: 'description', hide:false, align:'center', width:160, title:t('common.desc')},
    {key: 'action', align:'center', width:180, hide:false, fixed:'right', title:t('common.action'),
      render(row:any){
        return h(
          'div',
          {class:'flex-center'},
            [
            h(TableAction, 
              { stopButtonPropagation:true,
                row,
                actions:[
                  //修改
                  {permission:'sys:dict:edit', icon:'bx:edit', type:'primary', 
                    label:t('button.edit'),
                    onClick: handler.bind(null,"UPDATE",row)
                  }, 

                  {permission:'sys:dict:query', icon:'ion:settings-outline', type:'primary', 
                    label:t('page.dict.configure'),
                    onClick: handler.bind(null,"VIEW",row)
                  },

                  { //删除
                    permission:'sys:dict:remove',icon:'ant-design:delete-outlined',type:'error', 
                    label:t('button.del'),
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

  const code = ref('');
  const showDrawer = ref(false);
  const show = ref(false);
  const modalProps:Ref<ModalProps<Dict>> = 
      ref({show:false,isEdit:false, ['onUpdate:show']:(show)=>modalProps.value['show']=show})

  //crud
  async function handler(operType:ActionType, row?:Dict, ...args:Array<string|boolean|number>){
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
        data: row
      }
    }else if(operType==='DELETE'){
      const res  = await dictApi.remove(row!!.code)
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }else if(operType==='VIEW'){
      code.value = row!.code
      showDrawer.value = true
    }
  };

  async function request<T>(formModel: Recordable):Promise<void|Dict[]>{
    try{
      return await dictApi.index(formModel)
    }catch(e){
      return 
    } 
  };

  return {
    code,
    formItems,
    columns,
    request,
    modalProps,
    handler,
    showDrawer
  }
}