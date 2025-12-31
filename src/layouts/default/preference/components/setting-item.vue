<template>
  <div class="flex-y-center justify-between" :class="{
      'pointer-events-none opacity-50': disabled,
    }">
    <span>{{ label }}</span>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'SettingItem' });

interface Props {
  /** 文本 */
  label: string;
  disabled?: boolean;
}

defineProps<Props>();
</script>

<style scoped></style>
