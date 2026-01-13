import { AxiosTransform, CreateAxiosOptions, RequestOptions, Result } from '#/axios'
import { AxiosResponse } from 'axios'
import { ResultCode, RequestMethod, ContentType } from '@/constants/enum'
import { storage } from '@/utils/storage'
import { ACCESS_TOKEN } from '@/constants/consts'
import { emitter } from '@/utils/emitter'
import { EventEnum } from '@/constants/enum'
import { isUrl, isString, setObjToUrlParams, deepMerge } from '@/utils/util'
import { joinTimestamp } from './helper'
import { checkStatus } from './checkStatus'
import { DAxios } from './Axios'
import type { App } from 'vue'
import { i18n } from '@/locales/i18n'
import { useLocaleStoreWithOut } from '@/store/modules/locale'
import { apiSetting } from '@/settings/apiSetting'
/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {

  /**
  * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
  */
  transformResponseData: <T>(res: AxiosResponse<Result<T>>, options: RequestOptions) => {
    const { isTransformResponse,
      isReturnNativeResponse,
      successMsgMode,
      successMsgText,
      errorMsgText,
      errorMsgMode
    } = options

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }

    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data
    }

    //错误的时候返回
    let { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(i18n.global.t('api.apiRequestFailed'));
    }

    //  这里 code，data，msg为 后台统一的字段,需要修改为项目自己的接口返回格式
    // const { [apiSetting.code]:code, [apiSetting.msg]:msg, [apiSetting.data]: result } = data;
    const code = data[apiSetting.code] as number
    const msg = data[apiSetting.msg] as string
    const result = data[apiSetting.data]
    //请求成功
    const success = Reflect.has(data, apiSetting.code) && code === ResultCode.SUCCESS
    //成功提示信息处理
    if (success) {
      const _msg = successMsgText || msg || i18n.global.t('api.operationSuccess')
      if (successMsgMode === 'message')
        window.$message?.success(_msg)
      else if (successMsgMode === 'modal')
        window.$dialog?.success({
          type: 'success',
          content: _msg
        })
      return result
    }


    // 接口请求错误，统一提示错误信息 这里逻辑可以根据项目进行修改
    let _msg = ""
    switch (code) {
      case ResultCode.TIMEOUT:
        _msg = errorMsgText || i18n.global.t('api.timeoutMessage');
        _msg = errorMsgText || i18n.global.t('api.timeoutMessage');
        emitter.emit(EventEnum.AUTH_ERROR, true);
        break;
      default:
        _msg = errorMsgText || msg || i18n.global.t('api.operationFailed')
    }
    if (errorMsgMode === 'message')
      window.$message?.error(_msg)
    else if (errorMsgMode === 'modal')
      window.$dialog?.warning({
        title: i18n.global.t('api.errorTip'),
        content: _msg,
      })

    throw new Error(_msg)
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinParamsToUrl, joinTime = true, urlPrefix } = options
    const isUrlStr = isUrl(config.url as string);
    //存在就会拼接
    if (!isUrlStr && urlPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }

    if (!isUrlStr && apiUrl) {
      config.url = `${apiUrl}${config.url}`
    }

    const params = config.params || {}
    const data = config.data || false

    if (config.method?.toUpperCase() === RequestMethod.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data))
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config
  },

  /**
  * @description: 请求拦截器处理
  */
  requestInterceptor: (config, options) => {
    //请求之前处理config
    //请求之前处理config
    const token = storage.get(ACCESS_TOKEN)
    if (token && (config as Recordable).requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token
    }
    return config
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptor: (res: AxiosResponse<any>) => {
    return res;
  },

  responseErrorInterceptor: (error: any) => {

    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMsgMode || 'none';
    const msg: string = response?.data?.msg ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';
    /*
     * timeout and Network Error
     */
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = i18n.global.t('api.apiTimeoutMessage');
      }

      if (err?.includes('Network Error')) {
        errMessage = i18n.global.t('api.networkExceptionMsg');
      }
      if (errMessage) {
        if (errorMessageMode === 'modal') {
          window.$dialog?.error({ title: i18n.global.t('api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          window.$message?.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as string)
    }

    //status
    checkStatus(response?.status, msg, errorMessageMode)
    return Promise.reject(error);
  }

}


function createAxios(opt?: Partial<CreateAxiosOptions>) {
  const env = import.meta.env as ImportMetaEnv
  // console.log("env", env)
  const { getLocale } = useLocaleStoreWithOut()
  return new DAxios(
    deepMerge(
      {
        timeout: 10 * 1000,
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        authenticationScheme: 'Bearer', //jwt prefix
        headers: {
          'Accept': "application/json, text/plain, */*",
          'Content-Type': ContentType.JSON, 'Accept-Language': getLocale,
          "X-Requested-With": "XMLHttpRequest"
        },
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 接口地址
          apiUrl: env.VITE_API_URL,
          // 接口拼接地址
          urlPrefix: env.VITE_API_URL_PREFIX,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          // Error message prompt type
          errorMsgMode: 'message'
        }

      }, opt || {})
  );
}

// console.log("createAxios")
export const http = createAxios()

// export default {
//   install(app: App, options: any) {
//     app.config.globalProperties.$http = http
//   }
// }

export function setupAxios(app: App<Element>) {
  app.use(http)
} 