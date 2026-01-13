/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-10-18 20:36:59
 * @Desc: 
 */
import { emitter } from '@/utils/emitter'
import { EventEnum } from '@/constants/enum'
import { i18n } from '@/locales/i18n';
//网络请求状态码处理
export function checkStatus(
  status: number,
  msg: string,
  errorMsgMode: 'modal' | 'message' | 'none' = 'message'
): void {
  const t = i18n.global.t;
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break
    // 401: Not logged in 
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      errMessage = msg || t('api.errMsg401');
      if (window.$dialog)
        window.$dialog?.warning({
          title: t('tips.systemPrompt'),
          content: t('tips.tokenExpiredRelogin'),
          positiveText: t('button.okText'),
          // negativeText: t('button.cancelText'),
          onPositiveClick: () => {
            emitter.emit(EventEnum.AUTH_ERROR, true);
          },
          // onNegativeClick: () => {
          //   // userStore.logout(true)
          // }
        })

      // })
      break;
    case 403:
      errMessage = t('api.errMsg403')
      break;
    // 404请求不存在
    case 404:
      errMessage = t('api.errMsg404');
      break;
    case 405:
      errMessage = t('api.errMsg405')
      break;
    case 429:
      errMessage = t('api.errMsg429')
      break;
    case 500:
      errMessage = t('api.errMsg500');
      break;
    case 501:
      errMessage = t('api.errMsg501');
      break;
    case 502:
      errMessage = t('api.errMsg502');
      break;
    case 503:
      errMessage = t('api.errMsg503');
      break;
    case 504:
      errMessage = t('api.errMsg504');
      break;
    case 505:
      errMessage = t('api.errMsg505');
      break;
    default:
  }

  if (errMessage && errorMsgMode !== 'none' && status != 401) {
    //这里非逻辑性错误采用message显示
    window.$message?.error(errMessage)
  }
} 