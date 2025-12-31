<template>
  <div class="scroll-view wrapper" :class="{x: props.scrollX }" ref="wrapper">
    <div class="content" ref="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import BScroll from '@better-scroll/core'
//使其可以滚动滑动
import MouseWheel from '@better-scroll/mouse-wheel'
// import ObserveDOM from '@better-scroll/observe-dom'
// //@ts-expect-error
// import ObserveImage from '@better-scroll/observe-image'
// //@ts-expect-error
// import Pullup from '@better-scroll/pull-up'
// //@ts-expect-error
// import Pulldown from '@better-scroll/pull-down'
defineOptions({name:'ScrollView'});
const bscroll = ref<BScroll>()
const wrapper = ref()
BScroll.use(MouseWheel)
// BScroll.use(ObserveDOM)
// BScroll.use(ObserveImage)
// BScroll.use(Pullup)
// BScroll.use(Pulldown)
const emit = defineEmits(['click', 'beforeScroll', 'afterScroll', 'scroll'])
const props = defineProps({
  /**
   * 1 滚动的时候会派发scroll事件，会截流。
   * 2 滚动的时候实时派发scroll事件，不会截流。
   * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
   */
  probeType: {
    type: Number as PropType<1 | 2 | 3>,
    required: false,
    default: 1
  },

  /**
   * 是否开启横向滚动，默认纵向滚动。
   * 开启横向滚动需要将传入元素设置为横向例如：display:inline-block
   */
  scrollX: {
    type: Boolean,
    required: false,
    default: false
  },

  /**
   * 点击列表是否派发click事件
   */
  click: {
    type: Boolean,
    default: true
  },
  /**
   * 是否派发滚动事件
   */
  listenScroll: {
    type: Boolean,
    default: false
  },
  /**
   * 是否派发滚动到底部的事件，用于上拉加载
   */
  pullup: {
    type: Function,
    default: null
  },
  /**
   * 是否派发顶部下拉的事件，用于下拉刷新
   */
  pulldown: {
    type: Function,
    default: null
  },
  /**
   * 是否派发列表滚动开始的事件
   */
  beforeScroll: {
    type: Boolean,
    default: false
  },
  /**
   * 是否派发列表滚动开始的事件
   */
  afterScroll: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  bscroll.value = new BScroll(wrapper.value, {
    scrollX: props.scrollX,
    probeType: props.probeType,
    click: props.click,
    observeDOM: false,
    observeImage: false,
    mouseWheel: true,
    pullDownRefresh: false,
    pullUpLoad: false
  })
  /**
   * 如果开启了滚动前事件派发
   */
  if (props.beforeScroll) {
    bscroll.value.on('beforeScrollStart', () => {
      emit('beforeScroll')
    })
  }

  /**
   * 如果开启了滚动(滚动中)事件派发
   */
  if (props.listenScroll) {
    bscroll.value.on('scroll', (position: { x: number; y: number }) => {
      emit('scroll', position)
    })
  }

  /**
   * 如果开启了滚动结束事件派发
   */
  if (props.beforeScroll) {
    bscroll.value.on('scrollEnd', () => {
      emit('afterScroll')
    })
  }

  if (props.pullup !== null) {
    bscroll.value.on('pullingUp', () => {
      try {
        props.pullup().then(() => {
          bscroll.value?.finishPullUp()
        })
      } catch (e) {
        // 传入非 Promise 函数
        bscroll.value?.finishPullUp()
      }
    })
  }

  if (props.pulldown !== null) {
    bscroll.value.on('pullingDown', () => {
      try {
        props.pulldown().then(() => {
          bscroll.value?.finishPullDown()
        })
      } catch (e) {
        // 传入非 Promise 函数
        bscroll.value?.finishPullDown()
      }
    })
  }

  nextTick(()=>{
    bscroll.value?.refresh()
  })
})

//此时bscroll的值还是undefined
// defineExpose({bscroll:unref(bscroll)})

const getBscoll = ():BScroll|undefined=>{
  return unref(bscroll)
}
defineExpose({getBscoll})

</script>


<style scoped lang="scss">
.scroll-view{
  overflow: hidden;
  .content {
    display: block;
  }
  // 开启横向滚动
  &.x {
    white-space: nowrap;
    .content {
      display: inline-block;
    }
  }
}
</style>