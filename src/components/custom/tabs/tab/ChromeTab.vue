<template>
  <!--gap-8px px-24px-->
  <div @click="e=>emit('click',name,e)"
    :class="[
      'relative inline-flex justify-center items-center gap-8px -mr-18px px-24px py-6px cursor-pointer whitespace-nowrap',
      style['chrome-tab'],
      { [style['chrome-tab_dark']]: themeMode=='dark' },
      { [style['chrome-tab_active']]: active===name },
      { [style['chrome-tab_active_dark']]: active===name && themeMode=='dark' }]">
    <div :class="['absolute left-0 top-0 -z-1 w-full h-full pointer-events-none', style['chrome-tab__bg']]">
      <ChromeTabBg />
    </div>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
    <div :class="['absolute right-7px w-1px h-16px bg-#1f2225', style['chrome-tab-divider']]"></div>
  </div>
</template>

<script setup lang="ts">
import ChromeTabBg from './ChromeTabBg.vue';
import style from './index.module.css';
import type { Slots } from '../types';
import { tabProps } from '../types';

defineOptions({
  name: 'ChromeTab'
});

const emit = defineEmits<{(e: 'click', name?:string, 
  ev?:Event) : void}>()
//vue3 尚不支持从外部引入类型定义
// defineProps<TabProps>();
defineProps(tabProps);

defineSlots<Slots>();

// export default defineComponent({
//   name:'ChromeTab',
//   props: tabProps,
//   components:{ChromeTabBg},
//   setup(props){
//     return {
//       style,
//       ...props
//     }
//   }

// })

</script>
