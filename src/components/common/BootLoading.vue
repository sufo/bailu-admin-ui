<template>
  <div class="fixed-center flex-col">
    <img class="cursor-pointer w-64px h-64px" src="@/assets/logo.png"/>
    <div class="w-56px h-56px my-36px">
      <div class="relative h-full animate-spin">
        <div v-for="(item, index) in lodingClasses" :key="index"
          class="absolute w-16px h-16px bg-primary rounded-8px animate-pulse" :class="item"></div>
      </div>
    </div>
    <h2 class="text-28px font-500 text-#646464">{{title}}</h2>
  </div>
</template>

<script setup lang="ts">
  import {getThemeSettings} from '@/store/modules/preference/helper'
  import themeSettings from '@/settings/projectSetting';
  defineOptions({name:'BootLoading'})
  const lodingClasses = [
    'left-0 top-0',
    'left-0 bottom-0 animate-delay-500',
    'right-0 top-0 animate-delay-1000',
    'right-0 bottom-0 animate-delay-1500'
  ];
  const title = import.meta.env.VITE_APP_TITLE

  function addThemeColorCssVars () {
    const settings = getThemeSettings()
    const defaultColor = themeSettings.theme.themeColor;
    const themeColor =  settings.theme?.themeColor||defaultColor;
    const minWidth = settings?.layout.minWidth==0?'unset':settings?.layout.minWidth
    const cssVars = `--primary-color: ${themeColor};--min-body-width: ${minWidth}`;
    document.documentElement.style.cssText = cssVars;
  }

  addThemeColorCssVars();
</script>

<style scoped></style>