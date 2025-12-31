<!--
 * 
 * @Desc: 
-->
<template>
  <tool-tip class="w-40px h-full">
    <n-dropdown :options="options" trigger="hover" :value="language" @select="handleSelect">
      <icon icon="cil:language" size="18" class="outline-transparent" />
    </n-dropdown>
  </tool-tip>
</template>

<script lang="ts" setup>
import {LOCALE, localeList} from "@/settings/localeSetting"
import {useLocale} from '@/locales/useLocale'
import { computed,ref,unref } from 'vue';

defineOptions({ name: 'LangToggle' });

const {getLocale, changeLocale} = useLocale()

// const language = ref<I18nType.langType>(localStg.get('lang') || 'zh-CN');


// const language = computed(()=>{
//   console.log('getLocale', unref(getLocale))
//   return localeList.find(e=>e.value===getLocale.value)?.value || LOCALE['ZH_CN']
// })
const language = ref<LocaleType>(getLocale.value || LOCALE['ZH_CN'])

const options =  computed(()=>{
  return localeList.map(l=>{
    return {
      key: l.value,
      label:l.label,
      // type: 'render',
    }
  })
})
const handleSelect = async (key: string) => {
  if (unref(getLocale) === key) {
      return;
  }
  language.value=key as LocaleType
  //修改i18n.global.locale,这个放在changeLocale里面去修改
  // locale.value = key;
  await changeLocale(key as LocaleType);
  // location.reload();
};
</script>
<style scoped></style>
