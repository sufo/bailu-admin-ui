
import { enableOrDisableOpt } from '@/constants/options'
import { FormItemProps } from '@/components/form/types';
import { TableColumn } from '@/components/table/types';
import { NSwitch, NTag } from 'naive-ui';
import { TableAction } from '@/components/table';
import { roleApi, menuApi } from '@/api/admin';
import dayjs from 'dayjs';
import { usePreferenceStore } from '@/store/modules';
import { usePermission } from '@/hooks/business/usePermission'
import { useIconRender } from '@/components/icon'

export function useRole(tableRef: Ref, formModel: Ref<Recordable>) {

  const roleMenus = ref({});
  const { t } = useI18n();
  const preference = usePreferenceStore();
  const { iconRender } = useIconRender();

  //是否可编辑
  const { hasPermission } = usePermission()
  const canEdit = hasPermission('sys:role:edit')


  const formItems: ComputedRef<Array<FormItemProps>> = computed(() => [
    { field: 'name', component: 'NInput', label: t('page.role.name') },
    { field: 'status', component: 'NSelect', label: t('common.status'), comProps: { options: enableOrDisableOpt(t) } },
    //{field: 'dateRange', component: 'NDatePicker',span:2, defaultValue:ref<[number, number]>([Date.now(), Date.now()]), label: t('common.createTime'),comProps:{type:'daterange'}}
    { field: 'dateRange', component: 'NDatePicker', span: 2, label: t('common.createTime'), comProps: { type: 'daterange' } }
  ]);

  const columns: ComputedRef<Array<TableColumn<Role>>> = computed(() => [
    { key: 'sort', hide: false, align: 'center', width: 70, title: t('layout.table.index'), render: (_, index) => { return index + 1 } },
    { key: 'name', hide: false, align: 'center', minWidth: 140, title: t('page.role.name') },
    { key: 'roleKey', hide: false, align: 'center', width: 140, title: t('page.role.roleVal') },
    {
      key: 'status', hide: false, align: 'center', width: 80, title: t('common.status'),
      render(row) {
        row.loading = false;
        return canEdit ? h(
          NSwitch,
          {
            rubberBand: false,
            value: row.status,
            loading: row.loading,
            'checked-value': 1,
            'unchecked-value': 2,
            "onUpdate:value": (val) => handler("ENABLE", row, val)
          },
        ) : h(
          NTag,
          { type: row.status ? 'success' : 'error' },
          { default: () => enableOrDisableOpt(t).find(e => e.value == row.status)?.label }
        )
      }
    },
    // {key: 'createdAt', align:'center', hide:false, title:t('common.createTime')},
    { key: 'remark', align: 'center', hide: false, minWidth: 100, title: t('page.role.remark') },
    {
      key: 'action', align: 'center', minWidth: 100, hide: false, fixed: 'right', title: t('common.action'),
      render(row: any) {
        return row.id != '1' ? h( //id==1为超管，超管不能对其进行任何操作
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
                    permission: 'sys:role:edit', icon: 'bx:edit', type: 'primary',
                    tooltip: t('button.edit'),
                    onClick: handler.bind(null, "UPDATE", row)
                  },

                  { //删除
                    permission: 'sys:role:remove', icon: 'ant-design:delete-outlined', type: 'error',
                    tooltip: t('button.del'),
                    popConfirm: { message: t('tips.confirmRemove'), onPositiveClick: (e: MouseEvent) => handler("DELETE", row) }
                  },
                ],
                //更多
                dropdownAction: {
                  inverted: preference.isDark,
                  onSelect: (key: string | number) => handler(key as ActionType, row),  //key=DATA_SCOPE或者ASSIGN
                  options: [
                    { permission: 'sys:role:scope', label: t('page.role.dataScope'), key: "DATA_SCOPE", icon: iconRender({ icon: 'ant-design:check-circle-outlined' }) },
                    { permission: 'sys:role:edit', label: t('page.role.assign'), key: "ASSIGN", icon: iconRender({ icon: 'ant-design:user-outlined' }) },
                  ]
                }
              },

            )
          ]
        ) : undefined
      }
    },
  ])

  async function request<T>(params: Recordable): Promise<void | PagesResult<Role[]>> {
    try {
      const mergeParams = Object.assign(formModel.value ?? {}, params)
      const { dateRange, ...rest } = mergeParams
      if (dateRange && unref(dateRange).length == 2) {
        rest["beginDate"] = dayjs(dateRange[0]).format('YYYY-MM-DD');
        rest["endDate"] = dayjs(dateRange[1]).format('YYYY-MM-DD');
      }
      return await roleApi.index(rest)
    } catch (e) {
      return Promise.reject(e)
    }
  };

  const show = ref(false);
  const modalProps: Ref<ModalProps<Role>> =
    ref({
      show: false, isEdit: false,
      ['onUpdate:show']: async (show) => {
        modalProps.value['show'] = show
      }
    })

  const scopeModalProps: Ref<ModalProps<Role>> =
    ref({
      show: false, isEdit: false,
      ['onUpdate:show']: async (show) => {
        scopeModalProps.value['show'] = show
      }
    })
  //crud
  async function handler(operType: ActionType, row?: Role, ...args: Array<string | boolean | number>) {
    if (operType === 'CRAETE') {
      show.value = true
      modalProps.value = {
        ...unref(modalProps),
        show: unref(show),
        isEdit: false,
        data: undefined,
        options: { checkedIds: [], menus: await menuApi.tree() }
      }
    } else if (operType === 'UPDATE') {
      show.value = true
      modalProps.value = {
        ...unref(modalProps),
        show: unref(show),
        isEdit: true,
        data: row,
        options: await menuApi.treeSelect(row!!.id)
      }
    } else if (operType === 'DELETE') {
      const res = await roleApi.remove(row!.id)
      if (res) {
        //重新刷新当前页
        tableRef.value.loadData()
      }
    } else if (operType === 'ENABLE') {
      const status = args[0] as number
      const res = await roleApi.status(row!.id, status.toString())
      row!.loading = false
      if (res) {
        row!.status = status
      }
    } else if (operType === 'DATA_SCOPE') {//数据权限
      scopeModalProps.value.data = row
      scopeModalProps.value.show = true
    } else if (operType === 'ASSIGN') {//分配用户
      //TODO
      window.$message?.info(t('tips.development'))
    }
  }

  async function afterRequest(data: Role[]): Promise<void | Role[]> {
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
    modalProps,
    handler,
    roleMenus,
    scopeModalProps
  }
}