<template>
<div v-bind="$attrs"
      class='relative inline-flex justify-center items-center gap-12px px-12px py-4px border-1px border-solid rounded-4px cursor-pointer whitespace-nowrap'
      :class="[`${mode}-tab`,{ [`${mode}}-tab_active`]: active }]" >
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    </div>
</template>
<script lang="ts" setup>
import type { Slots } from '../types';
import {tabProps} from '../types';

// defineProps<TabProps>()
defineProps(tabProps)

defineSlots<Slots>();
</script>
