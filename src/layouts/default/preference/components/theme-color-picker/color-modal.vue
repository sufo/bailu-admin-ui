<template>
  <n-modal :show="visible" preset="card" class="w-640px lt-sm:w-full h-480px" :z-index="10001" @close="handleClose">
    <div class="flex-x-center">
      <n-gradient-text type="primary" :size="24">{{$t('preference.theme.traditionalColors')}}</n-gradient-text>
    </div>
    <n-tabs>
      <n-tab-pane v-for="item in traditionColors" :key="item.name" :name="`${item.name}色系`" :tab="`${item.name}色系`">
        <n-grid :cols="8" :x-gap="16" :y-gap="8">
          <n-grid-item v-for="i in item.colors" :key="i.name">
            <color-checkbox
              class="!w-full !h-36px !rounded-4px"
              :color="i.hex"
              :checked="i.hex === preference.theme.themeColor"
              icon-class="text-20px"
              @click="preference.setThemeColor(i.hex)"
            />
            <p class="text-center">{{ i.name }}</p>
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<script setup lang="ts">
import { traditionColors } from '@/settings/colors';
import { usePreferenceStore } from '@/store/modules';
import ColorCheckbox from './color-checkbox.vue';

defineOptions({ name: 'ColorModal' });

interface Props {
  visible: boolean;
}

defineProps<Props>();

interface Emits {
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

const preference = usePreferenceStore();

function handleClose() {
  emit('close');
}

</script>

<style scoped></style>
