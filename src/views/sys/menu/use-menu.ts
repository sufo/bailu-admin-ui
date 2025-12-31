/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-18 11:35:06
 * @Desc: 
 */
import { useI18n } from 'vue-i18n';
import { TableColumn } from '@/components/table/types';
import { TableAction } from '@/components/table'
import { menuApi, apis } from '@/api/admin'
import { FormItemProps } from '@/components/form/types';
import { Icon } from '@/components/icon';
import { NTag } from 'naive-ui';
import { enableOrDisableOpt } from '@/constants/options'
import { TreeSelectOption } from 'naive-ui/lib';

// export interface MenuModalProps {
//   show?:boolean;
//   'onUpdate:show'?: (show:boolean)=>void,  //修改show
//   isEdit?:boolean;
//   data?:MenuVo,
// }

export function useMenu(tableRef: Ref) {
  const { t } = useI18n()
  // const {hasEveryPermission} = usePermission()
  const formItems: ComputedRef<Array<FormItemProps>> = computed(() => [
    { field: 'name', component: 'NInput', label: t('page.menu.name') },
    {
      field: 'status', component: 'NSelect', label: t('page.menu.status'),
      comProps: { options: enableOrDisableOpt(t) }
    }
  ]);

  const columns: ComputedRef<Array<TableColumn<MenuVo>>> = computed(() => [
    { key: 'name', hide: false, align: 'center', width: 140, title: t('page.menu.name') },
    {
      key: 'icon', hide: false, align: 'center', width: 60,
      title: t('page.menu.icon'),
      render(row) {
        return (row.icon && row.icon !== '#') ?
          h('div',
            {
              class: 'flex-center'
            }, [
            h(Icon, { icon: row.icon, size: 18 })
          ]
          ) : ''
      }
    },
    { key: 'permission', hide: false, align: 'center', width: 150, title: t('page.menu.authTag') },
    { key: 'component', hide: false, align: 'center', title: t('page.menu.comPath') },
    { key: 'sort', hide: false, align: 'center', width: 60, title: t('common.sort') },
    {
      key: 'status', hide: false, align: 'center', width: 80, title: t('common.status'),
      render(row) {
        return h(
          NTag,
          { type: row.status ? 'success' : 'error' },
          { default: () => enableOrDisableOpt(t).find(e => e.value == row.status)?.label }
        )
      }
    },
    { key: 'createdAt', align: 'center', hide: false, title: t('common.createTime') },
    {
      key: 'action', align: 'center', width: 100, hide: false, fixed: 'right', title: t('common.action'),
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
                  //修改
                  {
                    permission: 'sys:menu:edit', icon: 'bx:edit', type: 'primary',
                    onClick: handler.bind(null, "UPDATE", row)
                  },

                  { //删除
                    permission: 'sys:menu:remove', icon: 'ant-design:delete-outlined', type: 'error',
                    popConfirm: { message: t('tips.confirmRemove'), onPositiveClick: handler.bind(null, "DELETE", row) }
                  }
                ]
              },
              // {
              //   default
              //   pop-action
              //   pop-icon
              //   pop-default
              // }
            )

            //未使用TableAction
            // withDirectives(h(Icon,{icon:'bx:edit',class:'color-primary cursor-pointer'}), [[resolveDirective('permission'), {value:'sys:menu:edit'}] ]),
            // hasEveryPermission(row.permission as string[])??h(NDivider,{vertical:true}),
            // withDirectives(h(Icon,{icon:'ant-design:delete-outlined',class:'color-error cursor-pointer'}),[[resolveDirective('permission'), {value:'sys:menu:remove'}] ]),
          ]
        )
      }
    },
  ])

  async function request<T>(formModel: Recordable): Promise<void | MenuVo[]> {
    try {
      const res = await menuApi.index(formModel)
      return res
    } catch (e) {
      return
    }
  }

  const show = ref(false)
  const menuModalProps: Ref<ModalProps<MenuVo, TreeSelectOption[]>> =
    ref({ show: false, isEdit: false, ['onUpdate:show']: (show: boolean) => menuModalProps.value['show'] = show })

  //crud
  async function handler(operType: ActionType, row?: Recordable) {
    const menuVo = row as MenuVo
    if (operType === 'CRAETE') {
      show.value = true
      menuModalProps.value = {
        ...unref(menuModalProps),
        show: unref(show),
        isEdit: false,
        data: undefined
      }
    } else if (operType === 'UPDATE') {
      show.value = true
      menuModalProps.value = {
        ...unref(menuModalProps),
        show: unref(show),
        isEdit: true,
        data: menuVo
      }
    } else if (operType === 'DELETE') {
      const res = await menuApi.remove(row!!.id)
      if (res) {
        //重新刷新当前页
        tableRef.value.loadData()
      }
    }
  }

  async function fetchApis() {
    const res = await apis()
    menuModalProps.value.options = res
    return res
  }


  return {
    formItems,
    columns,
    request,
    menuModalProps,
    handler,
    fetchApis
  }
}
