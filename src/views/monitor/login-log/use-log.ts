import { FormItemProps } from '@/components/form/types';
import { TableColumn} from '@/components/table/types';
import { NTag } from 'naive-ui'
import { loginLogApi } from '@/api/admin'
import dayjs from 'dayjs';
import { usePreferenceStore } from '@/store/modules';

export function useLoginLog(tableRef: Ref){
  const preference = usePreferenceStore()
  const {t} = useI18n();
  const checkedRowKeys = ref<Array<string | number>>([])

  const formItems: ComputedRef<Array<FormItemProps>> = computed(()=>[
    {field: 'addr', component: 'NInput', label: t('page.loginLog.addr')},
    {field: 'username', component: 'NInput', label: t('page.loginLog.username')},
    {field: 'status', component: 'NSelect', label: t('common.status'), 
      comProps:{
        options:[
          {value: "0", label: t('status.success')},
          {value: "1", label: t('status.failure')}, 
        ] 
      }
    },
    {field: 'dateRange', component: 'NDatePicker',span:1, label: t('page.loginLog.loginTime'),comProps:{type:'daterange'}}
  ]);

  const columns: ComputedRef<Array<TableColumn<LoginLog>>> = computed(()=>[
    {key: 'username', hide:false, align:'center', width:90, title:t('page.loginLog.username')},
    {key: 'ip', hide:false, align:'center', width:120, title:'ip'},
    {key: 'addr', hide:false, align:'center', width:120, title:t('page.oper.addr')},
    {key: 'browser', hide:false, align:'center', width:100, title:t('page.loginLog.browser')},
    {key: 'os', hide:false, align:'center', width:100, title:t('page.loginLog.os')},
    {key: 'status', hide:false, align:'center', width:80, title:t('common.status'),
      render(row){
        return row.status!==undefined?h(
          NTag, 
          {type:'info'},
          {default:()=>row.status===0?t('status.success'):t('status.failure')}
        ):h('span')
      }
    },
    {key: 'loginTime', align:'center', hide:false, width:160,  title:t('page.loginLog.loginTime')},
  ]);

  async function request<T>(params: Recordable):Promise<void|PagesResult<LoginLog[]>>{
    try{
      const {dateRange, ...rest} = params
      if(unref(dateRange)&&unref(dateRange).length==2){
        rest["beginDate"] = dayjs(dateRange[0]).format('YYYY-MM-DD');
        rest["endDate"] = dayjs(dateRange[1]).format('YYYY-MM-DD');
      }
      return await loginLogApi.index(rest)
    }catch(e){
      return Promise.reject(e)
    } 
  };

  //crud
  async function handler(operType:ActionType, _row?:LoginLog, ...args:Array<string|boolean|number>){
    if(operType==='CLEAR'){
      const res  = await loginLogApi.clean()
      if(res){
        tableRef.value.loadData()
      }
    }else if(operType==='DELETE'){
      const res  = await loginLogApi.remove(checkedRowKeys.value.join(","))
      if(res){
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }else if(operType==='EXPORT'){
      console.log("导出")
    }
  };

  async function afterRequest(data: LoginLog[]): Promise<void|LoginLog[]>{
      data.forEach(item=>{
        item.loginTime = dayjs.utc(item.loginTime).local().format(preference.timeTemplate)
      })
      return data
  }


  return {
    formItems,
    columns,
    request,
    afterRequest,
    handler,
    checkedRowKeys
  }
}