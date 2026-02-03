<template>
  <canvas ref="domRef" width="152" height="40" class="cursor-pointer" @click="getCaptcha"></canvas>
</template>

<script lang="ts" setup>
import { useCaptcha } from '@/hooks';

defineOptions({name:'captcha'})

interface Props{
  code: string
}

const props = withDefaults(defineProps<Props>(), {code:''})

interface Emits{
  (e: 'update:code', code:string ) :void
}

const emit = defineEmits<Emits>()

const {captcha, getCaptcha, setCaptcha} = useCaptcha()

//
watch(()=>props.code,newVal=>{setCaptcha(newVal)})
watch(captcha,newVal=>{emit('update:code', newVal)})

</script>