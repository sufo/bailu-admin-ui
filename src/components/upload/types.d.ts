import type { UploadProps as NaiveUploadProps,UploadFileInfo } from 'naive-ui';

export declare namespace Upload {

  interface Rule{
    name: string;
    type: string;
    color: string;
    exts: string[];
  }

  interface Options {
    prefixPath?: string;
    size?: number | string; //显示元素尺寸
    rules?: Rule[]
  }

  interface UploadProps extends NaiveUploadProps{
    //文件大小限制
    size?: number,
    options?: Options
  }
}