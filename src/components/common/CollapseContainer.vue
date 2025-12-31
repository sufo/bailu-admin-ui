<template>
<div :style="{'--left-width':leftW, '--header-height':`${headerHeight}px`,'--gap':gap}"
   :class="[prefixCls,$attrs.class, 'bg-white', 'dark:bg-[#101014]', isExpand ? 'is-expand' : 'is-collapse']">
  <div :class="`${prefixCls}__left dark:bg-dark`">
    <slot name="left" :toggle="toggle" :isExpand="isExpand"></slot>
  </div>
  <slot name="right" :toggle="toggle" :isExpand="isExpand">
  <div :class="`${prefixCls}__right dark:bg-dark`">
    <slot name="header" toggle="toggle">
      <div class="right-header">
        <slot name="collapse-icon" :toggle="toggle">
          <icon size="20" icon="carbon:chevron-left" :rotate="rotate" @click="toggle" class="ml-10px"/>
        </slot>
        <div class="h-title">{{ rightTitle }}</div>
      </div>
    </slot>
    <div class="file-list flex flex-col">
      <slot name="default" :toggle="toggle" :isExpand="isExpand"></slot>
    </div>
  </div>
  </slot>
</div>
</template>
<script setup lang="ts">
import { useDesign } from '@/hooks';
import { VNode } from 'vue';

interface Props {
  leftWidth?: string|number;
  gap?: number;
  rightTitle?: string;
  headerHeight?: number;
  collapseIcon?: string|VNode
}

const props = withDefaults(defineProps<Props>(),{
  leftWidth: '16.6%',
  gap: 0,
  rightTitle:'',
  headerHeight: 40
})

defineOptions({name: 'CollapseContainer'})

const { prefixCls } = useDesign("collapse")

//是否展开
const isExpand = ref(true)
const leftW = ref(props.leftWidth)
const rotate = ref(0)

function toggle(){
  isExpand.value = !isExpand.value
  leftW.value = isExpand.value?props.leftWidth:'0px'
  rotate.value = rotate.value==90?0:90
  // console.log("rotate.value",rotate.value)
}

defineExpose({
  toggle
})
</script>
<style lang="scss">
$prefix: '#{$namespace}-collapse';
.#{$prefix}{
  position: relative;
  display: grid;
  overflow: hidden;
  grid-template-rows: 1fr;
  grid-template-columns: var(--left-width) calc(100% - var(--left-width));
  gap:var(--gap);
  transition: grid-template-columns .3s ease;
  &.is-expand{
    .#{$prefix}__left{
      border-right: 1px solid var(--border);
    }
  }

  &__right{z-index:1;
    .right-header{display:flex;overflow:hidden;align-items:center;
      height: var(--header-height);
      .h-title{flex:1;width: 0;text-overflow:ellipsis;overflow:hidden;text-align:center;}
    }
    .file-list{
      height:calc(100% - var(--header-height));
    }
  }

  @media only screen and (max-width: 768px) {
    grid-template-columns: 0 100%;
		&__left {
			overflow: hidden;
			z-index: 9;
		}

		&.is-expand {
			&__left {
				width: 100%;
			}
		}
	}
}
</style>