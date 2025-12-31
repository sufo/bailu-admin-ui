<template>
  <n-divider title-placement="center">{{$t('preference.layoutMode')}}</n-divider>
  <n-space justify="space-around" :wrap="true" :size="24" class="px-12px">
    <layout-card
      v-for="item in layoutModeOptions($t)"
      :key="item.value"
      :mode="item.value"
      :label="item.label"
      :checked="item.value === layout.mode"
      @click="preference.setLayoutPreference({mode:item.value})">
      <template v-if="item.value === 'vertical'">
        <div class="w-18px h-full bg-primary:50 rd-4px"></div>
        <div class="flex-1 flex-col gap-6px">
          <div class="h-16px bg-primary rd-4px"></div>
          <div class="flex-1 bg-primary:25 rd-4px"></div>
        </div>
      </template>
      <template v-if="item.value === 'vertical-mix'">
        <div class="w-8px h-full bg-primary:50 rd-4px"></div>
        <div class="w-16px h-full bg-primary:50 rd-4px"></div>
        <div class="flex-1 flex-col gap-6px">
          <div class="h-16px bg-primary rd-4px"></div>
          <div class="flex-1 bg-primary:25 rd-4px"></div>
        </div>
      </template>
      <template v-if="item.value === 'horizontal'">
        <div class="h-16px bg-primary rd-4px"></div>
        <div class="flex-1 flex gap-6px">
          <div class="flex-1 bg-primary:25 rd-4px"></div>
        </div>
      </template>
      <template v-if="item.value === 'horizontal-mix'">
        <div class="h-16px bg-primary rd-4px"></div>
        <div class="flex-1 flex gap-6px">
          <div class="w-18px bg-primary:50 rd-4px"></div>
          <div class="flex-1 bg-primary:25 rd-4px"></div>
        </div>
      </template>
    </layout-card>
  </n-space>
</template>

<script setup lang="ts">
import { usePreferenceStore } from '@/store/modules';
import LayoutCard from './layout-card.vue';
import {layoutModeOptions} from '@/constants/options'
defineOptions({ name: 'LayoutMode' });

const preference = usePreferenceStore();
const layout = toRef(preference, 'layout')

</script>

<style scoped>
.layout-card__shadow {
  box-shadow: 0 1px 2.5px rgba(0, 0, 0, 0.18);
}
</style>
