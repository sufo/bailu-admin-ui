
import { enableOrDisableOpt, sexOptions } from '@/constants/options'
import { FormItemProps } from '@/components/form/types';
import { TableColumn } from '@/components/table/types';
import { NButton, NInput, NPopconfirm, NSwitch } from 'naive-ui';
import { TableAction } from '@/components/table';
import { userApi } from '@/api/admin';
import { NTag, TreeOverrideNodeClickBehavior } from 'naive-ui';
import { rsa } from '@/utils/rsa';
import { withDirectives, resolveDirective, computed } from 'vue';
import { findNode } from '@/utils/tree';
import { Icon } from '@/components/icon'

export function useUser(tableRef: Ref, formModel: Ref<Recordable>, depts: Ref, isMobile: Ref = ref(false)) {

  const { t } = useI18n();
  const pwd = ref('');
  // const depts:Ref<SelectOption[]|[]> = ref([]);
  //用computed解决i8n响应式
  const formItems: ComputedRef<Array<FormItemProps>> = computed(() => [
    { field: 'username', component: 'NInput', label: t('page.user.name') },
    { field: 'phone', component: 'NInput', label: t('login.mobile') },
    { field: 'status', component: 'NSelect', label: t('common.status'), comProps: { options: enableOrDisableOpt(t) } },
  ]);

  const columns: ComputedRef<Array<TableColumn<User>>> = computed(() => [
    {
      key: 'index', hide: false, align: 'center', width: 65, title: t('layout.table.index'),
      render: (_, index) => { return index + 1 }
    },
    { key: 'username', hide: false, align: 'center', width: 90, title: t('page.user.name') },
    { key: 'nickName', hide: false, align: 'center', width: 120, title: t('page.user.nickName') },
    {
      key: 'sex', hide: false, align: 'center', width: 60, title: t('page.user.sex'),
      render(row) {
        let sexItem = sexOptions(t).find(s => s.value == row.sex)
        let sex = sexItem ? sexItem.label : ''
        h(sex)
      }
    },
    { key: 'phone', hide: false, align: 'center', width: 140, title: t('login.mobile') },
    { key: 'email', hide: false, align: 'center', width: 120, title: t('login.email') },
    {
      key: 'role', hide: false, align: 'center', width: 140, title: t('page.role.role'),
      render(row: User) {
        const tags = row.roles?.map(({ name }) => {
          return h(
            NTag,
            { type: 'info', class: 'not-last:mr-6px' },
            { default: () => name }
          )
        })
        return tags
      },
    },
    {
      key: 'dept', hide: false, align: 'center', width: 140, title: t('page.user.belongDept'),
      render(row: User) {
        let deptName = row.deptId
        const findItem = findNode(depts.value, e => e.key === row.deptId, { id: 'key' })
        if (findItem) deptName = findItem.label
        return deptName ? h(
          NTag,
          { type: 'info' },
          {
            default: () => deptName
          }
        ) : undefined
      }
    },
    {
      key: 'status', hide: false, align: 'center', width: 80, title: t('common.status'),
      render(row) {
        row.loading = false;
        return h(
          NSwitch,
          {
            rubberBand: false,
            value: row.status,
            loading: row.loading,
            'checked-value': 1,
            'unchecked-value': 2,
            "onUpdate:value": (val) => handler("ENABLE", row, val)
          },
        )
      }
    },
    {
      key: 'action', align: 'center', width: 180, hide: false, fixed: isMobile ? undefined : 'right', title: t('common.action'),
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
                  // {permission:'sys:user:resetPwd', icon:'ant-design:redo-outlined', type:'info', 
                  // label:t('login.password'), popConfirm:{showIcon:false, positiveButtonProps:{disabled:!unref(pwd), loading:row.loading}, onPositiveClick:(e:MouseEvent)=>handler.bind(null,"RESET_PWD",row)},
                  // }, 
                  //修改
                  {
                    permission: 'sys:user:edit', icon: 'bx:edit', type: 'info',
                    label: t('button.edit'),
                    onClick: handler.bind(null, "UPDATE", row)
                  },

                  { //删除
                    permission: 'sys:user:remove', icon: 'ant-design:delete-outlined', type: 'info',
                    label: t('button.del'),//tooltip:t('button.del'),
                    popConfirm: { message: t('tips.confirmRemove'), onPositiveClick: (e: MouseEvent) => handler("DELETE", row) }
                  },
                ],
              },
              {
                prefix: () => withDirectives(
                  //加一层div解决自定义指令问题[Runtime directive used on component with non-element root node. The directives will not function as intended.]
                  h('div', {},
                    [h(NPopconfirm,
                      {
                        showIcon: false,
                        show: row!.popShow, onUpdateShow: (val) => row!.popShow = val,
                        positiveButtonProps: { disabled: !unref(pwd), loading: row.loading },
                        onNegativeClick: () => { pwd.value = ''; row!.popShow = false },
                        onPositiveClick: () => handler("RESET_PWD", row)
                      },
                      {
                        trigger: () => h(NButton, { type: 'info', size: 'small', quaternary: true, round: true }, { default: () => '密码', icon: () => h(Icon, { icon: 'ant-design:redo-outlined' }) }),
                        default: () => h(NInput, { value: unref(pwd), ['on-update:value']: (value: string) => pwd.value = value, clearable: true })
                      }
                    )]
                  ),
                  [[resolveDirective('permission'), { value: 'sys:user:resetPwd' }]]
                )
              }
            )
          ]
        ) : undefined
      }
    },
  ]);

  async function request<T>(params: Recordable): Promise<void | User[]> {
    try {
      const mergeParams = Object.assign(formModel.value ?? {}, params)
      return await userApi.index(mergeParams)
    } catch (e) {
      return Promise.reject(e)
    }
  };

  const show = ref(false);
  const modalProps: Ref<ModalProps<User>> =
    ref({
      show: false, isEdit: false,
      ['onUpdate:show']: async (show) => {
        modalProps.value['show'] = show
      }
    })

  //crud
  async function handler(operType: ActionType, row?: User, ...args: Array<string | boolean | number>) {
    if (operType === 'CRAETE') {
      show.value = true
      modalProps.value = {
        ...unref(modalProps),
        show: unref(show),
        isEdit: false,
        data: undefined,
        // options:unref(depts),
      }
    } else if (operType === 'UPDATE') {
      show.value = true
      modalProps.value = {
        ...unref(modalProps),
        show: unref(show),
        isEdit: true,
        data: row,
        // options: unref(depts),
      }
    } else if (operType === 'DELETE') {
      debugger
      const res = await userApi.remove(row!.id)
      if (res) {
        //重新刷新当前页
        tableRef.value.loadData()
      }
    } else if (operType === 'ENABLE') {
      const status = args[0] as number
      const res = await userApi.status(row!.id, status.toString())
      row!.loading = false
      if (res) {
        row!.status = status
      }
    } else if (operType === 'RESET_PWD') {//数据权限
      row!.loading = true
      const password = rsa.encryptByPublicKey(pwd.value) as string
      const res = await userApi.resetPwd(row!.id, password)
      row!.loading = true
      if (res) {
        row!.popShow = false
      }
    }
  }

  const override: TreeOverrideNodeClickBehavior = ({ option }) => {
    formModel.value.deptId = option.key
    tableRef.value.query()
    return 'default'
  }

  return {
    formItems,
    columns,
    request,
    modalProps,
    handler,
    override
    // depts,
  }
}