
import { useBattery as getBattrty } from '@vueuse/core'
import { useI18n } from 'vue-i18n';
export const useBattery = () => {
  const battery = getBattrty()
  const { charging, chargingTime, dischargingTime, level } = battery
  const { t } = useI18n()
  // 计算电池剩余可用时间
  const calcDischargingTime = computed(() => {
    const hour = dischargingTime.value / 3600;
    const minute = (dischargingTime.value / 60) % 60;
    return `~~${hour}${t('common.hour')}~~${minute}${t('common.minute')}`;
  });

  // 计算电池充满剩余时间
  const calcChargingTime = computed(() => {
    const hour = chargingTime.value / 3600;
    const minute = (chargingTime.value / 60) % 60;
    return `~~${hour}${t('common.hour')}~~${minute}${t('common.minute')}`;
  });

  // 电池状态
  const batteryStatus = computed(() => {
    if (charging.value && level.value * 100 >= 100) {
      return t('common.chargeFull');
    } else if (charging.value) {
      return t('common.charging');
    } else {
      return t('common.disconnectPower');
    }
  });



  return {
    charging, chargingTime, dischargingTime, level,
    battery,
    batteryStatus,
    calcDischargingTime,
    calcChargingTime,
  };
};
