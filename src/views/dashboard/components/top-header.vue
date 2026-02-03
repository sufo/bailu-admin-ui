<template>
  <n-card class="w-full !border-0">
    <div class="flex flex-col lg:flex-row justify-between items-center gap-[32px] bg-white dark:bg-[#18181c] rounded-2xl shadow-sm transition-base">
        
        <div class="flex-1 space-y-[16px] w-full">
            <div class="flex-y-center space-x-[16px]">
                <div class="relative">
                    <img :src="userInfo?.avatar??''" class="w-[64px] h-[64px] rounded-2xl shadow-inner" alt="Avatar">
                    <span class="absolute -bottom-[1px] -right-[1px] w-[5px] h-[5px] bg-success border-[4px] border-white dark:border-success rounded-full"></span>
                </div>
                <div>
                    <div class="flex-y-center gap-[16px]">
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-gray-100">{{ greeting }}，{{ userInfo.username }}</h1>
                        <span class="px-[8px] py-[2px] bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold rounded-lg tracking-wide uppercase">bailu</span>
                    </div>
                    <div class="flex-y-center mt-[16px] text-slate-400 dark:text-gray-400 text-xs space-x-[3px]">
                        <span class="flex-y-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>{{ $t('page.dashboard.lastLoginTime') }}{{ lastTime }}</span>
                        <span class="hidden md:inline">IP: {{ loginLog?.ip }} ({{ loginLog?.addr}})</span>
                    </div>
                </div>
            </div>
            
            <div class="pl-[4px] mt-[16px]! border-l-2 border-slate-200 dark:border-gray-700">
                <p class="text-sm italic text-slate-500 dark:text-gray-400 leading-relaxed">
                    {{ brief }}
                </p>
            </div>
        </div>

        <div class="flex flex-col md:flex-row items-center gap-[16px] w-full md:w-auto">
            <div class="text-right pr-[24px] md:border-r border-slate-200/60 dark:border-gray-700 flex md:block">
                <p class="text-xl font-black text-slate-800 dark:text-gray-100 tracking-tighter">{{ dateStr }}</p>
                <p class="text-xs font-medium text-slate-400 dark:text-gray-400 mt-[8px] ml-[8px] md:ml-[0px]">{{ weekStr }} · {{ lunarStr }}</p>
                <p class="text-xs text-primary font-bold bg-blue-50 dark:bg-blue-900/20 inline-block px-[8px] py-[2px] rounded-full mt-[8px]">{{ term }}</p>
            </div>

            <!-- <div class="flex-y-center gap-[12px]">
                <div class="p-[12px] rounded-2xl flex flex-col items-center min-w-[70px]">
                    <span class="text-warning mb-1">
                        <svg class="w-[24px] h-[24px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 102 0V2a1 1 0 102 0zm0 18v2a1 1 0 102 0v-2a1 1 0 102 0zM5.99 4.58a1 1 0 10-1.41 1.41l1.41 1.41a1 1 0 101.41-1.41L5.99 4.58zm12.02 12.02a1 1 0 10-1.41 1.41l1.41 1.41a1 1 0 101.41-1.41l-1.41-1.41zM5.99 19.42l-1.41-1.41a1 1 0 10-1.41 1.41l1.41 1.41a1 1 0 101.41-1.41zm12.02-12.02l-1.41-1.41a1 1 0 10-1.41 1.41l1.41 1.41a1 1 0 101.41-1.41z"/></svg>
                    </span>
                    <p class="text-xs font-bold text-slate-400 dark:text-gray-400">今天</p>
                    <p class="text-xs font-bold text-slate-700 dark:text-gray-200">{{ weatherInfo?.todayTemp || '--' }}</p>
                </div>
                <div class="p-[12px] rounded-2xl flex flex-col items-center min-w-[70px]">
                    <span class="text-blue-400 dark:text-blue-300 mb-1">
                        <svg class="w-[24px] h-[24px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5-1-2.6-3.5-4.5-6.6-4.5-3.1 0-5.8 1.9-6.9 4.6-2.2.4-3.6 2.1-3.6 4.4C1 17 3 19 5.5 19h12z"/></svg>
                    </span>
                    <p class="text-xs font-medium text-slate-400 dark:text-gray-400">明天</p>
                    <p class="text-xs font-bold text-slate-700 dark:text-gray-200">{{ weatherInfo?.tomorrowTemp || '--' }}</p>
                </div>
            </div> -->
            <div class="flex-y-center">
                <iframe
                    width="100%" 
                    scrolling="no" 
                    height="50" 
                    frameborder="0" 
                    allowtransparency="true" 
                    :src="weatherUrl">
                </iframe>
                <div class="absolute top-0 left-0 right-0 bottom-0 bg-transparent"></div>
            </div>
        </div>

    </div>
  </n-card>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/store/modules';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// import { getWeather } from '@/api/weather';
