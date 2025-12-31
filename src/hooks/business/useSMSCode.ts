/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-05-17 11:57:36
 * @Desc: 
 */
import { computed } from 'vue';
import { smsCode } from '@/api/admin';
import useBoolean from '../common/useBoolean';
import useCountDown from './useCountDown';
import { i18n } from '@/locales/i18n';


export default function useSMSCode() {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();
  const { counts, start, isCounting } = useCountDown(60);
  const t = i18n.global.t
  const initLabel = t('countdown.normalText');
  const countingLabel = (second: number) => t('countdown.sendText', [second]);
  const label = computed(() => {
    let text = initLabel;
    if (loading.value) {
      text = '';
    }
    if (isCounting.value) {
      text = countingLabel(counts.value);
    }
    return text;
  });

  /** 判断手机号码格式是否正确 */
  function isPhoneValid(phone: string) {
    let valid = true;
    let msg = ''
    if (phone.trim() === '') {
      // window.$message?.error('手机号码不能为空！');
      msg = t('login.mobilePlaceholder')
      valid = false;
    }
    // else if (!REGEXP_PHONE.test(phone)) {
    //   // window.$message?.error('手机号码格式错误！');
    //   msg = t("login.phoneFormatErr")
    //   valid = false;
    // }
    return { valid, msg };
  }

  /**
   * 获取短信验证码
   * @param phone - 手机号
   * @dialCode - 国家编码
   */
  async function getSmsCode(phone: string, dialCode?: string) {
    const { valid, msg } = isPhoneValid(phone);
    if (!valid) {
      throw new Error(msg)
    }
    if (loading.value) return;

    startLoading();
    const p = phone.replace(/\s*/g, "")
    const smsToken = await smsCode(p, dialCode).catch(e => { endLoading() });
    endLoading();
    if (smsToken) {
      start();
    }
    return smsToken
  }

  return {
    label,
    start,
    isCounting,
    getSmsCode,
    loading
  };
}
