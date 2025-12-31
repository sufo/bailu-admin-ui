<template>
<n-form v-bind="formBindProps" :class="cls" :model="formModel" ref="formElRef" @keypress.enter.prevent="handleEnterPress">
  <n-grid :x-gap="10" v-bind="bindProps.grid">
    <template v-for="item in formItems"><!--加这一层级处理hide，因为v-for和v-if不能同时使用-->>
      <n-form-item-gi v-if="visible(item,item?.hide)" :key="item.field" :path="item.field" v-bind="item" 
      :label="isFunction(item.label)?(item.label?.(formModel)):item.label">
        <template #label v-if="item.labelTip">
          <div class="label-wrap">
            <n-tooltip trigger="hover" :style="item.labelTipStyle" to="body">
              <template #trigger>
                <icon icon="ri:question-fill" color="var(--n-label-text-color)" class="text-gray-400 cursor-pointer pr-4px text-18"/>
              </template>
              {{ item.labelTip }}
            </n-tooltip>
            {{ item.label }}
            </div>
        </template>
        <!--插槽-->
        <template v-if="item.slot">
            <slot
              :name="item.slot"
              :model="formModel"
              :field="item.field"
              :value="formModel[item.field]"
            ></slot>
        </template>
        <template v-else-if="item.component=='NCheckbox'">
          <n-checkbox-group v-model:value="formModel[item.field]">
            <n-space item-style="display: flex;">
              <n-checkbox v-bind="item.comProps" v-for="c in item.comProps?.options" :label="c.label" :key="c.value" :value="c.value"/>
            </n-space>
          </n-checkbox-group>
        </template>
        <template v-else-if="item.component=='NRadio' || item.component=='NRadioGroup'">
          <n-radio-group v-model:value="formModel[item.field]">
          <n-space>
            <!-- <component :is="item.component" v-bind="item.comProps" v-for="opt in item.comProps?.options" :key="opt.value" :value="opt.value" :label="opt.label"/> -->
            <n-radio v-bind="$omit(item.comProps,['options'])" v-for="opt in item.comProps?.options" :key="opt.value" :value="opt.value" :label="opt.label"/>
          </n-space>
        </n-radio-group>
        </template>
        <template v-else-if="item.component=='NRadioButton'">
          <n-radio-group v-model:value="formModel[item.field]" class="radio-button-g">
            <n-radio-button v-bind="item.comProps" v-for="opt in item.comProps?.options" :key="opt.value" :value="opt.value" :label="opt.label"/>
          </n-radio-group>
        </template>
        <template v-else>
          <component :is="isFunction(item.component)?
            ((item.component as ComponentTypeFunc)?.(formModel)):item.component"
            :clearable="item.component=='NInput'||item.component=='NInputNumber'"
            v-bind="item.comProps||{}"
            v-model:value="formModel[item.field]"/>
        </template>
        <!-- <NInput name=""/> -->
        <!--组件后面的内容-->
        <template v-if="item.suffixSolt">
          <slot
            :name="item.suffixSolt"
            :model="formModel"
            :field="item.field"
            :value="formModel[item.field]"
          ></slot>
          </template>
      </n-form-item-gi>
    </template>
    <n-gi v-bind="actionProps">
      <n-space v-bind="bindProps.action.space">
      <slot name="negative" v-if="negativeProps.show">
        <n-button v-bind="negativeProps"  @click="onReset">
          <template #icon v-if="isVNode(negativeProps.icon)">
            {{ negativeProps.icon }}
          </template>
          <template #icon v-else-if="negativeProps.icon"><icon :icon="negativeProps.icon"/></template>
          {{negativeProps.label}}</n-button>
      </slot>
      <slot name="positive" v-if="positiveProps.show">
        <n-button type="primary" ghost v-bind="positiveProps" :loading="loading" @click="onSubmit">
          <template #icon v-if="isVNode(positiveProps.icon)">
            {{ positiveProps.icon }}
          </template>
          <template #icon v-else-if="positiveProps.icon"><icon :icon="positiveProps.icon"/></template>
          {{positiveProps.label}}</n-button>
      </slot>
    </n-space>
    </n-gi>
  </n-grid>
</n-form>
</template>

<script setup lang="ts">
import { FormInst } from 'naive-ui';
import { baseFormProps,ComponentTypeFunc,FormItemProps} from './types';
import {useFormEvent} from './useFormEvent';
import { provideFormCtx } from './useFormContext';
import {ref} from 'vue';
import { useDesign,useDarkStyle} from '@/hooks';
import { isFunction, isVNode, deepMerge} from '@/utils/util';
import { useI18n } from 'vue-i18n';
// import { useI18n } from 'vue-i18n';

defineOptions({name: "BaseForm"})

interface Emits{
  (e: 'filledModel', formModel:Ref<Recordable>):void;  //formModel创建完成调用
  (e: 'submit', formModel:Recordable, done: ()=>void):void;
  // (e: 'update:modelValue', modelValue:Recordable):void
  (e: 'btnClick', prop:string):void;
  (e: 'reset'):void;
}

