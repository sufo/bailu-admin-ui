<template>
  <n-modal
    v-model:show="show"
    :segmented="{ footer: 'soft' }"
    :closable="false"
    preset="card"
    footer-style="padding: 0; margin: 0"
    class="fixed left-0 right-0"
    :class="[isMobile ? 'wh-full top-0px rounded-0' : 'w-630px top-50px']"
    @after-leave="handleClose"
  >
    <n-input-group>
      <n-input ref="inputRef" v-model:value="keyword" clearable :placeholder="$t('button.searchText')" @input="handleSearch">
        <template #prefix>
          <icon icon="uil:search" class="text-15px text-#c2c2c2" />
        </template>
      </n-input>
      <n-button v-if="isMobile" type="primary" ghost @click="handleClose">{{$t('button.cancelText')}}</n-button>
    </n-input-group>

    <div class="mt-20px">
      <n-empty v-if="searchResult.length === 0" :description="$t('common.searchNotData')" />
      <search-result v-else v-model:value="activeIndex" :result="searchResult" @enter="handleEnter" />
    </div>
    <template #footer>
      <search-footer v-if="!isMobile" />
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useMenuSearch } from '@/hooks';
import SearchResult from './SearchResult.vue';
import SearchFooter from './SearchFooter.vue';
import {useContext} from '@/store/useContext'

defineOptions({ name: 'SearchModal' });

interface Props {
  /** 弹窗显隐 */
  value: boolean;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:value', val: boolean): void;
  (e: 'close'):void;
}
const emit = defineEmits<Emits>();

const {isMobile} = storeToRefs(useContext())

const inputRef = ref<HTMLInputElement>();


const { handleSearch, searchResult, keyword, activeIndex, handleEnter } =
    useMenuSearch(emit);

const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit('update:value', val);
  }
});

watch(show, async val => {
  if (val) {
    /** 自动聚焦 */
    await nextTick();
    inputRef.value?.focus();
  }
});


function handleClose() {
  show.value = false;
  searchResult.value = [];
  emit('close')
}

</script>

<style lang="scss" scoped></style>
