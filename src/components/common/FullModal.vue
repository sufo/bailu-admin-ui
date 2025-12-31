<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-09-03 14:08:33
 * @Desc: 
-->
<!--modal增加全屏切换按钮-->
<template>
<n-modal
:class="$attrs.class"
v-bind="props"
:style="modalStyle">
  <template #header-extra v-if="preset=='card'&&!isMobile">
    <slot name="header-extra">
      <icon v-if="!full" icon="octicon:screen-full-24" @click="full=true"/>
      <icon v-else icon="bi:fullscreen-exit" @click="full=false"/>
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

const props = defineProps(modalProps);
// const {style,...bindProps} = props

const attrs = useAttrs()

const {headerExtra,...slots} = useSlots();

const modalStyle = computed(()=>{
  return isMobile.value?{
    ...(attrs.style??{}),
    width: '100%',
    maxHeight: 'unset',
    minWidth: 'unset',
    minHeight: 'unset'
  }:(
    full.value?{
      ...(attrs.style??{}),
      width: '100%',
      height:'100vh',
      maxHeight: 'unset',
      // overflow: 'hidden'
    }:{
      width: '60%',
      height:'auto',
      ...(attrs.style??{})
    }
  )
})

</script>