const { prefixCls } = useDesign("base-form")
const {darkWrapCls} = useDarkStyle()
const cls = computed(()=>`${prefixCls} ${darkWrapCls.value}`)
const {t} = useI18n()
const emit = defineEmits<Emits>()
// const { t } = useI18n()
const formElRef = ref<FormInst | null>(null)
const formModel = ref<Recordable>({}) 
// const props = withDefaults(defineProps<BaseFormProps>(),{
//   showSubmitButton:true,
//   showResetButton:true,
//   labelWidth:()=>(120),
//   submitButtonOptions: ()=>({span:3}) ,
//   resetButtonOptions: ()=>({span:3})
// })

const props = defineProps(baseFormProps)

//定义slots类型
defineSlots<{
  negative() : void,
  positive() : void,
  [x:string]: (props:{model:Recordable,field:string,value:any}) => void
}>()

//默认值
const defaultProps = computed(()=>({
  grid: {itemResponse:true, responsive: 'screen', yGap:10, cols:'1 s:2 m:3 xl:4'},
  submitButtonOptions: {icon:'carbon:search',show:true, label:t('button.searchText')},
  resetButtonOptions: {icon:'carbon:renew', show:true, label:t('button.resetText')},
  action: {space:{align:'center',justify:'end'}}
}))

//合并
const bindProps = computed(()=>{
  return deepMerge(defaultProps.value, props)
})

// //处理formItems，移动端只显示一个条件
// const formItems = computed(()=>{
//   let items = bindProps.value.formItems
//   if(isMobile.value && items){
//     if(items.length>1){
//       //移动端只保留一个查询条件
//       items = [{...items[0],span:2}]
//     }
//   }
//   return items
// })

//grid默认值放在这里，而不是baseFormProps里面，为了解决传入值和默认值合并问题
//const grid = computed(()=>{
//   return unref(bindProps).grid
// })

//buttons
const positiveProps = computed(()=>{
  return unref(bindProps).submitButtonOptions;
})

const negativeProps = computed(()=>{
  return unref(bindProps).resetButtonOptions;
})

//得到n-form props
const formBindProps = computed(()=>{
  const {formItems, submitButtonOptions,resetButtonOptions,action,grid, ...rest} = unref(bindProps)
  return rest
})

const actionProps = computed(()=>{
  const {action:{space,...rest}} = unref(bindProps)
  return rest
})

const loading = ref(false)

const {onReset, handleEnterPress,createModel,onSubmit,setDefault} = useFormEvent(formElRef, unref(bindProps), formModel, emit, loading)

//当前field是否显示
// function visible(hide: boolean | ((option:Recordable)=>boolean) | undefined){
//   if(isFunction(hide)){
//     return !hide(formModel)
//   }else{
//     return !hide
//   }
// }
const visible = computed(()=>{
    return (item:FormItemProps,hide?: boolean | ((option:Recordable)=>boolean)) =>{
      if(isFunction(hide)){
        const isVisiable =  !hide(unref(formModel))
        setDefault(item)
        return isVisiable
      }else{
        return !hide
      }
    }
  }
)

watch(
  ()=> bindProps.value.formItems?.length,
  ()=>{
      createModel();
  }
)

watch(
  ()=>bindProps.value.formItems,
  (newVal,oldVal)=>{

    //监听form包含hide属性项的显示和隐藏
    //如果发生变化则重新初始化该值 （解决显式隐藏变化时，没有初始化值的问题，因为默认隐藏的项，在createModel时候是不会赋值的）
    if(newVal!==undefined&&newVal!==undefined)
      newVal.forEach((e:FormItemProps,i:number)=>{
        if(e.hide !== undefined && e.hide !== oldVal[i].hide){
          setDefault(e)
        }
      })
  },{
    deep:true
  }
)

//执行一次，初始化model（自动创建model），
createModel()

//放到provider中
provideFormCtx({
  formModel,
  onReset,createModel,onSubmit
})

defineExpose({
  onReset,createModel,onSubmit
})
</script>

<style lang="scss">
$rootCls: '#{$namespace}-base-form';
.#{$rootCls}{
  padding: 16px 10px;
  border-radius: 2px;
  :deep(.n-button){
    width: 100%; //重置按钮的宽度为100%
  }
  :deep(.n-input-number){
    width: 100%; //重置宽度为100%
  }
  .label-wrap{
    display: inline-flex;
    align-items: center;
  }
  .radio-button-g{
    .n-radio-button.n-radio-button--checked{
      background-color: var(--n-button-text-color-active);
      color: var(--n-button-color-active);
      border: none;
    } 
  }
  .n-form-item-label__text{
    line-height: 1;
  }
  //naive ui
  .n-date-picker{width:100%;}
}
</style>