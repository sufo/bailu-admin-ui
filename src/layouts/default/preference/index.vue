<template>
  <n-drawer v-bind="$attrs" v-model:show="app.settingDrawerVisible" :width="360" display-directive="show" @mask-click="app.closeSettingDrawer">
    <n-drawer-content :title="$t('preference.drawerTitle')" closable>
      <theme-mode v-model="preference.theme.mode" />
      <layout-mode />
      <theme-color-picker />
      <page-func />
      <page-view />
      <d-transition />  
      <theme-action />
    </n-drawer-content>
  </n-drawer>
  <drawer-button v-if="preference.app.showSettingButton" 
    v-show="showBtn"/>
</template>
<script setup lang="ts">
import DrawerButton from './components/drawer-button.vue'
import ThemeMode from './components/theme-mode.vue'
import LayoutMode from './components/layout-mode/index.vue'
import ThemeColorPicker from './components/theme-color-picker/index.vue'
import PageFunc from './components/page-fun.vue'
import PageView from './components/page-view.vue'
import DTransition from './components/transition.vue'
import ThemeAction from './components/theme-action.vue'
import {usePreferenceStore,useAppStore} from '@/store/modules'

defineOptions({name:'SettingDrawer'})
const preference = usePreferenceStore()
const app = useAppStore()
const mode = toRef(preference.theme,'mode')

const showBtn = computed(()=>!preference.header.visible||app.fullContent || app.settingDrawerVisible)
</script>