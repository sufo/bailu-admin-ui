<template>
  <svg :class="[cls, $attrs.class, spin && 'svg-icon-spin']" :style="getStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script lang="ts" setup>
/**
 * 需要安装vite-plugin-svg-icons
 */
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { useContext } from '@/store/useContext'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: '1em',
  },
  spin: {
    type: Boolean,
    default: false,
  },
})
const context = useContext()

const cls = context.scopeCls('svg-icon')
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const getStyle = computed((): CSSProperties => {
  const { size } = props
  let s = `${size}`
  if(/^[\d]+$/.test(s)) //整数
    s = `${s.replace('px', '')}px`
  return {
    width: s,
    height: s,
  }
})
</script>
<style lang="scss" scoped>
// @prefix-cls: ~'@{namespace}-svg-icon';
// .@{prefix-cls} {
$prefix-cls: '#{$namespace}-svg-icon';
.#{$prefix-cls} {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;
}

.svg-icon-spin {
  animation: loadingCircle 1s infinite linear;
}
</style>
