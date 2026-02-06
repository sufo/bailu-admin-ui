<template>
  <div :class="prefixCls" class="<md:grid-cols-[100%] md:grid-cols-[3fr_7fr]">
    <dark-mode-container class="left">
      <div class="min-h-40px p-[14px_15px_7px] 
        border-b-[var(--bailu-border-color)] border-b-1px text-16px">{{ $t('menu.profile') }}</div>
      <div class="px-20px pt-15px pb-20px">
        <bailu-avatar />
        <n-divider />
        <div class="cell"><icon icon="carbon:user-filled"/>用户名<span>{{ userInfo?.username }}</span></div>
        <div class="cell"><icon icon="carbon:mobile"/>手机号<span>{{ userInfo?.phone }}</span></div>
        <div class="cell"><icon icon="carbon:email"/>邮&emsp;箱<span>{{ userInfo?.email }}</span></div>
        <div class="cell"><icon icon="carbon:container-services"/>部&emsp;门<span>{{ userInfo?.deptName }}</span></div>
        <div class="cell"><icon icon="mdi:account-tie"/>职&emsp;位<span>{{ userInfo?.posts.map(e=>e.label).join() }}</span></div>
        <div class="cell"><icon icon="carbon:user-multiple"/>角&emsp;色<span>{{ userInfo?.roles.map(e=>e.label).join() }}</span></div>
        <!-- <div class="cell"><icon icon=""/>创建日期<span>{{ }}</span></div> -->
        <div class="cell" v-if="userInfo?.profile">{{ userInfo?.profile }}</div>
      </div>  
    </dark-mode-container>
    <n-tabs class="right bg-white dark:bg-transparent" type="line" :tabs-padding="15" tab-style="font-size:16px;" animated>
      <n-tab-pane :name="$t('page.profile.general')" :tab="$t('page.profile.general')">
        <user-info @tabClose="tabClose"/>
      </n-tab-pane>
      <n-tab-pane :name="$t('page.profile.changePwd')" :tab="$t('page.profile.changePwd')">
        <change-pwd @tabClose="tabClose"/>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { useDesign } from '@/hooks';
import bailuAvatar from './Avatar.vue';
import UserInfo from './UserInfo.vue';
import ChangePwd from './ChangePwd.vue';
import { useTabStore,useUserStore } from '@/store/modules';

defineOptions({name: 'Profile'});

const {prefixCls} = useDesign("profile")
const tab = useTabStore();
const router = useRouter();
const userInfo = useUserStore().getUserInfo

function tabClose(){
  const fullPath = router.currentRoute.value.fullPath
  tab.closeTabByKey(fullPath, router)
}
</script>
<style lang="scss">
$prefix: '#{$namespace}-profile';

.#{$prefix}{
  display:grid;
  column-gap: 20px;
  .left,.right{
    border-radius: 4px;
    border: 1px solid var(--bailu-border-color);
    overflow: hidden;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .left{
    .cell{display:flex; height: 43px;line-height: 43px;
      align-items: center; overflow: hidden;
      flex-wrap: nowrap; 
      border-bottom: 1px solid var(--bailu-border-color);
      >span{flex:1;width:0;overflow:hidden;text-align:right;white-space: nowrap;text-overflow:ellipsis;margin-left:8px;}
    }
  }
}

</style>