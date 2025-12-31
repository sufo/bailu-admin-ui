<template>
  <tool-tip class="w-36 h-30" :tooltip-content="$t('layout.tabs.fullContent')" placement="bottom-end" @click="handleFold">
    <Icon :icon="getIcon" />
  </tool-tip>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useDesign } from '@/hooks';
  import {useAppStore} from '@/store/modules'

  export default defineComponent({
    name: 'FullButton',
    setup() {
      const { prefixCls } = useDesign('tabs');
      const app = useAppStore()
      const isFullContent = computed(() => app.fullContent);

      const getIcon = computed(() =>
        isFullContent.value ? 'codicon:screen-normal' : 'codicon:screen-full',
      );

      function handleFold() {
        // app.fullContent = !app.fullContent
        app.setContentFull(!app.fullContent)
      }

      return { prefixCls, getIcon, handleFold };
    },
  });
</script>
