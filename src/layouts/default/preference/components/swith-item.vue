<template>
  <div
    :class="{
      'pointer-events-none opacity-50': disabled,
    }"
    class="hover:bg-accent my-1 flex w-full items-center justify-between rounded-md"
    @click="handleClick">
    <span class="flex items-center text-sm">
      <slot></slot>

      <n-tooltip v-if="slots.tip" side="bottom">
        <template #trigger>
          <Icon size="12" icon="bx:help-circle" class="ml-4 size-12 cursor-help" />
        </template>
        <slot name="tip"></slot>
      </n-tooltip>
    </span>
    <span v-if="$slots.shortcut" class="ml-auto mr-8 text-xs opacity-60">
      <slot name="shortcut"></slot>
    </span>
    <n-switch v-model:value="checked" @click.stop />
  </div>
</template>
<script setup lang="ts">
import { useSlots } from 'vue';


defineOptions({name: 'SwitchItem'});

withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});

const checked = defineModel<boolean>();

const slots = useSlots();

function handleClick() {
  checked.value = !checked.value;
}
</script>