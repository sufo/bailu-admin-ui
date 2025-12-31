<!--
 * 
 * @Desc: slot无法隐式传递props
-->
<template>
  <div :class="classNames" v-bind="$attrs" v-if="visible">
    <d-tabs
      :theme-mode="preference.theme.mode" 
      :mode="mode"
      v-model="active"
      class="size-full flex"
      @change="tabChange">
      <!--使用作用域插槽向子组件传值，子组件通过props接收-->
      <!-- <template #default="slotProps">
        <d-tab v-bind="slotProps" v-for="item in tab.getTabs" :key="item.fullPath"
          @close="onTabClose" :name="item.fullPath"
          :closable="!(item && item.meta && item.meta.affix)"
          @contextmenu="handleContextMenu($event, item.fullPath, item.meta.affix)">
          <template #prefix v-if="item.meta.icon">
            <icon 
              :name="item.meta.icon"
              class="inline-block align-text-bottom text-16px"/>
          </template>
          {{ item.meta.i18nKey ? $t(item.meta.i18nKey) : (item.meta.title || "") }}</d-tab>
      </template> -->
      <!--不使用作用域插槽，采用provide/inject-->
      <d-tab v-for="item in tab.getTabs" :key="item.fullPath"
          @close="onTabClose" :name="item.fullPath" class="flex-shrink-0"
          :closable="!(item && item.meta && item.meta.affix)"
          @contextmenu="handleContextMenu($event, item.fullPath, item.meta.affix)">
          <template #prefix v-if="item.meta.icon">
            <icon 
              :icon="item.meta.icon"
              class="inline-block align-text-bottom text-16px"/>
          </template>
          {{ item.meta.i18nKey ? $t(item.meta.i18nKey) : (item.meta.title || "") }}</d-tab>
      <template #rightExtra>
        <div :class="`tabs-extra-content ${darkWrapCls}`">
          <ReloadButton v-if="showRedo" />
          <FullButton v-if="showFull" />
        </div>
      </template>
    </d-tabs>
  </div>
  <context-menu 
    :visible="dropdown.visible"
    :current-path="dropdown.currentPath"
    :affix="dropdown.affix"
    :x="dropdown.x"
    :y="dropdown.y"
    @update:visible="handleDropdownVisible"/>
  <div v-if="visible"
    v-show="showPlacement"
    :class="[`${prefixCls}-placement`,'flex-shrink-0 overflow-hidden']"
  ></div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { DTabs,DTab } from '@/components/custom/tabs'
import { useTabStore, usePreferenceStore, useAppStore} from '@/store/modules';
// import { ReloadButton, TabDetail } from './components';
import { useDesign, useTabSetting, useDarkStyle} from '@/hooks';
import {useTabsDrag,initAffixTabs} from './useTabs'
import {FullButton, ReloadButton, ContextMenu} from './components'
import {useBasicLayout} from "../layout"

defineOptions({name: 'LayoutTabs', inheritAttrs:false});
const preference = usePreferenceStore()
const app = useAppStore()
const showPlacement = computed(()=>{
  return preference.header.visible && preference.header.fixed &&preference.tab.visible//&& !app.fullContent
})

const mode = computed(()=>{
  return preference.getTabSetting.mode
})

const route = useRoute();
//不起作用
const active = ref(route.fullPath)
//页面可以不用v-model="active",没啥意义
// const active = computed({
//   get: ()=> route.fullPath,
//   set: (val:string)=> {}
// })

const router = useRouter();
const tab = useTabStore();
const {prefixCls} = useDesign('layout-tabs')
const { useLayoutCls } = useBasicLayout()
const { darkWrapCls } = useDarkStyle()
const classNames = computed(()=>[...useLayoutCls(prefixCls, preference.header.fixed&&preference.header.visible, preference.isDark),
   unref(darkWrapCls), {'top-0!':app.fullContent},'pl-16 flex-y-center w-full',
  ])


// const {show}  = useTabSetting();

const visible = computed(()=>preference.tab.visible)

// const hide = computed(()=>app.fullContent)
const {showRedo, showFull} = useTabSetting()

//init affix tabs
initAffixTabs();
// useTabsDrag(affixTextList);
// useTabsDrag("tab-affix")
//draggable
if(preference.tab.canDrag)
  useTabsDrag('tab-dragable')


const onTabClose = (key:string)=>{
  tab.closeTabByKey(key, router)
}

const tabChange = (key:string)=>{
  tab.handleTabClick(key)
}


interface DropdownConfig {
  visible: boolean;
  affix: boolean;
  x: number;
  y: number;
  currentPath: string;
}

const dropdown: DropdownConfig = reactive({
  visible: false,
  affix: false,
  x: 0,
  y: 0,
  currentPath: ''
});

function setDropdown(config: Partial<DropdownConfig>) {
  Object.assign(dropdown, config);
}

let isClickContextMenu = false;

function handleDropdownVisible(visible: boolean) {
  if (!isClickContextMenu) {
    setDropdown({ visible });
  }
}


/** 点击右键菜单 */
async function handleContextMenu(e: MouseEvent, currentPath: string, affix?: boolean) {
  e.preventDefault();

  const { clientX, clientY } = e;

  isClickContextMenu = true;

  const DURATION = dropdown.visible ? 150 : 0;

  setDropdown({ visible: false });

  setTimeout(() => {
    setDropdown({
      visible: true,
      x: clientX,
      y: clientY,
      currentPath,
      affix
    });
    isClickContextMenu = false;
  }, DURATION);
}



watch(
  () => route.fullPath,
  () => {
    tab.addTab(route,true);
    active.value = route.fullPath;
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss">
// @prefixCls: ~'@{namespace}-layout-tabs';
// .@{prefixCls} {
$prefixCls: '#{$namespace}-layout-tabs';
.#{$prefixCls} {
    height: $tab-height;
    z-index: var(--tabs-z-index);
    box-shadow: 140px 1px 2px rgb(0 21 41 / 8%);
  &--fixed{
    position: absolute;
    top: $header-height;
    left: 0;
    width: 100%;
  }  
  &-placement{
    height: $tab-height;
  }

  .tabs-button-wrap{
    >div{align-items: center;gap:12px;}
  }
  .tabs-chrome-wrap{
    >div{align-items: flex-end;}
  }

  .tabs-extra-content{
    display: flex;
    align-items: center;
    height: 100%;
    z-index: 10;
  }
}
</style>
