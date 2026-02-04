<template>
  <div :class="[prefixCls, !showTitle?'flex-x-center':'']" class="cursor-pointer flex-y-center" @click="goHome">
    <img src="@/assets/logo.png" :class="imgClass"/>
    <h2 v-if="showTitle" 
        class="ellipsis-text pl-8px text-16px font-bold text-primary dark:text-white transition duration-300 ease-in-out">
        {{ title }}
    </h2>
  </div>
</template>
<script lang="ts" setup>
import { Page } from '@/constants/enum';
import {useDesign} from '@/hooks'
import {useGo} from '@/hooks/common/usePage'
import { useUserStore } from '@/store/modules/user';
// defineOptions({name:'AppLogo',inheritAttrs:false})
defineOptions({name:'AppLogo'})
const userStore = useUserStore()
const title = import.meta.env.VITE_APP_TITLE

const {prefixCls} = useDesign('app-logo')
interface Props {
  /** 显示名字 */
  showTitle?: boolean;
  imgClass?: string;
}

withDefaults(defineProps<Props>(), {
  showTitle: false,
  imgClass: "w-32px h-32px",
});

const go = useGo()

function goHome(){
  go(userStore.getUserInfo?.homePath || Page.BASE_HOME)
}
</script>

