<template>
  <n-dropdown :class="prefixCls"
    :show="dropdownVisible"
    :options="options"
    placement="bottom-start"
    :x="x"
    :y="y"
    @clickoutside="hide"
    @select="handleDropdown"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DropdownOption } from 'naive-ui';
import { useAppStore, useTabStore } from '@/store/modules';
import {useI18n} from 'vue-i18n'
import {useDesign} from '@/hooks'
import { useIconRender } from '@/components/icon'
import {useRouter,useRoute} from 'vue-router'

defineOptions({ name: 'ContextMenu' });

interface Props {
  /** 右键菜单可见性 */
  visible?: boolean;
  /** 当前路由路径 */
  currentPath?: string;
  /** 是否固定在tab卡不可关闭  */
  affix?: boolean;
  /** 鼠标x坐标 */
  x: number;
  /** 鼠标y坐标 */
  y: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  currentPath: ''
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const emit = defineEmits<Emits>();

const app = useAppStore();
const tab = useTabStore();
const router = useRouter();
const currentRoute = useRoute();
const { prefixCls } = useDesign('tabs-ctx-menu');
const { t } = useI18n();

const { iconRender } = useIconRender();

const dropdownVisible = computed({
  get() {
    return props.visible;
  },
  set(visible: boolean) {
    emit('update:visible', visible);
  }
});

function hide() {
  dropdownVisible.value = false;
}

type DropdownKey =
  | 'full-content'
  | 'reload-current'
  | 'close-current'
  | 'close-other'
  | 'close-left'
  | 'close-right'
  | 'close-all';
type Option = DropdownOption & {
  key: DropdownKey;
};

const options = computed<Option[]>(() => [
  {
    label: t('layout.tabs.fullContent'),
    key: 'full-content',
    icon: iconRender({ icon: 'gridicons-fullscreen' })
  },
  {
    label: t('layout.tabs.reload'),
    key: 'reload-current',
    disabled: props.currentPath !== tab.activeTab,
    icon: iconRender({ icon: 'ant-design:reload-outlined' })
  },
  {
    label: t('layout.tabs.close'),
    key: 'close-current',
    disabled: Boolean(props.affix),
    icon: iconRender({ icon: 'ant-design:close-outlined' })
  },
  {
    label: t('layout.tabs.closeOther'),
    key: 'close-other',
    icon: iconRender({ icon: 'ant-design:column-width-outlined' })
  },
  {
    label: t('layout.tabs.closeLeft'),
    key: 'close-left',
    icon: iconRender({ icon: 'mdi:format-horizontal-align-left' })
  },
  {
    label: t('layout.tabs.closeRight'),
    key: 'close-right',
    icon: iconRender({ icon: 'mdi:format-horizontal-align-right' })
  },
  {
    label: t('layout.tabs.closeAll'),
    key: 'close-all',
    icon: iconRender({ icon: 'ant-design:line-outlined' })
  }
]);

const actionMap = new Map<DropdownKey, () => void>([
  [
    'full-content',
    () => {
      app.setContentFull(true)
    }
  ],
  [
    'reload-current',
    () => {
      app.reloadPage();
    }
  ],
  [
    'close-current',
    () => {
      tab.closeTabByKey(props.currentPath,router);
    }
  ],
  [
    'close-other',
    () => {
      tab.closeOtherTabs(currentRoute, router);
    }
  ],
  [
    'close-left',
    () => {
      tab.closeLeftTabs(currentRoute, router);
    }
  ],
  [
    'close-right',
    () => {
      tab.closeRightTabs(currentRoute, router);
    }
  ],
  [
    'close-all',
    () => {
      tab.closeAllTab(router);
    }
  ]
]);

function handleDropdown(optionKey: string) {
  const key = optionKey as DropdownKey;
  const actionFunc = actionMap.get(key);
  if (actionFunc) {
    actionFunc();
  }
  hide();
}
</script>

<style scoped></style>
