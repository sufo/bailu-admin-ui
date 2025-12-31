/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-18 12:08:06
 * @Desc: 
 */
import { FormItemProps } from '@/components/form/types';
import { TableColumn } from '@/components/table/types';
import { onlineApi } from '@/api/admin'
import { TableAction } from '@/components/table'

export function useOnlineUser(tableRef: Ref) {

  const { t } = useI18n();

  const formItems: ComputedRef<Array<FormItemProps>> = computed(() => [
    { field: 'addr', component: 'NInput', label: t('page.loginLog.addr') },
    { field: 'username', component: 'NInput', label: t('page.loginLog.username') },
  ]);

  const columns: ComputedRef<Array<TableColumn<OnlineUser>>> = computed(() => [
    { key: 'username', hide: false, align: 'center', width: 90, title: t('page.onlineUser.loginName') },
    { key: 'deptName', hide: false, align: 'center', width: 90, title: t('page.dept.name') },
    { key: 'ip', hide: false, align: 'center', width: 120, title: 'ip' },
    { key: 'addr', hide: false, align: 'center', width: 120, title: t('page.oper.addr') },
    { key: 'browser', hide: false, align: 'center', width: 100, title: t('page.loginLog.browser') },
    { key: 'os', hide: false, align: 'center', width: 100, title: t('page.loginLog.os') },
    { key: 'loginTime', align: 'center', hide: false, width: 160, title: t('page.loginLog.loginTime') },
    {
      key: 'action', hide: false, align: 'center', fixed: 'right', width: 80, title: t('common.action'),
      render(row) {
        return h(
          'div',
          { class: 'flex-center' },
          [
            h(TableAction,
              {
                stopButtonPropagation: true,
                row,
                actions: [
                  { //强制下线
                    label: t('page.onlineUser.forceOut'),
                    permission: 'monitor:online:remove', icon: 'carbon:logout', type: 'error',
                    popConfirm: { message: t('page.onlineUser.forceOutWarn', row.username), onPositiveClick: (e: MouseEvent) => handler("KICKOUT", row) }
                  }
                ]
              },
            )
          ]
        )
      }

    },
  ]);

  async function request<T>(params: Recordable): Promise<void | OnlineUser[]> {
    try {
      return await onlineApi.index(params)
    } catch (e) {
      return Promise.reject(e)
    }
  };

  //crud
  async function handler(operType: ActionType, _row?: OnlineUser, ...args: Array<string | boolean | number>) {
    if (operType === 'KICKOUT') {
      const res = await onlineApi.kickout(_row!!.id + "")
      if (res) {
        tableRef.value.loadData()
      }
    } else if (operType === 'EXPORT') {
      console.log("导出")
    }
  };


  return {
    formItems,
    columns,
    request,
    handler,
  }
}