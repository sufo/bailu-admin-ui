<template>
  <!-- <dark-mode-container class="mt-8 flex-col sm:flex-1-hidden" v-bind="$attrs" :inverted="theme.isDark"> -->
  <dark-mode-container class="mt-[8px] flex-col flex-1-hidden" v-bind="$attrs" :inverted="theme.isDark">
   <!-- <n-card :title="title" :bordered="false" size="small" class="sm:flex-1-hidden">
    <template #header-extra> -->
      <table-bar v-if="!hideToolbar"
      :columns="columns"
      :size="size"
      :selection="hasSection"
      :title="title"
      :onExport="onExport"
      @refresh="onRefresh"
      @update:size="onSize"
      @expandAll="onExpandAll"
      @update:columns="handlerCols">
      <template v-for="(_, name) in $slots" v-slot:[name]="scope">
        <slot :name="name" v-bind="scope"/>
      </template>
    </table-bar>
    <!-- </template> -->
    
    <n-data-table :ref="(el:Ref)=>tablesRef[tbKey]=el" 
      class="px-16px pb-12px flex flex-1 h-0"
      v-bind="bindProps"
      :pagination="getPagination">
      <template #empty><slot name="empty"/></template>
      <template #loading><slot name="loading"/></template>
    </n-data-table>
   <!-- </n-card> -->
  </dark-mode-container>
</template>
<script setup lang="ts" generic="T extends Recordable">
import TableBar from './TableBar.vue';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from 'lodash-es'
import type{TableProps, TableColumn} from './types'
import {dataTableProps} from './types'
import {usePagination, useTable} from './hook'
import { useLoading} from '@/hooks';
import { provideTableCtx } from './hook/tableContext';
import { usePreferenceStore } from '@/store/modules'
import { useContext } from '@/store/useContext';

defineOptions({name: 'BaseTable'})

const { t } = useI18n()
const theme = usePreferenceStore()

const props = defineProps(dataTableProps);

//DataTable需要显示的column
const cloumnsData:Ref<TableColumn<T>[]> = ref([])

const dynamicColumns = ref(cloneDeep(props.columns))

//解决i8n响应式
watch(
  ()=>props.columns,
  (cols)=>{
    dynamicColumns.value = cloneDeep(cols);
  },{deep:true}
)

//勾选列处理，默认勾选框在第一列, 针对hideToolbar的时候处理
function initSection(){
  if(props.hasSection && props.hideToolbar){
    const hasSectionCol = dynamicColumns.value.some((e:TableColumn)=>e.type==='selection')
    //默认包含勾选框, 则动态添加
    if(!hasSectionCol)
    dynamicColumns.value.unshift({ type: 'selection', key: 'selection', hide:false, fixed:'left'});
  }
}

// const tableRef = ref(null)
const tablesRef:Ref<{[x:string|number]:any}> = ref({})
const size:Ref<Density> = ref('medium')
const {isMobile} = storeToRefs(useContext())
interface Emits {
  (e: 'refresh'):void,
  (e: 'update:size',size:Density):void,
  (e: 'update:columns', columns: Array<TableColumn<T>>):void
  (e: 'fetch-err'):void
  // (e: 'page-index-change', pageIndex:number):void,
  // (e: 'page-size-change', pageSize:number):void,
}
const emits  = defineEmits<Emits>()

const showPagination = ref(true)
const tableData = ref<Recordable[]>([])
const {getPagination, setPagination} = usePagination(props.pagination,showPagination,t,isMobile)
const { loading, setLoading } = useLoading()

//直接unref(tablesRef)[props.key])应该是没值；所以这里用computed
const tableElRef = computed(()=>(unref(tablesRef)[props.tbKey]))

//dataTable maxHeight
// const maxH = ref(props.maxHeight)

const {loadData, query, getRowKey, getScrollX, updatePage,updatePageSize} = useTable(
  tableElRef, props, getPagination, 
  setPagination, loading, tableData, dynamicColumns, emits
)

const bindProps: ComputedRef<TableProps<T>> = computed(() => {
  const {request,pagination, ...rest} = props
  return {
    ...unref(rest),
    title:props.title,
    loading: unref(loading),
    // columns: toRaw(unref(dynamicColumns)),
    columns: toRaw(unref(cloumnsData)),
    rowKey: unref(getRowKey),
    remote:true, //这样才会自动分页
    // flexHeight: !isMobile.value,
    flexHeight: true,
    data: unref(tableData),
    size: unref(size),
    scrollX: unref(getScrollX),
    onUpdatePage:updatePage,
    onUpdatePageSize:updatePageSize
    // maxHeight: unref(maxH)+"px",
  } as import('naive-ui').TableProps; 
});

function onRefresh(){
  query()
  emits('refresh')
}
  
//表格紧密程度
const onSize = (val:Density)=>{
  size.value = val
  emits('update:size', val)
}

const handlerCols = (cols: Array<TableColumn>)=>{
  dynamicColumns.value = cols
  // console.log("dynamicColumns", dynamicColumns.value)
  emits('update:columns', dynamicColumns.value);
}

const onExpandAll = (expandAll:boolean)=>{
  if(expandAll){
    
  }
}

watch(
  ()=> dynamicColumns,
  ()=>{
    cloumnsData.value = unref(dynamicColumns).filter(e=>!e.hide);
    // console.log("cloumnsData", cloumnsData)
  }, {immediate:true,deep:true}
)

//provide暴露
provideTableCtx({
  loadData,
  setLoading,
  emit: emits,
  tableRef: tableElRef,
  bindProps,
  tableData
})

//暴露loadData和setLoading方法
defineExpose({
  loadData,
  query,
  setLoading,
  setPagination,
  tableData
});

initSection()
</script>




