<!---
  可拖拽div
-->
<template>
  <div :class="className" ref="dragRef"></div>
</template>
<script lang="ts" setup>
import { useDragX} from '@/hooks';
import {usePreferenceStore,useAppStore} from '@/store/modules'
import {useDebounceFn} from '@vueuse/core'
defineOptions({name: 'DragBar'})

interface Props {
  mobile: boolean;
  //拖动最小宽度
  minWidth: number;
  //拖动最大
  maxWidth: number;
  //左侧定位距离
  // left: number
  //是否可以拖动
  canDrag: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false,
  minWidth: 0,
  maxWidth: 0,  //0则会取屏幕宽度
  // left: 0,
  canDrag: false
})

const theme = usePreferenceStore()
const app = useAppStore()
const className = computed(()=>{
  return [
    'darg-bar',
    {
      'darg-bar--hide': !props.canDrag || props.mobile,
    }]
})

const dragX = useDragX(props.minWidth, props.maxWidth, (width)=>{
  //如果拖动到最小宽度，那相当于sider收缩了
  if(width===theme.menu.collapsedWidth){
    app.setSiderCollapse(true)
  }else{
    //否则设置为当前拖动的宽度
    theme.setMenuSetting({width})
    //判断sider如果是收缩状态，那么要将sider变为展开（因为宽度已经大于收缩时候的宽度）
    if(app.siderCollapse)
      app.setSiderCollapse(false)
  }
})

const dragRef = ref<HTMLDivElement>()

function mouseDown(){
  const dragEle = dragRef.value
  if(!dragEle) return false
  dragEle.addEventListener('mousedown', 
  (e: any) => {dragX(e)},{capture:true})
}

onMounted(()=>{
  nextTick(() => {
      const exec = useDebounceFn(mouseDown, 80);
      exec();
    });
})

</script>
<style lang="scss" scoped>
  .darg-bar {
    position: absolute;
    top: 0;
    right: -2px;
    z-index: $side-drag-z-index;
    width: 2px;
    height: 100%;
    cursor: col-resize;
    border-top: none;
    border-bottom: none;

    &--hide {
      display: none;
    }

    &:hover {
      background-color: var(--primary-color);
      box-shadow: 0 0 4px 0 rgb(28 36 56 / 15%);
    }
  }
</style>
