/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-03-07 11:14:07
 * @Desc: 
 */
import { Component, PropType } from 'vue';
// import { ExtractPublicPropTypes } from 'naive-ui/es/_utils';
import { FormProps, formProps, ButtonProps, FormItemGiProps, GridProps as NGridProps, SpaceProps, GridItemProps } from 'naive-ui';
import { CSSProperties, VNode } from 'vue';
export type EmitType = (event: string, ...args: any[]) => void;
export type FormItemType = 'text' | 'select' | 'multi-select' | 'checkbox' | 'number' | 'cascader' | 'auto-complete' | 'radio' | 'switch' | 'date' | 'date-range' | 'button' | 'reset' | 'search'
export type ComponentType = 'NInput'
  | 'NInputGroup'
  | 'NInputPassword'
  | 'NInputSearch'
  | 'NInputTextArea'
  | 'NInputNumber'
  | 'NInputCountDown'
  | 'NSelect'
  | 'NTreeSelect'
  | 'NRadioButtonGroup'
  | 'NRadioGroup'
  | 'NRadio'
  | 'NRadioButton'
  | 'NCheckbox'
  | 'NCheckboxGroup'
  | 'NAutoComplete'
  | 'NCascader'
  | 'NDatePicker'
  | 'NMonthPicker'
  | 'NRangePicker'
  | 'NWeekPicker'
  | 'NTimePicker'
  | 'NSwitch'
  | 'NStrengthMeter'
  | 'NUpload'
  | 'IconPicker'
  | 'NRender'
  | 'NSlider'
  | 'NRate';

export type ComponentTypeFunc = (formModel: Recordable) => ComponentType

//  /* @vue-ignore */
export interface FormItemProps extends /* @vue-ignore */ Omit<FormItemGiProps, 'label'> {
  field: string,  //跟FormItemProps里面的path一样
  // type: FormItemType, //组建类型
  label?: string | ((formModel: Recordable) => string)
  defaultValue?: any
  component?: ComponentType | Component | ComponentTypeFunc
  hide?: boolean | ((formModel: Recordable) => boolean), //是否不显示
  //options?: Array<CascaderOption|SelectGroupOption|SelectOption|AutoCompleteOption>, //select|cascader
  comProps?: Recordable  //每个组件的props，这里面给默认值可能无效
  loading?: Ref<boolean>  //只对按钮有效
  icon?: string | VNode   //只对按钮有效
  slot?: string  //插槽名称
  labelTip?: string  //label说明
  labelTipStyle?: CSSProperties | string
  suffixSolt?: string  //后缀。跟FormItemGiProps的suffix区分
}

export interface GIButtonProps extends /* @vue-ignore */ ButtonProps {
  span?: number,
}
export interface VbuttonProps extends /* @vue-ignore */ ButtonProps {
  show?: boolean;
  icon?: string | VNode;
  label?: string //按钮文字 
}

//Grid style class
export interface GridProps extends/* @vue-ignore */ NGridProps {
  style?: CSSStyleDeclaration,
  class?: string | (string | Record<string, boolean> | undefined)[]
  // class: {
  //   type: [String, Array] as PropType<string | (string | Record<string, boolean> | undefined)[]>,
  //   default: 'grid-cols-[repeat(auto-fill,minmax(260px,1fr))]',
  // }
}

export interface ActionsProps extends GridItemProps {
  style?: CSSStyleDeclaration,
  class?: string | (string | Record<string, boolean> | undefined)[]
  space?: SpaceProps,
}
// export interface ActionsProps extends Omit<SpaceProps, 'themeOverrides'>{
//   span?: string,
//   style?: CSSStyleDeclaration,
//   class?: string | (string | Record<string, boolean> | undefined)[]
// }

const { onSubmit, ..._formProps } = formProps
export const baseFormProps = {
  ..._formProps,
  // layout: {type: String as PropType<'inline'|'block'>, default:'inline'},
  // labelWidth: {type: [String,Number,undefined] as PropType<string|number|undefined>, default: 80},
  labelWidth: { type: [String, Number, undefined] as PropType<string | number | undefined> },

  formItems: { type: Array as PropType<Array<FormItemProps>>, require: true },
  //表单数据，修改时才有值
  formData: { type: Object as PropType<Recordable>, default: () => { } },
  // modelValue: Recordable
  // showSubmitButton:{type:Boolean as PropType<boolean>, default:true},
  // showResetButton: {type:Boolean as PropType<boolean>, default:true},
  // submitButtonOptions: {type: Object as PropType<Partial<GIButtonProps>>, default: {span:3}},
  // resetButtonOptions: {type: Object as PropType<Partial<GIButtonProps>>, default: {span:3}},

  //两个按钮的属性
  // positiveOptions: {type: Object as PropType<Partial<VbuttonProps>>, default: {show:true}},
  // negativeOptions: {type: Object as PropType<Partial<VbuttonProps>>, default: {show:true}},
  submitButtonOptions: { type: Object as PropType<Partial<VbuttonProps>>, default: { show: true } },
  resetButtonOptions: { type: Object as PropType<Partial<VbuttonProps>>, default: { show: true } },
  //按钮容器space属性
  action: { type: Object as PropType<ActionsProps>, default: () => ({ space: { align: 'center', justify: 'end' } }) },
  //default无法处理合并问题，所以这个把默认值放在组件中处理
  // grid:{type: Object as PropType<GridProps>, default:()=>({responsive: 'screen', cols:'2 m:3 l:4 xl:5'})},
  grid: { type: Object as PropType<GridProps> }, //form内部元素布局

  submitOnReset: { type: Boolean as PropType<boolean>, default: true },  //reset后会发起查询
}

export interface BaseFormProps extends /* @vue-ignore */ Partial<Omit<FormProps, 'onSubmit'>> {
  // layout?: 'inline'|'block'
  formItems?: Array<FormItemProps>;  //没个项目相关属性

  formData?: Recordable; //要修改的对象值
  // modelValue: Recordable
  // showSubmitButton?: boolean
  // showResetButton?: boolean
  // submitButtonOptions?: Partial<GIButtonProps>
  // resetButtonOptions?: Partial<GIButtonProps>
  submitButtonOptions?: Partial<VbuttonProps>;
  resetButtonOptions?: Partial<VbuttonProps>;
  action?: ActionsProps; //按钮容器space属性
  grid?: GridProps;  //style class 
  submitOnReset?: boolean;  //reset后会发起查询
  //让方法也可以定义在props中 :on-submit或者@submit
  onSubmit?: (formModel: Recordable | boolean, done: () => void) => void;
  onReset?: () => void
}
// export type BaseFormProps = ExtractPublicPropTypes<typeof baseFormProps>

//searchForm
export interface SearchFormProps extends BaseFormProps {
  //mobile label width
  labelWidthSm?: number | string
}

export const searchFormProps = {
  ...baseFormProps,
  labelWidthSm: { type: [String, Number, undefined] as PropType<string | number | undefined>, default: 80 },
}