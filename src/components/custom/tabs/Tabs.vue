<template>
  <div :class=classNames>
    <slot name="leftExtra"></slot>
    <div ref="bsWrapperRef" :class="`scroll-wrap h-full flex-1-hidden px-16 ${tabsWrap}`">
      <div ref="tabRef" class="inline-flex h-full pr-18px">
        <slot v-bind="tabProps"></slot>
      </div>
    </div>
    <!--无法传递class-->
    <!-- <slot name="rightExtra" :class="`'right-extra' ${extraBgCls}`"></slot> -->
    <slot name="rightExtra"></slot>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { CSS_PREFIX } from '@/constants/consts';
import BScroll from '@better-scroll/core'
import { flattenChildren } from '@/utils/props'
import {DTab} from '.'
import {usePreferenceStore} from '@/store/modules'
import { useAttrs } from 'vue'
import {tabsProps} from './types'
import type {TabProps} from './types'
import { useContext } from '@/store/useContext';

defineOptions({name: 'Tabs',inheritAttrs: false})


function checkDefaultSlot(children: any): typeof DTab[]{
  // const temp = Array.isArray(children) ? children : [children];
  const temp = flattenChildren(children)
  const isDtab = temp.every(tab=>tab.type == DTab)
  if(!isDtab){
    throw new Error('Tabs 子标签必须是Tab')
  }
  return temp 
};

const props = defineProps(tabsProps)
const attrs = useAttrs()
/**插槽 */
type SlotFn = (props?: Record<string, unknown>) => any;
type Slots = {
  default?: SlotFn;
  leftExtra?: SlotFn;
  rightExtra?: SlotFn;
};
const slots = defineSlots<Slots>();

/**事件 */
interface Emits {
  (e: 'update:modelValue', key:string) : void,
  (e: 'tabClick', key:string,event:Event) : void,
  (e: 'change', key:string,event:Event) : void
}
const emit = defineEmits<Emits>()

let bscroll: BScroll
const pre = props.prefixCls || `${CSS_PREFIX}-tabs`

const classNames: ComputedRef<string> = computed(() => {
  return [
    pre,
    `${pre}-${props.size}`,
    attrs.class
  ].join(' ')
})

const theme = usePreferenceStore()
// ❌ 这将不起作用，因为它破坏了响应性
// const {isMobile} = useContext()

const {isMobile} = storeToRefs(useContext())
const tabsWrap = computed(()=>`tabs-${theme.tab.mode}-wrap`)

// const bsWrapper = ref<HTMLElement>();
const bsWrapperRef = ref();
// 获取当前激活的tab的clientX
const tabRef = ref<HTMLElement>();

const onClick = async (fullPath: string, e: Event) => {
  // console.log("tabs click")
  if (props.modelValue === fullPath) {
    emit('tabClick', fullPath,e)
  } else {
    emit('update:modelValue', fullPath)
    emit('change', fullPath,e)
  }
}

const tabProps = computed(()=>{
  const {modelValue:active, themeMode, mode, activeColor} = props
  return {active, onClick,themeMode,mode, activeColor} as TabProps
})
//强耦合组件slot， inside slot插槽无法隐式传值，这里使用provide/inject
provide("tabProps", tabProps)

// const tabStore = useTabStore();
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapperRef);

const handleScroll = (clientX: number) => {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;
  // console.log("bsWrapperWidth",bsWrapperWidth.value)
  if (bscroll) {
    const { maxScrollX, x: leftX } = bscroll;
    // console.log("maxScrollX",maxScrollX)
    // console.log("leftX",leftX)
    // console.log("deltaX",deltaX)
    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);
    // console.log("update",update)
    bscroll.scrollBy(update, 0, 300);
  }
}

const tabs = computed(() => checkDefaultSlot(slots.default?.()));
const tabsSizeRef = computed(()=>tabs.value.length)

async function scrollToActiveTab() {
  await nextTick();
  setTimeout(()=>{
    if (tabRef.value && tabRef.value.children.length) {
      const eIndex = tabs.value.findIndex((e: any) => e?.props?.name === props.modelValue)
      if(eIndex !== -1){
        const ele=tabRef.value.children[eIndex]
        if (ele) {
          const activeTabElement = ele;
          const { x, width } = activeTabElement.getBoundingClientRect();
          const clientX = x + width / 2;
          handleScroll(clientX);
        }
      }
    }
  },150)
  
}

//长度变化需要重新refreah尺寸
watch(
  tabsSizeRef,
  ()=>{if(bscroll)
    setTimeout(() => {
      bscroll.refresh()
    }, 150); 
  }
)

watch(
  () => props.modelValue,
  () => {
    // console.log("modelValue", props.modelValue)
    scrollToActiveTab();},
  {
    immediate: true,
    flush: 'post'
  }
);

onMounted(() => {
  if(!bscroll)
    bscroll = new BScroll(bsWrapperRef.value, {
      scrollX: true,
      click:true,
      // click: !isMobile, //是否派发点击事件
      scrollY: false,
      // eventPassthrough:"horizontal",
      // observeDOM:true, //无效
      disableMouse:isMobile.value
    })
});

</script>