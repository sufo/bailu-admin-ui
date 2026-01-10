import {enableOrDisableOpt} from '@/constants/options'
import { FormItemProps } from '@/components/form/types';
import { TableColumn} from '@/components/table/types';
import { NTag } from 'naive-ui'
import { TableAction } from '@/components/table'
import { postApi } from '@/api/admin'
import dayjs from 'dayjs';
import { usePreferenceStore } from '@/store/modules';

export function usePost(tableRef: Ref){

  const {t} = useI18n();
  const preference = usePreferenceStore()

  const formItems: ComputedRef<Array<FormItemProps>> = computed(()=>[
    {field: 'name', component: 'NInput', label: t('page.post.name')},
    {field: 'postCode', component: 'NInput', label: t('page.post.code')},
    {field: 'status', component: 'NSelect', label: t('common.status'), comProps:{options:enableOrDisableOpt(t)}},
  ]);

  const columns: ComputedRef<Array<TableColumn<Post>>> = computed(()=>[
    {key: 'index', hide:false, align:'center', width:60, title: '#',
      render: (_, index) => {return index + 1}
    },
    {key: 'name', hide:false, align:'center', width:120, title:t('page.post.name')},
    {key: 'postCode', hide:false, align:'center', width:90, title:t('page.post.code')},
    {key: 'sort', hide:false, align:'center', width:80, title:t('common.sort')},
    {key: 'remark', hide:false, align:'center', width:140, title:t('page.post.desc')},
    {key: 'status', hide:false, align:'center', width:80, title:t('common.status'),
      render(row){
        row.loading = false;
        return h(
          NTag, 
          {type:'info'},
          {default:()=>enableOrDisableOpt(t).find(e=>e.value==row.status)?.label}
        )
      }
    },
    // {key: 'createdAt', align:'center', hide:false, title:t('common.createTime')},
    {key: 'action', align:'center', width:100, hide:false, fixed:'right', title:t('common.action'),
      render(row:any){
        return h( //id==1为超管，超管不能对其进行任何操作
          'div',
          {class:'flex-center'},
            [
            h(TableAction, 
              { stopButtonPropagation:true,
                row,
                actions:[
                  //修改
                  {permission:'sys:post:edit', icon:'bx:edit', type:'primary', 
                    tooltip:t('button.edit'),
                    onClick: handler.bind(null,"UPDATE",row)
                  }, 

                  { //删除
                    permission:'sys:post:remove',icon:'ant-design:delete-outlined',type:'error', 
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
  const modalProps:Ref<ModalProps<Post>> = 
      ref({show:false,isEdit:false, ['onUpdate:show']:(show)=>modalProps.value['show']=show})

  //crud
  async function handler(operType:ActionType, post?:Post, ...args:Array<string|boolean|number>){
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
        data: post
      }
    }else if(operType==='DELETE'){
      const res  = await postApi.remove(post!!.id)
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }
  };

  async function request<T>(formModel: Recordable):Promise<void|PagesResult<Post[]>>{
    try{
      return await postApi.index(formModel)
    }catch(e){
      return 
    } 
  };

  async function afterRequest(data: Post[]): Promise<void|Post[]>{
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