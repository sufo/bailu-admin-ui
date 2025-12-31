<template>
  <div
    :class="[prefixCls,{ onLockLogin: showLogin }]"
    @mousedown.stop
    @contextmenu.prevent>
    
    <template v-if="!showLogin">
      <div class="lock-box">
        <span class="lock-icon" :title="$t('common.unlockScreen')" @click="onLockLogin(true)">
          <icon icon="mdi:lock-outline" size="36"/>
        </span>
      </div>
      <!--充电-->
      <recharge
        :battery="battery"
        :battery-status="batteryStatus"
        :calc-discharging-time="calcDischargingTime"
        :calc-charging-time="calcChargingTime"
      />

      <div class="local-time">
        <div class="time">{{ hour }}:{{ minute }}</div>
        <div class="date">{{ date }}</div>
      </div>
      <div class="computer-status">
        <icon  icon="online?'ri:wifi-line':'ri:wifi-off-line'"/>
        <icon  icon="ant-design:api-outlined"/>
      </div>
    </template>

    <!--登录-->
    <template v-if="showLogin">
      <div class="login-box">

        <!--avatar-->
        <!-- <img :class="`${prefixCls}__header`" :src="userAvatar" />   -->
        <n-avatar :size="128" :src="userAvatar" v-if="userAvatar" />
        <n-avatar :size="128" :src="userAvatar" v-else>
          <icon icon="ant-design:user-outlined" size="128"/>
        </n-avatar>

        <div class="username">{{ username }}</div>
        <n-input
          type="password"
          autofocus
          v-model:value="loginParams.password"
          @keyup.enter="onLogin"
          :placeholder="$t('common.loginPwdPlaceHolde')">
          <template #suffix>
            <n-icon @click="onLogin" style="cursor: pointer">
              <icon icon="ant-design:loading-outlined" v-if="loginLoading" />
              <icon icon="carbon:arrow-right" v-else />
            </n-icon>
          </template>
        </n-input>

        <div class="w-full flex" v-if="isLoginError">
          <span class="text-red-500">{{ errorMsg }}</span>
        </div>

        <div class="w-full mt-1 flex justify-around">
          <div class="cursor-pointer"><a @click="showLogin = false">{{$t('login.backSignIn')}}</a></div>
          <div class="cursor-pointer"><a @click="goLogin">{{$t('common.relogin')}}</a></div>
          <div class="cursor-pointer"><a @click="onLogin">{{$t('common.enterSys') }}</a></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useTime, useBattery, useDesign} from '@/hooks';
import { useLocaleStore, useLockStore, useUserStore} from '@/store/modules';
import { useOnline } from '@vueuse/core'
import {MONTH_ABBR, WEEK} from '@/constants/consts'
import { useI18n } from 'vue-i18n';
// import {onKeyStroke} from '@vueuse/core'
export default defineComponent({
    name: 'Lockscreen',
    setup() {
      const userStore = useUserStore();
      const lockStore = useLockStore();
      const online = useOnline();
      const { getLocale } = useLocaleStore();
      const {t} = useI18n()
      // 获取时间
      const { month, day, hour, minute, second, week, year,weekAt} = useTime();
      const router = useRouter();
      const route = useRoute();

      const { battery, batteryStatus, calcDischargingTime, calcChargingTime } = useBattery();

      const date = computed(()=>{
        return getLocale==='zh-CN'?
          `${month.value}月${ day.value }号，星期${week.value}`
          :`${WEEK[weekAt.value]},${MONTH_ABBR[month.value]} ${ day.value },${year.value}`
      })

      const {prefixCls} = useDesign('lock-screen')

      const userInfo = userStore.getUserInfo;
      const username = userInfo?.username;
      const userAvatar = userInfo?.avatar
      
      const state = reactive({
        showLogin: false,
        loginLoading: false, // 正在登录
        isLoginError: false, //密码错误
        errorMsg: t('common.pwdError'),
        loginParams: {
          username: username || '',
          password: '',
        },
      });

      // 解锁登录
      const onLockLogin = (value: boolean) => (state.showLogin = value);

      // 登录
      const onLogin = async () => {
        if (!state.loginParams.password.trim()) {
          return;
        }
        state.isLoginError = false
        state.loginLoading = true;
        const {username,password} = state.loginParams
        try{
          const res = await lockStore.unLock(username, password);
          if (res)
            onLockLogin(false);
        }catch(error: unknown){
          // state.isLoginError = true
          // const err = (error as AxiosError<Result>)?.response?.data?.msg;
          // state.errorMsg = err||''
        }
        state.loginLoading = false;
      };

      //重新登录
      const goLogin = () => {
        onLockLogin(false);
        lockStore.setLockInfo({isLock: false});
        router.replace({
          path: '/login',
          query: {
            redirect: route.fullPath,
          },
        });
      };
      return {
        ...toRefs(state),
        username,
        userAvatar,
        prefixCls,
        online,
        hour,
        minute,
        second,
        date,
        battery,
        batteryStatus,
        calcDischargingTime,
        calcChargingTime,
        onLockLogin,
        onLogin,
        goLogin,
      };
    },
  });
</script>

<style lang="scss" scoped>
$prefix-cls: '#{$namespace}-lock-screen';
.#{$prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    background: #000;
    color: white;
    overflow: hidden;
    z-index: 100;

    &.onLockLogin {
      background-color: rgba(25, 28, 34, 0.88);
      backdrop-filter: blur(7px);
    }

    .login-box {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      > * {
        margin-bottom: 14px;
      }

      .username {
        font-size: 30px;
      }
    }

    .lock-box {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 34px;
      z-index: 100;

      .tips {
        color: white;
        cursor: text;
      }

      .lock-icon {
        cursor: pointer;
        display: flex;
        align-items: flex-end;

        .anticon-unlock {
          display: none;
        }

        &:hover .anticon-unlock {
          display: initial;
        }

        &:hover .anticon-lock {
          display: none;
        }
      }
    }

    .local-time {
      position: absolute;
      bottom: 60px;
      left: 60px;
      font-family: helvetica;

      .time {
        font-size: 70px;
      }

      .date {
        font-size: 40px;
      }
    }

    .computer-status {
      position: absolute;
      bottom: 60px;
      right: 60px;
      font-size: 24px;
      width: 30px;
      > * {
        margin-left: 14px;
      }

      .network {
        position: relative;
      }
    }
  }
</style>
