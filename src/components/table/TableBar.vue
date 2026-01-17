<template>
<div :class="prefixCls" class="flex-y-center justify-between w-full h-[56px] px-[16px]">
  <slot name="title"><h2 class="text-unset truncate flex-1 font-bold color-#000" v-if="title">{{ title }}</h2></slot>
  <div class="flex-y-center">
    <div class="flex mr-[16px] actions gap-x-[12px] gap-y-[8px]" v-if="hasBtnSlot">
        <slot name="toolbar" />
    </div>
    <!-- <tool-tip v-if="canExpand" @click="toggleExpand" 
        :inverted="theme.darkMode" placement="top"
        :tooltip-content="isExpandAll?$t('button.collapseAll'):$t('button.expendAll')">
        <icon :name="isExpandAll? 'quill:collapse':'quill:expand'" spin/>
    </tool-tip>
    <n-divider v-if="canExpand" vertical/> -->
    <tool-tip @click="onRefresh" :inverted="preference.isDark" placement="top"
        :tooltip-content="$t('common.refresh')">
        <icon icon="mdi:refresh" :style="{fontSize:'20px'}"/>
    </tool-tip>
    <n-divider vertical/>
    <tool-tip v-if="!!onExport" :inverted="preference.isDark" placement="top"
        :tooltip-content="$t('button.toExport')">
        <icon icon="ant-design:download-outlined" :style="{fontSize:'20px'}" @click.stop="onExport" />
    </tool-tip>
    <n-divider vertical v-if="!!onExport"/>
    <tool-tip :inverted="preference.isDark" placement="top" :tooltip-content="$t('layout.table.density')">
      <n-popselect :options="densityOptions($t)" trigger="click" :value="tableSize" @update:value="onSize">
          <icon icon="uil:compress-lines" :style="{fontSize:'20px'}"/>
      </n-popselect>
    </tool-tip>
    <n-divider vertical/>
    <!-- <tool-tip class="w-40px h-full" :tooltip-content="$t('button.hsfullscreen')" :inverted="theme.darkMode" @click="toggle">
      <icon icon="gridicons-fullscreen-exit" v-if="isFullscreen" class="text-18px" />
      <icon icon="gridicons-fullscreen" v-else class="text-18px" />
    </tool-tip> -->
  </div>
  
  <n-popover :class="`${prefixCls}-pop`" 
    display-directive="show"
    trigger="click" placement="bottom-start"
    @update:show="showChange">
    <template #trigger>
      <tool-tip @click="" :inverted="preference.isDark" placement="top"
        :tooltip-content="$t('layout.table.colSetting')">
        <icon icon="mdi:cog-outline" :style="{fontSize:'20px'}"/>
      </tool-tip>
    </template>
    <template #header>
      <div>
        <n-checkbox
          class="!-mr-[1px]" :label="$t('layout.table.showColumnText')"
          v-model:checked="checkAll"
          :indeterminate="indeterminate"
          @update:checked="onCheckAllChange"/>
        <n-checkbox
          class="!-mr-[1px]" :label="$t('layout.table.openCheckbox')"
          v-model:checked="selection" @update:checked="onSelection"/>
        <n-button text type="primary" @click="onReset">{{$t('button.resetText')}}</n-button>
      </div>
    </template>
    <div class="grid gap-x-[4px] grid-cols-[auto_minmax(150px,1fr)_repeat(2,auto)] items-center" v-for="col in colsData" :key="col.key" :class="{'col-draggble':!col.fixed}">
      <icon class="cursor-pointer" icon="clarity:drag-handle-line" size="20"/>
      <n-checkbox :checked="!col.hide" @update:checked="handlerCheckColumn(col)" :label="(col.title as string)" />
      <icon :class="[`${prefixCls}__fixed-left`,{active:col.fixed==='left',disabled: col.hide}]" icon="radix-icons:pin-left" @click="pin('left',col)"/>
      <icon :class="[`${prefixCls}__fixed-right`, {active:col.fixed==='right',disabled: col.hide}]" icon="radix-icons:pin-right"  @click="pin('right',col)"/>
    </div>
  </n-popover>
</div>
</template>
<script lang="ts" setup>
import { useDesign,useSortable } from '@/hooks';
import { usePreferenceStore } from '@/store/modules';
import {densityOptions} from '@/constants/options'
// import {DataTableColumn} from 'naive-ui'
import {TableColumn,tableBarProps} from './types'
import { cloneDeep } from 'lodash-es';
import {isNullOrUnDef} from '@/utils/util'
defineOptions({name: 'TableBar'})

// const {t} = useI18n()
const props = defineProps(tableBarProps);

