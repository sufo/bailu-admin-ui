<!--
 * @Desc: 
-->
<template>
  <n-dropdown :class="`${prefixCls}-overlay`" :options="options" @select="handleDropdown">
    <tool-tip :class="prefixCls" class="px-12px" :inverted="theme.header.inverted">
      <img :class="`${prefixCls}__header`" :src="userInfo.avatar" />
      <span class="pl-8px text-16px font-medium">{{ userInfo?.realName }}</span>
    </tool-tip>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { useUserStore, usePreferenceStore, useLockStore} from '@/store/modules';
import { useUserAction } from '@/hooks/business/useUserAction';
import { useI18n } from 'vue-i18n'
import { useDesign } from '@/hooks'
import { useIconRender } from '@/components/icon'
import headerImg from '@/assets/imgs/header.jpg'


defineOptions({ name: 'UserAvatar' });

const { logout } = useUserAction();
const user = useUserStore();
const theme = usePreferenceStore();
const router = useRouter();
const {t} = useI18n()
const { prefixCls } = useDesign('header-user-dropdown');
const { iconRender } = useIconRender();
const lockStore = useLockStore();
//options : ComputedRef<DropdownOption> 
const options = computed(()=> theme.header.useLockPage? [
  {
    label: t('page.profile.title'),
    key: 'profile',
    icon: iconRender({ icon: 'carbon:user-avatar' })
  },
  {
    label: t('layout.header.lockScreen'),
    key: 'lockScreen',
    icon: iconRender({ icon: 'carbon:locked' })
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: t('common.logout'),
    key: 'logout',
    icon: iconRender({ icon: 'carbon:logout' })
  }
]:[ 
  {
    label: t('page.profile.title'),
    key: 'profile',
    icon: iconRender({ icon: 'carbon:user-avatar' })
  },
  {
    label: t('common.logout'),
    key: 'logout',
    icon: iconRender({ icon: 'carbon:logout' })
  }
]);

type DropdownKey = 'lockScreen' | 'logout';

const userInfo = computed(() => {
  const { realName = '',username, avatar, profile } = user.getUserInfo || {};
  return { realName:realName||username, avatar: avatar || headerImg, profile };
});


function handleDropdown(optionKey: string) {
  const key = optionKey as DropdownKey;
  if (key === 'logout') {
    window.$dialog?.info({
      title: t('common.warn'),
      content: t('tips.confirmLogout'),
      positiveText: t('button.okText'),
      negativeText: t('button.cancelText'),
      onPositiveClick: () => {
        logout(true);
      }
    });
  }else if(key==='lockScreen'){
    lockStore.setLockInfo({isLock:true})
  }else if(key==='profile'){
    router.push('/user/profile')
  }
}
</script>

<style lang="scss" scoped>
// @prefix-cls: ~'@{namespace}-header-user-dropdown';
// .@{prefix-cls}{
$prefix-cls: '#{$namespace}-header-user-dropdown';
.#{$prefix-cls}{
    img {
      width: 24px;
      height: 24px;
    }
    &__header {
      border-radius: 50%;
    }
}
</style>
