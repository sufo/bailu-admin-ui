
//在env.d.ts中加入 /// <reference types=“vite-plugin-pages/client” />来提供typescript支持
// /  <reference types="vite-plugin-pages/client" />


declare module '*.vue' {
  import type { DefineComponent, ComponentCustomProperties } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

//声明后 可以通过import导入json文件
declare module '*.json' {
  const value: any
  export default value
}
//声明后 可以通过import导入svg文件
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module 'vue-tel-input'


interface BetterScroll {
  instance: import('@better-scroll/core').BScrollInstance;
}


declare module 'unplugin-vue-define-options/vite' {
  const plugin: (options?: import('unplugin-vue-define-options/dist/unplugin.d-a8be3190').B) => import('vite').Plugin;

  export default plugin;
}

declare module 'vue-cropper'

// declare module 'axios' {
//   import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
//   export interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
//     headers?: AxiosRequestHeaders
//   }

// }

// declare module 'naive-ui' {
//   interface DropdownOption extends /*@vue-ignore*/ import('naive-ui').MenuOption{
//     permission?: string; //权限
//   }
// }


//Property 'forEach' does not exist on type 'FileList'.ts-plugin(2339)
interface FileList {
  forEach(callback: (f: File, index: number) => void): void;
}


//Could not find a declaration file for module 'quill-image-uploader
declare module 'quill-image-uploader'

declare module 'quill-blot-formatter/dist/BlotFormatter'