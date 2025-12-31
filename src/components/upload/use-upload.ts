// import { merge } from 'lodash-es'
// import {options} from './config'
import type {Upload} from './types'
// import { uploadApi } from '@/api/admin'
import { UploadFileParams } from '~/types/axios';
import type {AxiosRequestConfig} from 'axios'

export function useUpload(opts:Upload.UploadProps={}) {
   async function upload(params: UploadFileParams, config?: AxiosRequestConfig){
    // const {prefixPath} = merge(options, opts.options||{})

    // //后台获取上传模式(本地还是第三方)和类型（如果是第三方的话，是哪个平台）
    // // const {mode, type} = await ....
    // //TODO
    // const {model, type} = {model:'local',type:'local'}

    // if(model=='local'){
    //   return uploadApi(params, config)
    // }else{
    //   //TODO
    //   return Promise.resolve()
    // }
   }


   // 上传前
  // async function onBeforeUpload(file: any, item?: Upload.Item) {
  //   //上传
  //   if(opts.size){
  //     if (file.size / 1024 / 1024 >= opts.size) {
  //       window.$message?.error(`上传文件大小不能超过 ${opts.size}MB!`);
  //       return false;
  //     }
  //   }else{
  //     return true
  //   }
  // }

  return {
    upload
  }
}