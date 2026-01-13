

import { AxiosRequestConfig, AxiosResponse } from 'axios'
// import {table,apiSetting} from '@/settings/apiSetting'
// import { InternalAxiosRequestConfig } from 'axios'


export declare interface CreateAxiosOptions extends AxiosRequestConfig {
  // export interface CreateAxiosOptions extends InternalAxiosRequestConfig {
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
  authenticationScheme?: string;
}

export declare interface AxiosTransform {
  /**
   * @description: 请求之前处理配置
   * @description: Process configuration before request
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;
  // beforeRequestHook?: (config: InternalAxiosRequestConfig, options: RequestOptions) => InternalAxiosRequestConfig;

  /**
   * @description: 响应数据处理
   */
  transformResponseData?: (res: AxiosResponse<Result<T>>, options: RequestOptions) => any


  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptor?: (
    config: InternalAxiosRequestConfig,
    options: CreateAxiosOptions,
  ) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestErrorInterceptor?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptor?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
     * @description: 请求之后的拦截器错误处理
     */
  responseErrorInterceptor?: (error: Error) => void;


}

export declare type ErrMsgMode = 'none' | 'modal' | 'message' | undefined;

export declare interface RequestOptions {
  // Splicing request parameters to url
  joinParamsToUrl?: boolean;

  // Whether to process the request result
  isTransformResponse?: boolean;
  // 不做任何处理直接返回响应
  isReturnNativeResponse?: boolean;

  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string;
  // 请求拼接路径
  urlPrefix?: string;

  //success message mode
  //none: 不显示 msg
  successMsgMode?: ErrMsgMode;

  //自定义提示信息
  successMsgText?: string;

  errorMsgText?: string

  // Error message prompt type
  // errorMsgMode?: 'modal' | 'message' | 'none';
  errorMsgMode?: ErrMsgMode
  // Whether to add a timestamp
  joinTime?: boolean;
  //忽略重复请求
  ignoreCancelToken?: boolean;
  // Whether to send token in header
  withToken?: boolean;
}

// multipart/form-data: upload file
export declare interface UploadFileParams {
  // Other parameters
  data?: Recordable;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}

export declare type ResultType<T = any> = Result<T> | T


// export interface Result<T = any> {
//   code: number;
//   type?: 'success' | 'error' | 'warning';
//   msg: string;
//   data: T;
// }

// export interface Result<T = any> {
//   [apiSetting.code]: number;
//   [apiSetting.type]?: 'success' | 'error' | 'warning';
//   [apiSetting.msg]: string;
//   [apiSetting.data]: T;
// }

export declare interface Result<T = any> {
  [key: string]: string | number | T
}

// export interface PagesResult<T = any> extends Result {
//   [apiSetting.data]: {
//     [table.pageField]?: number,
//     [table.sizeField]?: number,
//     [table.countField]: number,
//     [table.listField]: T[]
//   }
// }
