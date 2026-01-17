<template>
  <div v-if="showTooltip">
    <n-tooltip :placement="placement" :trigger="trigger">
      <template #trigger>
        <div class="flex-center h-full cursor-pointer dark:hover:bg-#333" :class="contentClassName">
          <slot></slot>
        </div>
      </template>
      {{ tooltipContent }}
    </n-tooltip>
  </div>
  <div v-else class="flex-center cursor-pointer dark:hover:bg-#333" :class="contentClassName">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
defineOptions({ name: 'ToolTip' });

// const props = withDefaults(defineProps<TooltipProps>(), {
//   tooltipContent: '',
//   placement: 'bottom',
//   contentClass: '',
//   inverted: false,
//   trigger: 'hover'
// });
const props = defineProps<TooltipProps>();

const showTooltip = computed(() => Boolean(props.tooltipContent));

const contentClassName = computed(
  () => `${props.contentClass} ${props.inverted ? 'hover:bg-primary' : 'hover:bg-#f6f6f6'}`
);
</script>

<style scoped></style>