interface Emits {
  (e: 'refresh'):void
  (e: 'update:size', size:string|number):void
  (e: 'expandAll', expandAll: boolean):void
  (e: 'update:columns', val:TableColumn[]):void
  // (e: 'export'):void
}
const emit = defineEmits<Emits>()
let inited = false;
//table size
const tableSize = toRef(props, 'size')
const {prefixCls} = useDesign('table-bar')
const preference = usePreferenceStore()
const hasBtnSlot = computed(()=>useSlots().toolbar)
const dynamicColumns = ref(cloneDeep(props.columns))
//用于排除勾选框或其他不需要显示在设置框里面的栏位
const colsData = computed(()=>{return unref(dynamicColumns).filter(e=>e.key!=='selection')})

const checkAll = ref(true);
const indeterminate = ref(false)

//是否可以展开
//const canExpand = computed(()=>{props.columns.findIndex(c=>c.type=='selection')})
//const isExpandAll = ref(false);

//勾选列
const selection = ref(props.selection)

// const toggleExpand = ()=>{
//   isExpandAll.value = !isExpandAll.value
//   emit('expandAll', isExpandAll.value)
// }

const onRefresh = ()=>{
  emit("refresh");
}

const onReset = async() => {
  checkAll.value = true;
  indeterminate.value = false;
  dynamicColumns.value = cloneDeep(props.columns)
  //重新初始化勾选
  initSection()
  ///
  emit('update:columns', unref(dynamicColumns))
}
const onCheckAllChange = (val:boolean)=>{
  dynamicColumns.value.forEach(e => {
    e.hide = !val  //val跟hide语义相反
  });
  emit('update:columns', unref(dynamicColumns))
}
const onSize = (val:string|number)=>{
  emit('update:size', val)
}

//处理单个栏目勾选
const handlerCheckColumn = (col:TableColumn)=>{
  col.hide = !col.hide
  //处理全选框
  const cols = unref(colsData)
  if(cols.every(e=>(e.hide===true || e.hide===false))){
    checkAll.value = !cols[0].hide
  }
  emit('update:columns', unref(dynamicColumns))
}

//固定
const pin = (direction: 'left'|'right', col:TableColumn)=>{
  if(col.hide) return
  const isFixed = (col.fixed === direction) ? undefined : direction;
  col.fixed = isFixed
  if (isFixed && !col.width) {
    col.width = 100;
  }
  console.log("colsData", colsData.value)
  emit('update:columns', unref(dynamicColumns))
}

 //勾选列处理
function onSelection(e:boolean) {
  if (e) {
    dynamicColumns.value.unshift({ type: 'selection', key: 'selection', hide:false});
    emit('update:columns', unref(dynamicColumns))
  } else {
    dynamicColumns.value.splice(0, 1);
    emit('update:columns', unref(dynamicColumns))
  }
}

//初始化（拖拽）
function init(){
  if(inited) return
  nextTick(() => {
    const el = document.querySelectorAll(`.${prefixCls}-pop .n-popover__content`)?.[0] as HTMLElement;
    // console.log("el--- ",el)
    if(!el) return;
    const { initSortable } = useSortable(el, {
      draggable: '.col-draggble', //当前列存在fixed属性 则不可拖拽(不会添加.col-draggble)
      onEnd: ({ newIndex, oldIndex, item }) => {
        if(isNullOrUnDef(oldIndex) || isNullOrUnDef(newIndex) || newIndex===oldIndex) return;

        const columns = unref(dynamicColumns)

        if (oldIndex > newIndex) {
          columns.splice(newIndex, 0, columns[oldIndex]);
          columns.splice(oldIndex + 1, 1);
        } else {
          columns.splice(newIndex + 1, 0, columns[oldIndex]);
          columns.splice(oldIndex, 1);
        }
        emit('update:columns', unref(dynamicColumns))
      },
      delay: 1000,
      fallbackTolerance: 10, // Specify in pixels how far the mouse should move before it's considered as a drag.
      forceFallback: true, //禁止使用HTML5原生拖拽
      dragoverBubble: true
    });
    initSortable();
    inited = true;
  });
}

function showChange(val:boolean){
  val&&init()
}

//勾选列处理，默认勾选框在第一列
function initSection(){
  const hasSectionCol = dynamicColumns.value.some((e:TableColumn)=>e.type==='selection')
  //如果每一行已经包含勾选框
  if(hasSectionCol)
    selection.value = true
  //如果不包含，但是selection初始化为true，则动态增加勾选框
  else if(selection.value){
    dynamicColumns.value.unshift({ type: 'selection', key: 'selection', hide:false, fixed:'left'});
    emit('update:columns', unref(dynamicColumns))
  }
}

// function initIndexCol(){
//   if(props.has)
// },
initSection()

</script>
<style lang="scss">
$prefixCls: '#{$namespace}-table-bar';
$pop: '#{$namespace}-table-bar-pop';
.#{$pop}{
  .#{$prefixCls}__fixed-left,
  .#{$prefixCls}__fixed-right{
    cursor: pointer;
    &.active{
      color: var(--primary-color-pressed);
    }
  }

}

</style>