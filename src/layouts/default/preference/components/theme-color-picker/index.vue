<template>
  <n-divider title-placement="center">{{ $t('preference.theme.themeColor') }}</n-divider>
  <n-grid :cols="8" :x-gap="8" :y-gap="12">
    <n-grid-item v-for="color in theme.themeColors" :key="color" class="flex-x-center">
      <color-checkbox :color="color" :checked="color === theme.themeColor" @click="preference.setThemeColor(color)" />
    </n-grid-item>
  </n-grid>
  <n-space :vertical="true" class="pt-12px">
    <n-color-picker :value="theme.themeColor" :show-alpha="false" @update-value="preference.setThemeColor" />
    <n-button :block="true" :type="otherColorBtnType" @click="openModal">{{ $t('preference.theme.moreColors') }}</n-button>
  </n-space>
  <color-modal :visible="visible" @close="closeModal" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isInTraditionColors } from '@/settings/colors';
import { usePreferenceStore } from '@/store/modules';
import { useBoolean } from '@/hooks';
import ColorModal from './color-modal.vue';
import ColorCheckbox from './color-checkbox.vue';

defineOptions({ name: 'ThemeColorPicker' });

const preference = usePreferenceStore();
const theme = toRef(preference,'theme')
const { bool: visible, setTrue: openModal, setFalse: closeModal } = useBoolean();

const isInOther = computed(() => isInTraditionColors(theme.value.themeColor));
const otherColorBtnType = computed(() => (isInOther.value ? 'primary' : 'default'));
</script>

<style scoped></style>
