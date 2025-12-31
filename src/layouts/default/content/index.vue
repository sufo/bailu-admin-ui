<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-21 09:01:27
 * @Desc: 
-->

<template>
  <main v-watermark="watermark"
    class="flex flex-col flex-grow transition-150 flex-1 h-0 overflow-hidden">
    <router-view v-slot="{ Component, route }">
      <transition
        :name="preference.transitionMode"
        mode="out-in"
        :appear="true">
        <keep-alive v-if="preference.tab.keepAlive" :include="getCaches">
          <component
            :is="Component"
            v-if="app.reloadFlag"
            :key="route.fullPath"
            :class="classNames"/>
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" 
        :class="classNames"/>
      </transition>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import { useAppStore ,useTabStore, usePreferenceStore, useUserStore} from "@/store/modules";


defineOptions({ name: 'LayoutContent' });

interface Props {
  /** 显示padding */
  showPadding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPadding: true
});

const app = useAppStore();
const preference = usePreferenceStore();
const userStore = useUserStore()

const watermark = computed(()=>{
  return {text:[userStore.getUserInfo?.username],open:preference.app.showWatermark}
})
const classNames = computed(()=>{
  return [
    'flex-grow bg-#f6f9f8 dark:bg-#101014 transition duration-150 ease-in-out',
    {'p-16px': props.showPadding }
  ]
})

const tabStore = useTabStore()
const getCaches = computed((): string[] => {
  if (!unref(preference.tab.keepAlive)) {
    return [];
  }
  return tabStore.getCachePages;
});
</script>

<!-- <style scoped></style> -->
