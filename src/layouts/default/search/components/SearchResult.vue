<template>
  <n-scrollbar>
    <div class="pb-12px">
      <template v-for="(item,index) in result" :key="index">
        <div
          class="bg-#e5e7eb dark:bg-transparent h-56px mt-8px px-14px rounded-4px cursor-pointer flex-y-center justify-between"
          :style="{
            background: index === active ? preference.theme.themeColor : '',
            color: index === active ? '#fff' : ''
          }"
          @click="handleTo"
          @mouseenter="handleMouse(index)">
          <!-- <Icon :icon="item?.icon" /> -->
          <component :is="item.icon" v-if="item.icon"/>
          <span class="flex-1 ml-5px">{{ item.name }}</span>
          <icon icon="ant-design-enter-outlined" class="icon text-20px p-2px mr-3px" />
        </div>
      </template>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { SearchResult } from '@/hooks/business/useMenuSearch';
import { usePreferenceStore } from '@/store/modules';
defineOptions({ name: 'SearchResult' });

interface Props {
  value: number,
  result: SearchResult[],
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:value', val: number): void;
  (e: 'enter'): void;
}

const emit = defineEmits<Emits>();

const preference = usePreferenceStore();

const active = computed({
  get() {
    return props.value;
  },
  set(val: number) {
    emit('update:value', val);
  }
});

/** 鼠标移入 */
async function handleMouse(index: number) {
  active.value = index;
}

function handleTo() {
  emit('enter');
}
</script>

<style lang="scss" scoped></style>
