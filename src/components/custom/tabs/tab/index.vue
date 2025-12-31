<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-11-03 14:03:25
 * @Desc: 
-->
<template>
  <Tab :class="[$attrs.class,props.closable?'tab-dragable':'tab-affix']" :style="[$attrs.style, cssVars]" v-bind="bindProps" @click="onTabClick">
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <slot></slot>
    <template #suffix>
      <slot name="suffix">
        <div :class="['relative inline-flex justify-center items-center w-16px h-16px text-14px rd-50%', style['icon-close']]"
            @click="onTabClose" v-if="props.closable">
          <SvgIcon name='close' />
        </div>
      </slot>
    </template>
  </Tab>
</template>
<script setup lang="ts">
import { SvgIcon } from "@/components/icon";
import { TabProps, Slots} from "@/components/custom/tabs/types";
import { firstToUpperCase } from '@/utils/util'
import {combineProps} from '@/utils/props'
import { transformColorWithOpacity, addColorAlpha } from '@/utils/color'
import { CssVarsProps, createCssVars } from './cssVar'
import { CSS_PREFIX } from "@/constants/consts";
import { usePreferenceStore } from "@/store/modules";
import style from './index.module.css'
import { cloneDeep } from "lodash-es";
// import {getCurrentInstance} from 'vue'
// import ButtonTab from './ButtonTab';
// import Tab from './tab/ChromeTab.vue';
// import BarTab from "./BarTab";
// const parent = computed(()=>getCurrentInstance()?.parent)

interface Emits {
  (e: 'close', key?:string, evt?:Event): void
  (e: 'click', key?:string, evt?:Event): void
}

const props = withDefaults(defineProps<TabProps>(),{
  mode: ()=>'chrome',
  closable: true,
  darkMode:false,
})

const emit = defineEmits<Emits>()

defineSlots<Slots>()

const injectProps = inject<ComputedRef<TabProps>>('tabProps')
//[Vue warn]: Invalid prop: type check failed for prop "onClick". Expected Function, got Array
const bindProps = computed(()=>{
  const combine = combineProps(cloneDeep(props),injectProps?.value)
  //这里去掉onClick（来源于injectProps），避免跟子组件里面的click事件冲突
  const {onClick, ...rest} = combine
  return unref(rest)
})

// console.log('tabprops----------------', props)

const preference = usePreferenceStore()

const tabMode = computed(()=>unref(bindProps).mode)

//// const Tab = defineAsyncComponent(() => import(`./${firstToUpperCase(props.mode||'chrome')}Tab.vue`))

// 即使mode不改变，这里也会执行，应该是bindProps造成的。 改用下面的watch实现
// const Tab = computed(()=>{
//   const tabModeName = unref(bindProps).mode||'chrome'
//   return defineAsyncComponent(() => import(`./${firstToUpperCase(tabModeName)}Tab.vue`))
// })

//watch处理Tab
let Tab = typeof defineAsyncComponent
watch(
  tabMode,
  (m1,m2)=>{
    if(m2 !== m1){
      const tabModeName = unref(tabMode)||'chrome'
      Tab = defineAsyncComponent(() => import(`./${firstToUpperCase(tabModeName)}Tab.vue`))
    }
  },
  {immediate: true}
)

const cssVars = computed(() => {
  //取默认值不生效
  // const { activeColor = ACTIVE_COLOR } = props;
  let { activeColor  } = props!;
  activeColor = activeColor|| preference.theme.themeColor
  const cssProps: CssVarsProps = {
    primaryColor: activeColor,
    primaryColor1: transformColorWithOpacity(activeColor, 0.1, '#ffffff'),
    primaryColor2: transformColorWithOpacity(activeColor, 0.3, '#000000'),
    primaryColorOpacity1: addColorAlpha(activeColor, 0.1),
    primaryColorOpacity2: addColorAlpha(activeColor, 0.15),
    primaryColorOpacity3: addColorAlpha(activeColor, 0.3)
  };

  return createCssVars(cssProps, CSS_PREFIX);
});

function onTabClose(e: Event){
  e.preventDefault()
  e.stopPropagation()
  emit('close', props.name,e)
}

function onTabClick(key:string, e: Event){
  e?.stopPropagation();
  // console.log("onTabClick")
  //父级组件默认处理方法
  injectProps?.value.onClick?.(props.name,e)
  //发送事件
  emit('click', props.name,e)
}


</script>
