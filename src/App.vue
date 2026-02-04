<template>
  <n-config-provider
    :theme="theme.naiveTheme"
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="naiveLocale"
    :date-locale="dateLocale"
    class="h-full">
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import {useLocaleStore, usePreferenceStore }from '@/store/modules'
import { subscribeStore } from './store/subscribe';
import { zhCN, dateZhCN, enUS, dateEnUS} from 'naive-ui'
import {useGlobalEvents} from '@/hooks'
import { useCheckUpdateNotify } from './plugins/check-update';
import {addThemeColorCssVars} from '@/store/modules/preference'
import { emitter } from '@/utils/emitter'
import { EventEnum } from '@/constants/enum'
import { useUserAction } from '@/hooks/business/useUserAction'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const localeInfo = useLocaleStore()
const theme = usePreferenceStore()
//异步使用会报错
// const naiveLocale = computed( async () => {
//   return localeInfo.getLocale === 'zh-CN'
//     ?(await import('naive-ui')).zhCN
//     :(await import('naive-ui')).enUS
// })
// const dateLocale = computed(async () => {
//   return localeInfo.getLocale === 'zh-CN'
//     ? (await import('naive-ui')).dateZhCN
//     : (await import('naive-ui')).dateEnUS
// })

const naiveLocale = computed(() => {
  return localeInfo.getLocale === 'zh-CN'
    ?zhCN:enUS
})

const dateLocale = computed(() => {
  return localeInfo.getLocale === 'zh-CN'
    ? dateZhCN: dateEnUS
})


//添加css变量
addThemeColorCssVars();


// ...
const { logout } = useUserAction();

function bindEvents() {
  emitter.on(EventEnum.AUTH_ERROR, async (force) => {
    // const userStore = useUserStore();
    await logout(force as boolean);
  });
}
bindEvents();
//
subscribeStore()
useGlobalEvents()

//更新检查
useCheckUpdateNotify()

// const _locale = reactive({
//   naiveLocale: async () =>
//     localeInfo.getLocalType === 'zh_CN'
//       ? await import('naive-ui/lib/locales/common/zhCN')
//       : await import('naive-ui/lib/locales/common/enUS'),
//   dateLocale: async () =>
//     localeInfo.getLocalType === 'zh_CN'
//       ? await import('naive-ui/es/locales/date/zhCN')
//       : await import('naive-ui/es/locales/date/enUS'),
// })

// defineExpose({
//   ...toRefs(_locale),
// })

</script>

<style lang="scss">
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
// #app {
//   .n-input{color:@input-text-color;
//     .n-input__prefix,.n-input__suffix{color:@input-icon-color;}
//     .n-input__input-el,.n-input__textarea-el{color:@input-text-color;}
//   }
// }
// .dark{
//   #app {
//     .n-input{color:@input-text-color;
//       .n-input__prefix,.n-input__suffix{color:@input-icon-color;}
//       .n-input__input-el,.n-input__textarea-el{color:@input-text-color;}
//     }
//   }
// }
</style>
