import { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { CreateAxiosOptions, RequestOptions, Result } from "~/types/axios";

import axios from "axios"
import { AxiosCanceler } from "./axiosCanceler";
import { deepMerge, isFunction, isUrl } from '@/utils/util'
import { UploadFileParams } from "~/types/axios";
import { cloneDeep } from "lodash-es";
import { ContentType } from '@/constants/enum'
import type { App } from 'vue'
/**
 * @description:  axios module
 */
export class DAxios {

  private instance: AxiosInstance;
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.instance = axios.create(options)
    this.setInterceptors()
  }

  install(app: App<Element>, options: any) {
    app.config.globalProperties.$http = this
  }

  /**
   * @description:  创建axios实例
   */
  private create(config: CreateAxiosOptions) {
    deepMerge(this.options, config)
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }


  getInstance() {
    return this.instance
  }

  /**
   * @description: 重新配置 axios
  */
  config(config: CreateAxiosOptions) {
    if (!this.instance) {
      return;
    }
    this.create(config);
  }


  /**
   * @description: 设置通用header
   */
  setHeader(headers: any): void {
    if (!this.instance) return;
    Object.assign(this.instance.defaults.headers, headers);
  }

  //获取真正url
  getUrl(url: string) {
    const { requestOptions } = this.options
    const { apiUrl, urlPrefix } = requestOptions!
    const isUrlStr = isUrl(url as string);
    //存在就会拼接
    if (!isUrlStr && urlPrefix) {
      url = `${urlPrefix}${url}`
    }
    if (!isUrlStr && apiUrl) {
      url = `${apiUrl}${url}`
    }
    return url
  }

  /**
    * @description: Interceptor configuration
    */
  setInterceptors() {
    const transform = this.getTransform()
    if (!transform) return;

    const {
      requestInterceptor,
      requestErrorInterceptor,
      responseInterceptor,
      responseErrorInterceptor,
    } = transform

    const canceler = new AxiosCanceler()

    // Request interceptor configuration
    //axios中AxiosRequestConfig类型和InternalAxiosRequestConfig类型中header定义不匹配
    // this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // If cancel repeat request is turned on, then cancel repeat request is prohibited
      const {
        //@ts-ignore
        headers: { ignoreCancelToken }
      } = config
      const ignoreCancel =
        ignoreCancelToken !== undefined
          ? ignoreCancelToken
          : this.options.requestOptions?.ignoreCancelToken;

      !ignoreCancel && canceler.addPending(config)
      if (requestInterceptor && isFunction(requestInterceptor)) {
        config = requestInterceptor(config, this.options);
      }
      return config
    },

      // 请求拦截器错误捕获
      requestErrorInterceptor &&
        isFunction(requestErrorInterceptor) ?
        requestErrorInterceptor : undefined
    );


    //响应结果拦截器处理
    this.instance.interceptors.response.use(
      (res: AxiosResponse<any>) => {
        res && canceler.removePending(res.config)
        if (responseInterceptor && isFunction(responseInterceptor)) {
          res = responseInterceptor(res);
        }
        return res;
      },

      // 响应结果拦截器错误捕获
      responseErrorInterceptor &&
        isFunction(responseErrorInterceptor) ?
        responseErrorInterceptor : undefined
    )

  }

  //文件表单
  postFormData<T = any>(config: AxiosRequestConfig, options?: RequestOptions) {
    let formData: FormData;
    if (config.data) {
      config.url = config.url ? this.getUrl(config.url) : ""
      formData = new window.FormData()
      Object.keys(config.data).forEach(key => {
        const value = config.data[key]
        if (Array.isArray(value)) {
          value.forEach(v => {
            formData.append(`${key}[]`, v)
          });
          return;
        }
        formData.append(key, value)
      })

      return this.instance.request<T>({
        ...config,
        method: 'POST',
        data: formData,
        headers: {
          'Content-type': ContentType.FORM_DATA,
          // @ts-ignore
          ignoreCancelToken: true,
        }
      })

    } else {
      return Promise.reject("config.data is not define")
    }
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams | FormData) {
    //url处理
    const { requestOptions } = this.options
    const { apiUrl, urlPrefix } = requestOptions!
    const isUrlStr = isUrl(config.url as string);
    //存在就会拼接
    if (!isUrlStr && urlPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }
    if (!isUrlStr && apiUrl) {
      config.url = `${apiUrl}${config.url}`
    }

    let formData: FormData;
    if (params instanceof FormData) {
      formData = params
    } else {
      //处理数据
      formData = new window.FormData()
      const fileKey = params.name || 'file'
      if (params.filename) {
        formData.append(fileKey, params.file, params.filename)
      } else {
        formData.append(fileKey, params.file);
      }

      if (params.data) {
        Object.keys(params.data).forEach(key => {
          const value = params.data![key]
          if (Array.isArray(value)) {
            value.forEach(v => {
              formData.append(`${key}[]`, v)
            });
            return;
          }
          formData.append(key, value)
        })
      }
    }

    return this.instance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentType.FORM_DATA,
        // @ts-ignore
        ignoreCancelToken: true,
      }
    })
  }


  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' }, options)
  }
  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' }, options);
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' }, options);
  }
  patch<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' }, options);
  }
  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' }, options);
  }


  /**
   * @description:   请求处理
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    const transform = this.getTransform()

    const { requestOptions } = this.options

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, transformResponseData } = transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }

    //这里重新 赋值成最新的配置
    // @ts-ignore
    conf.requestOptions = opt;

    return new Promise((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformResponseData && isFunction(transformResponseData)) {
            try {
              const ret = transformResponseData(res, opt);
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error) => {
          // if (requestCatch && isFunction(requestCatch)) {
          //   reject(requestCatch(e));
          //   return;
          // }
          reject(e);
        })
    })
  }
}