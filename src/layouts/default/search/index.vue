<template>
  <div>
    <tool-tip
      class="w-40px h-full"
      :tooltip-content="$t('button.searchText')"
      :inverted="theme.header.inverted"
      @click="handleSearch">
      <icon icon="uil-search" class="text-20px" />
    </tool-tip>
    <search-modal v-model:value="show" />
  </div>
</template>

<script lang="ts" setup>
import { usePreferenceStore } from '@/store/modules';
import { useBoolean } from '@/hooks';
import { SearchModal } from './components';

defineOptions({ name: 'AppSearch' });

const { bool: show, toggle } = useBoolean();
const theme = usePreferenceStore();

function handleSearch() {
  toggle();
}
</script>

<style lang="scss" scoped></style>
