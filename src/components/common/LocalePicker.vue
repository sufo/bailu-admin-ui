<template>
  <StateDropdown :options="options" trigger="click" :state="state" @select="select">
    <span class="cursor-pointer flex items-center ml-8 dark:color-#fff">
      <icon icon="ion:language" />
      <span v-if="showText" class="ml-1">{{ getLocaleText }}</span>
    </span>
  </StateDropdown>
</template>

<script lang="ts" setup>
import {localeList} from "@/settings/localeSetting"
import {useLocale} from '@/locales/useLocale'

defineOptions({name:"LocalePicker"})

const {getLocale, changeLocale} = useLocale()

const props = defineProps({
  /**
     * Whether to display text
     */
     showText: { type: Boolean, default: true },
    /**
     * Whether to refresh the interface when changing
     */
    reload: { type: Boolean },
})

const options = computed(()=>{
  return localeList.map(l=>{
    return {
      key: l.value,
      label:l.label,
      type: 'render',
    }
  })
})

const active = computed(()=>{
  return localeList.findIndex(e=>e.value===getLocale.value)
})

const state = computed(()=>{
  return {icon:'mdi:check', active:active.value}
})

const getLocaleText = computed(()=>{return localeList[active.value].label})


const select = async (key:string | number,label:string, i:number)=>{
  await changeLocale(localeList[i].value);
  props.reload && location.reload();
}

</script>