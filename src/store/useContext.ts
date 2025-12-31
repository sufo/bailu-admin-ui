import { CSS_PREFIX } from '@/constants/consts'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

export interface AppContext {
  prefixCls?: string,
  isMobile?: boolean,
  [x: string]: any,
}

/**
 * 保存全局上下文变量
 */
export const useContext = defineStore('app-context-store', ()=>{
  // 为了完整类型推理，推荐使用箭头函数
  // state: (): AppContext => ({
  //   namespace: import.meta.env.VITE_APP_NAMESPACE+__APP_INFO__.pkg.version
  //   prefixCls: CSS_PREFIX,
  //   isMobile: false,
  // }),
  const breakpoints = useBreakpoints(breakpointsTailwind);
  

  const prefixCls = ref(CSS_PREFIX)
  const isMobile = ref(breakpoints.smaller('sm'))

  const namespace = computed(()=>{
    const env = import.meta.env.PROD?'prod':'dev';
    return `${import.meta.env.VITE_APP_NAMESPACE}-${__APP_INFO__.pkg.version}-${env}`
  })


  const scopeCls = (scope: string) => `${prefixCls.value}-${scope}`
  
  const setMobile = (val:boolean)=> isMobile.value = val

  const setPrefixCls = (val: string) => prefixCls.value = val

  return {
    namespace,prefixCls,isMobile,
    scopeCls,setMobile,setPrefixCls,
  }
})