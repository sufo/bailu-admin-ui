
import { isFunction } from '@/utils/util'
import { BaseFormProps, FormItemProps } from './types'
import { FormInst } from 'naive-ui'

export function useFormEvent(formElRef: Ref<FormInst | null>, props: BaseFormProps, formModel: Ref<Recordable>, emit: EmitType, loading: Ref<boolean>) {

  const visible = (hide?: boolean | ((option: Recordable) => boolean)) => {
    if (hide === undefined) {
      return true
    }
    else if (isFunction(hide)) {
      return !hide(unref(formModel))
    } else {
      return !hide
    }
  }

  /**
    * 自动创建model
  */
  const createModel = () => {
    props.formItems!.forEach(item => {
      setDefault(item)
    })
    //初始化发送formModel,如果是修改，则合并原始数据
    // formModel.value = Object.assign({},props.formData||{}, formModel.value)

    //如果是修改，赋值主键给formModel
    if (props && props.formData?.id) {
      formModel.value.id = props.formData.id
    }
    emit("filledModel", formModel)
  }

  function setDefault(item: FormItemProps) {
    const defaultValue = unref(item.defaultValue)
    if (defaultValue !== undefined && visible(item?.hide))
      formModel.value[item.field] = defaultValue
    else {
      //直接在formData里面看能都找到对应的值
      const defVal = props.formData?.[item.field];
      switch (item.component) {
        //文本
        case 'NInput':
        case 'NAutoComplete':
          formModel.value[item.field] = defVal || ''; break;
        case 'NInputNumber':
          formModel.value[item.field] = defVal || 0; break;
        case 'NSelect':
        case 'NTreeSelect':
          formModel.value[item.field] = defVal || (item.comProps?.multiple ? [] : null); break;
        //单选
        case 'NRadioGroup':
        case 'NRadio':
        case 'NRadioButton':
        case 'NCascader': //下拉联动
          formModel.value[item.field] = defVal || null; break;
        //多选  
        case 'NCheckbox':
          formModel.value[item.field] = defVal || []; break;
        case 'NDatePicker': //日期
          formModel.value[item.field] = item.comProps?.type.endsWith('range') ? (ref(defVal) || ref(null)) : (defVal || null); break;
        case 'NSwitch':
          formModel.value[item.field] = defVal || false; break;
        default:
          formModel.value[item.field] = defVal || null; break;
      }
    }
  }

  /**动态组件无法使用自动导入
   * 这里手动动态导入
   */
  // async function dynamicImport(){
  //   props.formItems.forEach(async item=>{
  //     //@ts-ignore
  //     (await import('naive-ui'))[item.component]
  //   })
  // }

  async function onSubmit(e?: Event): Promise<boolean> {
    e?.preventDefault();
    loading.value = true;
    const formEl = unref(formElRef);
    if (!formEl) return false;
    try {
      // console.log("base-form formModel",formModel.value)
      if (props.rules)
        await formEl.validate();
      emit('submit', toRaw(unref(formModel)), () => { loading.value = false });
      return true
    } catch (error: any) {
      loading.value = false
      emit('submit', false, (_loading: boolean = false) => { loading.value = _loading });
      console.log(error);
      return false;
    }
  }


  async function onReset(e?: Event): Promise<void> {
    e?.preventDefault()
    const { submitOnReset } = unref(props);
    const formEl = unref(formElRef)
    if (!formEl) return
    //重置model 
    createModel()
    await formEl?.restoreValidation();
    emit("reset")
    submitOnReset && (await onSubmit());
  }

  function handleEnterPress(e: KeyboardEvent) {
    if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
      const target: HTMLElement = e.target as HTMLElement;
      if (target && target.tagName && target.tagName.toUpperCase() == 'INPUT') {
        onSubmit(e)
      }
    }
  }

  return {
    onReset,
    onSubmit,
    handleEnterPress,
    createModel,
    setDefault
  }

}