import { loginLogApi } from '@/api/admin';
import { LunarUtils } from '@/utils/lunar';
import {usePreferenceStore} from '@/store/modules'

const {t} = useI18n();
const userStore = useUserStore();
const userInfo = computed(() => userStore.getUserInfo);
const brief = computed(() => userInfo.value.profile || '“ 日子像一条缓慢流淌的河，情绪偶尔泛起，却很快归于平稳。回头看时才发现，那些真正留下痕迹的，并不是某个耀眼的时刻，而是无数个平凡却被认真度过的瞬间。 ”');
const loginLog = ref<LoginLog | null>(null);

// Date & Time State
const currentDate = ref(dayjs());
const dateStr = computed(() => currentDate.value.format('M月D日'));
const weekStr = computed(() => currentDate.value.locale('zh-cn').format('dddd'));
const lunarInfo = computed(() => LunarUtils.getFullInfo(currentDate.value.toDate()));
const lunarStr = computed(() => `农历${lunarInfo.value.lunarMonth}${lunarInfo.value.lunarDay}`);
const term = computed(() => {
    // A simple logic or usage of fullInfo to get recent term. 
    // Since fullInfo gives current day's term, if null we might just show Ganzhi or nothing.
    // For now, let's just use the current term if today is a term, else maybe just show GanzhiYear?
    // The design shows "小寒 2026-01-05", which is a specific Next Term logic.
    // For simplicity, let's display the Ganzhi Year and Animal first, or current Term if valid.
    /* 
       To match the design "Start Term YYYY-MM-DD", we need "next solar term".
       CalendarUtils doesn't have "getNextTerm".
       Let's stick to showing Ganzhi + Animal or Holiday for now.
       Design: "小寒 2026-01-05" -> This is future looking.
       Let's display "Year Animal" for now as it is readily available.
    */
   const info = lunarInfo.value;
//    return `${info.ganzhiYear}年 · ${info.animal}`;
    return `${LunarUtils.getLunarTerm()||(info.ganzhiYear+"年")} ${info.lunarDate}`;
});

const greeting = computed(() => {
    const hour = currentDate.value.hour();
    if (hour < 6) return t('greeting.early-morning');
    if (hour < 9) return t('greeting.morning');
    if (hour < 12) return t('greeting.noon');
    if (hour < 14) return t('greeting.afternoon');
    if (hour < 17) return t('greeting.evening');
    if (hour < 19) return t('greeting.night');
    return t('greeting.night');
});

const preference = usePreferenceStore()
const weatherUrl = computed(() => {
    return `https://i.tianqi.com?c=code&id=12&icon=1&num=2&bg=transparent&color=${preference.isDark?'%23ccffffff':'%23333639'}`;
});

let timer: NodeJS.Timeout;

// Weather State
// const weatherInfo = ref<{
//   todayTemp: string;
//   tomorrowTemp: string;
//   todayIcon: string; 
//   tomorrowIcon: string;
// } | null>(null);

const updateTime = () => {
  currentDate.value = dayjs();
};

// const fetchWeather = async () => {
//     const data = await getWeather('xxx'); // Default to Nanjing or user loc
//     if (data) {
//         // const today = data.current_condition[0]; // Unused, using forecast for range
//         const tomorrow = data.weather[1]; // Index 1 is tomorrow in wttr.in j1 format (0 is today's forecast)
        
//         // Simple temperature range for today (using forecast[0] might be better for range)
//         const todayForecast = data.weather[0];
        
//         weatherInfo.value = {
//             todayTemp: `${todayForecast.mintempC}~${todayForecast.maxtempC}°`,
//             tomorrowTemp: `${tomorrow.mintempC}~${tomorrow.maxtempC}°`,
//             todayIcon: '', 
//             tomorrowIcon: ''
//         };
//     }
// };

async function getLoginInfo() {
    // Map codes to ic
    loginLog.value = await loginLogApi.findByUsername();
}

const lastTime = computed(() => {
    if (!loginLog.value) return '';
    return dayjs(loginLog.value.loginTime).format('YYYY-MM-DD HH:mm');
});


onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 60000);
  getLoginInfo()
//   fetchWeather();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
<style scoped>
iframe{
    color-scheme:none
}
</style>