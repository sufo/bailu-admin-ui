<template>
  <div :class="prefixCls" class="relative flex-center wh-full">
    <img :src="bgUrl" class="fixed wh-full z--1 left-0 bottom-0 lt-lg:hidden bg-cover"/>
    <div class="absolute right-[16px] top-[24px] z-3 i-flex-y-center">
      <DarkModeSwitch class="text-20px" v-if="showDarkSwitch"
        @update:dark="preference.setIsDark" :dark="preference.isDark"/>
      <LocalePicker :show-text="false" class="ml-[8px]" v-if="showLocale"></LocalePicker>
    </div>
    
    <div class="grid  items-center justify-center wh-full pl-32 pr-32 lg:grid-cols-2 lg:gap-18 md:grid-cols-1 md:gap-9" >
      <div class="lt-lg:hidden flex-y-center"></div>
      <div class="flex-center">
        <n-card :bordered="false" size="large" class="w-364px sm:w-424px rounded-20px shadow-sm">
            <header class="flex-y-center justify-center">
              <AppLogo class="w-64px h-64px" v-if="showLogo"/>
              <n-gradient-text type="primary" :size="28">{{ title }}</n-gradient-text>
            </header>
            <main class="pt-24px">
              <h3 class="text-18px mb-[16px] text-primary font-medium">{{ $t(activeModule.label) }}</h3>
              <transition name="fade-slide" mode="out-in" appear>
                <component :is="activeModule.component" @update:active="moduleChange"/>
              </transition>
            </main>
          </n-card>
        </div>
    </div>

  </div>
</template>
<!--vite-plugin-pages 自动路由提供meta-->
<!-- <route lang="yaml">
meta:
  title: 'menus.hslogin'
</route> -->
<script lang="ts" setup>
import {usePreferenceStore} from '@/store/modules'
import { useDesign } from '@/hooks'
import { LoginModule as LoginModuleEnum } from '@/constants/enum'
import type { Component } from 'vue'
import { LoginForm,MobileForm,Register, ResetPwd} from './components'
import {useLocaleStore} from '@/store/modules'
import { computedAsync } from '@vueuse/core'

defineOptions({ name: 'login' })

const { prefixCls } = useDesign('login')
const preference = usePreferenceStore()
const title = import.meta.env.VITE_APP_TITLE

// console.log("theme", theme.isDark)

interface LoginModule {
  key: LoginModuleKey
  label: LoginModuleEnum
  component: Component
}

const modules: LoginModule[] = [
  { key: 'LOGIN', label: LoginModuleEnum['LOGIN'], component: LoginForm },
  { key: 'MOBILE', label: LoginModuleEnum['MOBILE'], component: MobileForm },
  { key: 'REGISTER', label: LoginModuleEnum['REGISTER'], component: Register },
  { key: 'RESET_PASSWORD', label: LoginModuleEnum['RESET_PASSWORD'], component: ResetPwd }
]

// const props = withDefaults(defineProps<Props>(), {
//   /***
//    * defineProps() in <script setup> cannot reference locally declared variables 
//    * because it will be hoisted outside of the setup() function. 
//    * If your component options require initialization in the module scope, 
//    * use a separate normal <script> to export the options instead.
//    */
//   module: modules[0].key
// }) 
const activeKey = ref(modules[0].key)

const localeStore = useLocaleStore()
const showLocale = ref(localeStore.isVisible)
const showLogo = ref(preference.getApp.showLogo)

const showDarkSwitch = computed(()=>{return preference.getApp.showThemeToggle})


const activeModule = computed(() => {
  const active: LoginModule = { ...modules[0] }
                                        //等号相当与return
  const findItem = modules.find(m => m.key === activeKey.value)
  if (findItem) Object.assign(active, findItem)
  return active
})

function moduleChange(module: LoginModuleKey){
  activeKey.value = module
}

// onMounted(()=>{
//   console.log("xx", activeModule.value)
// })

// const bgUrl = computed(()=>{
//   const path = preference.isDark?'../../assets/imgs/bg_dark.png':'../../assets/imgs/bg.png'
//   return new URL(path, import.meta.url).href
// })


const bgUrl = computedAsync(
  async onCancel =>{
  const name = preference.isDark?'bg_dark':'bg'
  let img = await import(`../../assets/imgs/${name}.png`);
  return img.default
},null)

</script>

<style>
  .dark .bailu-login{
    .vue-tel-input {
      --vti-bg-main: #1a1a1a;        /* 输入框背景 */
      --vti-text-color: #ffffff;     /* 文字颜色 */
      --vti-border-color: #333333;   /* 边框颜色 */
      --vti-dropdown-bg: #2d2d2d;    /* 下拉菜单背景 */
      --vti-dropdown-item-hover-bg: #3e3e3e; /* 悬浮背景 */
    }

    /* 适配边框聚焦颜色 */
    .vue-tel-input:focus-within {
      box-shadow: 0 0 0 1px #646cff;
      border-color: #646cff;
    }
  }
</style>
