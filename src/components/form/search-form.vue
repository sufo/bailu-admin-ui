<template>
  <n-card :bordered="false" size="small" class="rd-8px shadow-sm">
    <n-collapse v-if="isMobile">
      <n-collapse-item :title="$t('button.searchText')" name="use-search">
        <base-form v-bind="mobileProps"/>
      </n-collapse-item>
    </n-collapse>
    <base-form v-bind="bindProps" v-else/>
  </n-card>
</template>

<script lang="ts" setup>
import { useContext } from '@/store/useContext';
import { searchFormProps} from './types';

//给子元素继承
defineOptions({
  inheritAttrs:false
})

const {isMobile} = storeToRefs(useContext())
const props = defineProps(searchFormProps)

// const {class:_,style,...attrs}= useAttrs()
const attrs = useAttrs()

const bindProps = computed(()=>{
  return {
    ...attrs,
    ...props,
  }
})

//合并
const mobileProps = computed(()=>{
  return {
    ...bindProps.value,
    // resetButtonOptions:{show:false}, 
    labelWidth:props.labelWidthSm??props.labelWidth,
    grid:{...props.grid, cols:'1', yGap:20}
  }
})
</script>