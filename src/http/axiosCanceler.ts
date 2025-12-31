import { AxiosRequestConfig, Canceler } from 'axios'
import { isFunction } from '@/utils/util'
import axios from 'axios'
import qs from 'qs'

export const getPendingUrl = (config: AxiosRequestConfig) =>
  [config.method, config.url, qs.stringify(config.data), qs.stringify(config.params)].join('&');

/**
 * 取消请求
 */
export class AxiosCanceler {

  pendingMap?: Map<string, Canceler>;
  static _instance?: AxiosCanceler;

  constructor() {
    this.pendingMap = new Map<string, Canceler>()
  }

  //静态方法
  static getInstance(): AxiosCanceler {
    if (!AxiosCanceler._instance) {
      AxiosCanceler._instance = new AxiosCanceler();
    }
    return AxiosCanceler._instance;
  }
  /**
 * Add request
 * @param {Object} config
 */
  addPending(config: AxiosRequestConfig) {
    //先移除
    this.removePending(config);

    const url = getPendingUrl(config)

    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
      if (!this.pendingMap?.has(url)) {
        // If there is no current request in pending, add it
        this.pendingMap?.set(url, cancel);
      }
    })
  }

  removeAllPending() {
    this.pendingMap?.forEach(cancel => {
      cancel && isFunction(cancel) && cancel()
    });
    this.pendingMap?.clear()
  }

  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);
    if (this.pendingMap?.has(url)) {
      const cancel = this.pendingMap?.get(url)
      cancel && cancel(url);
      this.pendingMap.delete(url);
    }
  }

  reset() {
    this.pendingMap = new Map<string, Canceler>();
  }
}