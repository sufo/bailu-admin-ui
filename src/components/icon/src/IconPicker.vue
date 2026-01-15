<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-11-16 16:37:01
 * @Desc: 
-->
<!--icon pick-->
<template>
  <n-input-group :class="prefixCls">
      <n-input v-model:value="selectedIcon" :style="{width}" :placeholder="$t('common.chooseText')"/>
      <n-popover placement="bottom-end" to="body"
      trigger="click" :class="`${prefixCls}-popover`"
      v-model:show="visible">
        <template #trigger>
          <n-input-group-label><Icon :icon="selectedIcon || 'ion:apps-outline'" class="cursor-pointer"/></n-input-group-label>
        </template>
        <template #header>
          <n-input @input="debounceSearch" clearable :placeholder="$t('common.searchIcon')"/>
        </template>
        <scroll-view ref="scrollViewRef">
          <ul class="flex flex-wrap px-[8px]">
            <li v-for="(icon,index) in curIcons" :key="index" 
              :class="{'border-primary':icon===selectedIcon}"
              @click="handleClick(icon)"
              class="p-[2px] w-1/8 cursor-pointer flex-center mr-[4px] mt-[4px] border border-solid hover:border-primary_hover">
              <icon :icon="icon" :style="{fontSize: '18px'}"/>
            </li>
          </ul>
        </scroll-view>
        <template #footer>
          <n-pagination v-bind="pagination"/>
        </template>
      </n-popover>
  </n-input-group>

</template>

<script>
</script>
<script lang="ts" setup>
import { useDesign } from '@/hooks';
import { useI18n } from 'vue-i18n';
// import iconsData from '../data/ionic.data'
// import iconsData from '../data/ant-design.data'
// import iconsData from '../data/carbon.data'
// import iconsData from '../data/lucide.data'
import iconsData from '../data/bootstrap.data'
import { useDebounceFn, useClipboard} from '@vueuse/core';
import { PropType } from 'vue';

defineOptions({name:'IconPicker', inheritAttrs:false})
const {prefixCls} = useDesign('icon-picker')
const {t} = useI18n()
//选中的图标
const selectedIcon = ref('');
//popover
const visible = ref(false);
//导入的icons
const importIcons = getIcons();
//分页
const page=ref(1)
const pageSize = ref(140)
const icons = ref(importIcons)
const scrollViewRef = ref()

const emits = defineEmits(['update:value'])

const pagination = computed(()=>({
  page: unref(page),
  pageSize: unref(pageSize),
  pageSlot: 3,
  showSizePicker:true,
  pageSizes: [
    {value: 20, label: t('layout.table.countPerPage', {n:20})},
    {value: 50, label: t('layout.table.countPerPage', {n:50})},
    {value: 100, label: t('layout.table.countPerPage', {n:100})},
    {value: 140, label: t('layout.table.countPerPage', {n:140})}
  ],
  itemCount: unref(icons).length,
  'onUpdate:page':(_page:number)=>{
    page.value = _page
    scrollViewRef.value.getBscoll()?.scrollTo(0,0)
  },
  'onUpdate:pageSize':(_pageSize:number)=>{
    pageSize.value = _pageSize
    scrollViewRef.value.getBscoll()?.scrollTo(0,0)
  },
}));
function getIcons() {
    const data = iconsData as any;
    const prefix: string = data?.prefix ?? '';
    let result: string[] = [];
    if (prefix) {
      result = (data?.icons ?? []).map((item:string) => `${prefix}:${item}`);
    } else if (Array.isArray(iconsData)) {
      result = iconsData as string[];
    }
    return result;
}

const curIcons=computed(()=>{
  const offset = (unref(page) - 1) * Number(unref(pageSize));
  const _icons = unref(icons)
  // console.log("offset", offset, offset + unref(pageSize))
  const ret =
    offset + unref(pageSize) >= _icons.length
      ? _icons.slice(offset, _icons.length)
      : _icons.slice(offset, offset + unref(pageSize));
  return ret;
})

const debounceSearch =  useDebounceFn(handleSearch, 300);

const props = defineProps({
  value: {type:String as PropType<string>, default:''},
  width: {type:String as PropType<string>, default:'100%'},
  pageSize: {type:Number as PropType<number>, default:140},
  copy: {type:Boolean as PropType<boolean>, default:false},
});

let copied=ref(false), isSupported=ref(false);

function handleClick(icon:string){
  selectedIcon.value = icon
  // visible.value=false
  if (props.copy) {
    if(copied.value&&isSupported.value){
      window.$message?.success(t('tips.copiedIcon'))
    }
  }
}

if(props.copy){
  ({copied, isSupported} = useClipboard({source:selectedIcon}))
}

// function handleSearch(e: Event) {
//   debugger
//   const value = (e.target as HTMLInputElement).value;
//   if (!value) {
//     page.value=1
//     icons.value = importIcons;
//     return;
//   }
//   icons.value = importIcons.filter((item) => item.includes(value));
// }
function handleSearch(value: string) {
  if (!value) {
    page.value=1
    icons.value = importIcons;
    return;
  }
  icons.value = importIcons.filter((item) => item.includes(value));
  scrollViewRef.value.getBscoll()?.scrollTo(0,0)
}


watchEffect(() => {
  selectedIcon.value = props.value;
});

watch(selectedIcon,
  ()=>{
    emits('update:value', unref(selectedIcon))
  }
)

</script>
<style lang="scss">
$prefix: '#{$namespace}-icon-picker';
.#{$prefix}{
  .n-input-group-label{
    display: inline-flex;
    align-items: center;
  }
  &-popover{
    width: 300px;
    .scroll-view.wrapper{
      height:200px;
    }

    /**n-pagination 布局 */
    .n-pagination > *:not(:first-child) {
      margin: 0;
    }
    .n-pagination { 
      >.n-pagination-item--button{margin-right:8px;}
      >.n-pagination-item--button:not(:first-child) {
        margin-left: 8px;
      }

      .n-base-selection .n-base-selection-label .n-base-selection-input{
        padding-left: 6px;
        padding-right: 20px;
      }
      .n-base-selection .n-base-suffix {
        right: 4px;
      }
    }
  }

}

</style>