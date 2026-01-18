import { httpMethods } from '@/constants/options'
import { FormItemProps } from '@/components/form/types';
import { TableColumn } from '@/components/table/types';
import { NTag } from 'naive-ui'
import { TableAction } from '@/components/table'
import { operationApi } from '@/api/admin'
import dayjs from 'dayjs';
import { usePreferenceStore } from '@/store/modules';

export function useOper(tableRef: Ref) {

  const { t } = useI18n();
  const preference = usePreferenceStore()

  const formItems: ComputedRef<Array<FormItemProps>> = computed(() => [
    { field: 'path', component: 'NInput', label: t('page.oper.reqPath') },
    { field: 'method', component: 'NSelect', label: t('page.oper.reqMathod'), comProps: { options: httpMethods } },
    { field: 'operName', component: 'NInput', label: t('page.oper.operUser') },
    //RespCode
    {
      field: 'status', component: 'NSelect', label: t('common.status'),
      comProps: {
        options: [
          { value: "0", label: t('status.success') },
          { value: "1", label: t('status.failure') },
        ]
      }
    },
    { field: 'dateRange', component: 'NDatePicker', span: 2, label: t('common.createTime'), comProps: { type: 'daterange' } }
  ]);

  const columns: ComputedRef<Array<TableColumn<Operation>>> = computed(() => [
    { key: 'operName', hide: false, align: 'center', width: 90, title: t('page.oper.operUser') },
    { key: 'createdAt', align: 'center', hide: false, width: 160, title: t('common.createTime') },
    {
      key: 'respCode', hide: false, align: 'center', width: 80, title: t('common.status'),
      render(row) {
        return row.respCode !== undefined ? h(
          NTag,
          { type: 'info' },
          { default: () => row.respCode === 0 ? t('status.success') : t('status.failure') }
        ) : h('span')
      }
    },
    { key: 'ip', hide: false, align: 'center', width: 120, title: 'ip' },
    { key: 'location', hide: false, align: 'center', width: 120, title: t('page.oper.addr') },
    { key: 'method', hide: false, align: 'center', width: 80, title: t('page.oper.reqMathod') },
    { key: 'path', hide: false, align: 'center', width: 120, title: t('page.oper.reqPath') },
    { key: 'latency', hide: false, align: 'center', width: 100, title: t('page.oper.latency') },
    { key: 'os', hide: false, align: 'center', width: 100, title: t('page.oper.client') },
    { key: 'browser', hide: false, align: 'center', width: 100, title: t('page.oper.browser') },
    {
      key: 'action', align: 'center', width: 130, hide: false, fixed: 'right', title: t('common.action'),
      render(row: any) {
        return h( //id==1为超管，超管不能对其进行任何操作
          'div',
          { class: 'flex-center' },
          [
            h(TableAction,
              {
                stopButtonPropagation: true,
                row,
                actions: [
                  //修改
                  {
                    permission: 'monitor:operlog:query', icon: 'carbon:view', type: 'primary',
                    label: t('button.detail'),
                    onClick: handler.bind(null, "VIEW", row)
                  },

                  { //删除
                    permission: 'monitor:operlog:remove', icon: 'ant-design:delete-outlined', type: 'error',
                    label: t('button.del'),
                    popConfirm: { message: t('tips.confirmRemove'), onPositiveClick: (e: MouseEvent) => handler("DELETE", row) }
                  },
                ],
              },

            )
          ]
        )
      }
    },
  ]);

  async function request<T>(params: Recordable): Promise<void | PagesResult<Operation[]>> {
    try {
      const { dateRange, ...rest } = params
      if (unref(dateRange) && unref(dateRange).length == 2) {
        rest["beginDate"] = dayjs(dateRange[0]).format('YYYY-MM-DD');
        rest["endDate"] = dayjs(dateRange[1]).format('YYYY-MM-DD');
      }
      return await operationApi.index(rest)
    } catch (e) {
      return Promise.reject(e)
    }
  };

  const row = ref()
  const showDrawer = ref(false)
  //crud
  async function handler(operType: ActionType, _row?: Operation, ...args: Array<string | boolean | number>) {
    if (operType === 'VIEW') {
      showDrawer.value = true
      row.value = _row
    } else if (operType === 'DELETE') {
      const res = await operationApi.remove(_row!!.id)
      if (res) {
        //重新刷新当前页
        tableRef.value.loadData()
      }
    } else if (operType === 'EXPORT') {
      window.$message?.warning(t('tips.development'))
    }
  };


  async function afterRequest(data: Operation[]): Promise<void | Operation[]> {
    data.forEach(item => {
      item.createdAt = dayjs.utc(item.createdAt).local().format(preference.timeTemplate)
    })
    return data
  }


  return {
    formItems,
    columns,
    request,
    afterRequest,
    showDrawer,
    handler,
    row,
  }
}