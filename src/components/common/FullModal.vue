<!--modal增加全屏切换按钮-->
<template>
<n-modal
v-bind="bindValues">
  <template #header-extra v-if="preset=='card'&&!isMobile">
    <slot name="header-extra">
      <icon v-if="!full" icon="octicon:screen-full-24" @click.stop="full=true" @mousedown.stop @touchstart.stop/>
      <icon v-else icon="bi:fullscreen-exit" @click.stop="full=false" @mousedown.stop @touchstart.stop/>
    </slot>
  </template>
  <!-- <div v-for="(_,k) in $slots" :key="k">{{k}}</div> -->
  <template v-for="(_,k) in slots" #[k]="slotProps" :key="k">
    <slot :name="k" v-bind="slotProps||{}"/>
  </template>
</n-modal>
</template>
<script setup lang="ts">
import { useContext } from '@/store/useContext';
import { modalProps } from 'naive-ui/lib/modal/src/Modal';

defineOptions({name: 'FullModal', inheritAttrs:false});

//可以考虑设置成属性从外部传入
const {isMobile} = storeToRefs(useContext())

const full = ref(false);

const props = defineProps({
  ...modalProps,
  displayDirective: {
    type: String as PropType<"if" | "show">, // camelCase here maps to camelCase prop, but used in v-bind="props"
    default: "if"
  },
  draggable: {
    type: Boolean,
    default: true
  }
});
// const {style,...bindProps} = props

const attrs = useAttrs()

const {headerExtra,...slots} = useSlots();

const modalStyle = computed(()=>{
  return isMobile.value?{
    ...(attrs.style as any || {}),
    width: '100%',
    maxHeight: 'unset',
    minWidth: 'unset',
    minHeight: 'unset'
  }:(
    full.value?{
      ...(attrs.style as any || {}),
      width: '100%',
      height:'100vh',
      maxHeight: 'unset',
      left: '0',
      top: '0',
      // overflow: 'hidden'
    }:{
      width: '60%',
      height:'auto',
      ...(attrs.style as any || {})
    }
  )
})

const bindValues = computed(() => {
  return {
    ...attrs,
    ...props,
    class: attrs.class,
    style: modalStyle.value
  }
})

</script>