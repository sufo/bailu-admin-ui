<template>
  <div @click="e=>emit('click', name, e)"
    :class="[
      'button-tab relative inline-flex justify-center items-center gap-4px px-10px py-4px rounded-4px cursor-pointer whitespace-nowrap',
      style['button-tab'],
      { [style['button-tab_dark']]: themeMode=='dark' },
      { [style['button-tab_active']]: active===name},
      { [style['button-tab_active_dark']]: active===name && themeMode=='dark' }
    ]">
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </div>
</template>

<script setup lang="ts">
import style from './index.module.css';
import type { Slots } from '../types';
import {tabProps} from '../types';
defineOptions({
  name: 'ButtonTab'
});

// defineProps<TabProps>();
defineProps(tabProps);

const emit = defineEmits<{(e: 'click', name?:string, 
  ev?:Event) : void}>()

defineSlots<Slots>();
</script>

<style scoped></style>
