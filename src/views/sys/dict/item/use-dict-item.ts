import { enableOrDisableOpt } from '@/constants/options'
import { FormItemProps } from '@/components/form/types';
import { TableColumn } from '@/components/table/types';
import { NTag, NSwitch } from 'naive-ui'
import { TableAction } from '@/components/table'
import { dictApi } from '@/api/admin'
import { usePermission } from '@/hooks/business/usePermission'

export function useDictItem(tableRef: Ref, dictCode: Ref<string>) {

  const { t } = useI18n();

  //是否可编辑
  const { hasPermission } = usePermission()
  const canEdit = hasPermission('sys:dict:edit')

  const formItems: Array<FormItemProps> = [
    { field: 'name', component: 'NInput', labelWidth: 50, label: t('common.name') },
    { field: 'status', component: 'NSelect', labelWidth: 60, label: t('common.status'), comProps: { options: enableOrDisableOpt(t) } },
  ];

  const columns: Array<TableColumn<DictItem>> = [
    {
      key: 'index', hide: false, align: 'center', width: 60, title: '#',
      render: (_, index) => { return index + 1 }
    },
    { key: 'label', hide: false, align: 'center', width: 120, title: t('common.name') },
    { key: 'value', hide: false, align: 'center', width: 90, title: t('common.dataVal') },
    {
      key: 'isDefault', hide: false, align: 'center', width: 70, title: t('common.default-val'),
      render(row) {
        return h(
          NTag,
          { type: row.isDefault ? 'info' : undefined },
          { default: () => row.isDefault ? t('status.yes') : t('status.no') }
        )
      }
    },
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
    {
      key: 'action', align: 'center', width: 100, hide: false, fixed: 'right', title: t('common.action'),
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
                    permission: 'sys:dict:edit', icon: 'bx:edit', type: 'primary',
                    tooltip: t('button.edit'),
                    onClick: handler.bind(null, "UPDATE", row)
                  },

                  { //删除
                    permission: 'sys:dict:remove', icon: 'ant-design:delete-outlined', type: 'error',
                    tooltip: t('button.del'),
                    popConfirm: { message: t('tips.confirmRemove'), onPositiveClick: (e: MouseEvent) => handler("DELETE", row) }
                  },
                ],
              },

            )
          ]
        )
      }
    },
  ];

  const show = ref(false);
  const modalProps: Ref<ModalProps<DictItem>> =
    ref({ show: false, isEdit: false, ['onUpdate:show']: (show) => modalProps.value['show'] = show })

  //crud
  async function handler(operType: ActionType, row?: DictItem, ...args: Array<string | boolean | number>) {
    // console.log("dictCode",dictCode)
    if (operType === 'CRAETE') {
      show.value = true
      modalProps.value = {
        ...unref(modalProps),
        show: unref(show),
        isEdit: false,
        data: undefined,
        options: { code: dictCode.value }
      }
    } else if (operType === 'UPDATE') {
      show.value = true
      modalProps.value = {
        ...unref(modalProps),
        show: unref(show),
        isEdit: true,
        data: row
      }
    } else if (operType === 'DELETE') {
      const res = await dictApi.itemRemove(row!!.id)
      if (res) {
        //重新刷新当前页
        tableRef.value.loadData()
      }
    } else if (operType === 'ENABLE') {
      const status = args[0] as number
      const res = await dictApi.itemStatus(row!!.id, status)
      if (res) {
        //重新刷新当前页
        row!.status = status
      }
    }

  };


  async function request<T>(formModel: Recordable): Promise<void | DictItem[]> {
    try {
      return await dictApi.dictItems(dictCode.value, formModel)
    } catch (e) {
      return
    }
  };

  return {
    formItems,
    columns,
    request,
    modalProps,
    handler,
  }
}