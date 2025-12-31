<template>
  <n-divider title-placement="center">{{$t('preference.theme.themeMode')}}</n-divider>
  <n-space vertical size="large">
    <!-- <setting-item :label="$t('preference.theme.themedark')">
      <n-switch :value="theme.darkMode" @update:value="theme.setDarkMode">
        <template #checked>
          <icon icon="mdi:white-balance-sunny" class="text-14px text-white" />
        </template>
        <template #unchecked>
          <icon icon="mdi:moon-waning-crescent" class="text-14px text-white" />
        </template>
      </n-switch>
    </setting-item>
    <setting-item :label="$t('preference.theme.themeSys')">
      <n-switch :value="theme.followSystemTheme" @update:value="theme.setFollowSystemTheme">
        <template #checked>
          <icon icon="ic:baseline-do-not-disturb" class="text-14px text-white" />
        </template>
        <template #unchecked>
          <icon icon="ic:round-hdr-auto" class="text-14px text-white" />
        </template>
      </n-switch>
    </setting-item> -->
    <div class="flex flex-justify-around">
      <div v-for="theme in THEME_PRESET" :key="theme.name"
        class="cursor-pointer flex-col"
        @click="modelValue = theme.name">
        <div
         :class="activeClass(theme.name)"
         class=" outline-box flex-center py-16">
          <component :is="theme.icon" class="mx-30 size-20" />
        </div>
        <div class="text-muted-foreground mt-16 text-center text-xs">
          {{ nameView(theme.name) }}
        </div>
      </div>
    </div>
    <switch-item class="mt-24" v-model="prefer.menu.inverted" :disabled="modelValue=='dark'">{{$t('preference.theme.siderDark')}}</switch-item>
    <setting-item :label="$t('preference.theme.headerDark')" :disabled="modelValue=='dark'">
      <n-switch :value="prefer.header.inverted" @update:value="prefer.setHeaderInverted" />
    </setting-item>
    <setting-item :label="$t('preference.theme.footerDark')" :disabled="modelValue=='dark'">
      <n-switch :value="prefer.footer.inverted" @update:value="prefer.setFooterInverted" />
    </setting-item>
  </n-space>
</template>

<script lang="ts" setup>
import { usePreferenceStore } from '@/store/modules';
import SwitchItem from './swith-item.vue';
import settingItem from './setting-item.vue';
import { useIconRender } from '@/components/icon';

defineOptions({ name: 'ThemeMode' });

const prefer = usePreferenceStore();
const {t} = useI18n();
const {r} = useIconRender()
const modelValue = defineModel<ThemeModeType>()
const THEME_PRESET: Array<{ icon: Component; name: ThemeModeType }> = [
  {
    icon: r({icon:'lucide:sun',size:20}),
    name: 'light',
  },
  {
    icon: r({icon:'lucide:moon-star',size:18}),
    name: 'dark',
  },
  {
    icon: r({icon:'lucide:sun-moon',size:18}),
    name: 'auto',
  },
];

function activeClass(theme: string): string[] {
  return theme === modelValue.value ? ['outline-box-active'] : [];
}

function nameView(name: string) {
  switch (name) {
    case 'auto': {
      return t('preference.theme.followSys');
    }
    case 'dark': {
      return t('preference.theme.dark');
    }
    case 'light': {
      return t('preference.theme.light');
    }
  }
}

</script>
<style scoped></style>
