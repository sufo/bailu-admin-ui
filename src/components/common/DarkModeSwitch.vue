<template>
  <n-switch :class="`cursor-pointer ${prefixCls}`" v-model:value="darkMode"
    @update-value="onSwitch" :rail-style="railStyle" size="large">
    <template #checked>
      <SvgIcon name="sun" size="14"/>
    </template>
    <template #unchecked>
      <SvgIcon name="moon" size="14"/>
    </template>
  </n-switch>
</template> 
<script lang="ts" setup>
import type {CSSProperties} from 'vue'
import {useDesign} from '@/hooks'
//父组件定义的class不会传递到子组件
// defineOptions({name:'DarkModeSwitch',inheritAttrs:false})

defineOptions({name: 'DarkModeSwitch'})

const {prefixCls} = useDesign("dark-switch")

interface Props {
 dark?:boolean
}

const props = withDefaults(defineProps<Props>(),{
  dark:false 
})

//defineProps()不能引用本地声明的变量
// const props = defineProps({
//   dark:{
//     type: Boolean,
//     default: ()=>appStore.isDark,
//   }
// })

interface Emits{
  (e: 'update:dark', darkMode:boolean):void
}
const emit = defineEmits<Emits>();

//computed写法，但是值的改变需要父子组件形成闭环处理props.dark
// const darkMode = computed({
//   get(){return props.dark;},
//   set(newVal:boolean){
//     console.log("newVal", newVal)
//     emit('update:dark', newVal);
//   }
// })
const darkMode = ref(props.dark)

function onSwitch(){
  emit('update:dark', darkMode.value);
}


const railStyle = ({focused,checked}: {
        focused: boolean
        checked: boolean
  })=>{
    const style: CSSProperties = {
      display:'flex',
      alignItems: 'center',
      boxShadow: 'none'
    }
    style.background='#151515'
    if(checked){
      style.border='1px solid #ffffff'
    }else{
      style.border='1px solid #151515'
    }
    return style   
}

</script>
<style lang="scss">
// @prifix-cls: ~'@{namespace}-dark-switch';
$prifix-cls: '#{$namespace}-dark-switch';
// .@{prifix-cls}{
.#{$prifix-cls}{
  .n-switch__rail .n-switch__button{
    top:unset;
    // background-color: transparent;
    // box-shadow: none;
    --n-button-width: 18px;
    --n-button-height: 18px;
    --n-offset: 6px;
    .n-switch__unchecked{padding-left: calc(1.1 * var(--n-rail-height) - var(--n-offset));}
    .n-switch__checked{padding-right: calc(1.1 * var(--n-rail-height) - var(--n-offset));}
  }
  .n-switch__button-placeholder {width: calc(1.35 * var(--n-rail-height));}
  .n-switch__rail:active .n-switch__button {
    max-width: var(--n-button-width) !important;
  }
}

</style>