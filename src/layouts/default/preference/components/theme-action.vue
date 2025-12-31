<template>
  <n-divider />
  <n-space vertical>
    <div ref="copyRef" data-clipboard-target="#themeConfigCopyTarget">
      <n-button type="primary" :block="true" @click="onCopy">{{$t('preference.copyBtn')}}</n-button>
    </div>
    <n-button type="warning" :block="true" @click="handleResetConfig">{{$t('preference.resetBtn')}}</n-button>
  </n-space>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import { useClipboard } from '@vueuse/core';
import { usePreferenceStore } from '@/store/modules';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'ThemeAction' });

const theme = usePreferenceStore();
const {t} = useI18n()
const copyRef = ref<HTMLElement>();

const dataClipboardText = ref(getClipboardText());
const { text, copy, isSupported } = useClipboard({ source: dataClipboardText.value })

function getClipboardText() {
  return JSON.stringify(theme.$state);
}

function handleResetConfig() {
  theme.resetThemeStore();
  window.$message?.success(t('tips.resetConfigTip'));
}

function onCopy(){
  if(isSupported)
    window.$message?.error(t('tips.copyNotSupport'))
  copy(text.value).then(()=>{
    window.$dialog?.success({
      title: t('preference.operatingTitle'),
      content: t('preference.operatingContent'),
      positiveText: t('button.confirm')
    });
  })
}

// function clipboardEventListener() {
//   if (!copyRef.value) return;
//   const copy = new Clipboard(copyRef.value);
//   copy.on('success', () => {
//     window.$dialog?.success({
//       title: t('preference.operatingTitle'),
//       content: t('preference.operatingContent'),
//       positiveText: t('button.confirm')
//     });
//   });
// }

const stopHandle = watch(
  () => theme.$state,
  () => {
    dataClipboardText.value = getClipboardText();
  },
  { deep: true }
);

// onMounted(() => {
//   clipboardEventListener();
// });
onUnmounted(() => {
  stopHandle();
});
</script>

<style scoped></style>
