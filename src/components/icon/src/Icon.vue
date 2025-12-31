<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-21 09:37:45
 * @Desc: 
-->
<template>
  <SvgIcon v-if="isSvgIcon"
   :name="getSvgIcon" 
   :class="[$attrs.class, 'anticon']"
   :title="title"
   :style="style"
   :size="size"
   :spin="spin" />

   <IconifyIcon v-else v-bind="bindProps"
    :class="[spin && 'svg-iconify-spin','transition-all-300']"
    :icon="getIconRef"/>
</template>

<script lang="ts" setup>
import {  isNumber, isString } from 'lodash-es';
import type {IconProps} from './types'
import {Icon as IconifyIcon} from '@iconify/vue'

defineOptions({name:'Icon'})

const SVG_END_WITH_FLAG = '|svg';  //以svg结尾

const props = withDefaults(defineProps<IconProps>(),{
  // size: '1em'
})
// const bindProps = computed(()=>{
//   const { size="1em", style={},...rest } = props
//   let _style = {}
//   const fontSize = isNumber(size)?`${size}px`:size
//   if(isString(style)){
//     _style = `'font-size':${fontSize};${style}`
//   }else{
//     _style = Object.assign({fontSize},style)
//   }
//   // console.log("icon props", {...rest,sytle:_style})
//   return {
//     ...rest,
//     style:_style,
//   }
// })

const bindProps = computed(()=>{
  // const { size="1em", style={},...rest } = props
  const { size, style={},spin,...rest } = props
  let _style = style
  let fontSize = ""
  if(size)
    fontSize = isNumber(size)?`${size}px`:size
  
  if(fontSize)
    _style = Object.assign({fontSize},style)
  
  return {
    ...rest,
    style:_style,
  }
})

const isSvgIcon = computed(()=> {
  if(!props.icon){
    return true
  }else{
    return isString(props.icon) && props.icon?.endsWith(SVG_END_WITH_FLAG)
  }
});

const getSvgIcon = computed(()=> props.icon?(props.icon as string).replace(SVG_END_WITH_FLAG, ''):'no-data');

// const getIconRef = computed(()=> `${props.prefix?props.prefix+':':''}${props.name}`);
const getIconRef = computed(()=> `${props.prefix?props.prefix:''}${props.icon}`);

// const getWrapStyle = computed((): CSSProperties=> {
//     const {size, color}  = props;
//     let fs = size;
//     if(isString(size)){
//       fs = parseInt(size, 10);
//     }

//     return {
//       fontSize: `${fs}px`,
//       color: color,
//       display: 'inline-flex',
//     }
//   });

</script>
<style lang="scss">
  .svg-iconify-spin, .svg-icon-spin{
    animation: loadingCircle 1s infinite linear;

    @keyframes loadingCircle {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

</style>