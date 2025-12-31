/**
 * env环境类型
 * - dev: 后台开发环境
 * - test: 后台测试环境
 * - prod: 后台生产环境
 */
type EvnMode = 'dev' | 'test' | 'prod'

/**env环境配置 */
interface EnvConfig {
  /** 请求地址 */
  url: string
  /** 代理地址 */
  proxy: string
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESC: string
  readonly VITE_APP_NAMESPACE: string
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_USE_PWA: boolean
  readonly VITE_PORT: number
  readonly VITE_API_URL_PREFIX?: string
  readonly VITE_UPLOAD_URL?: string
  /** vite环境类型 */
  readonly ENV_MODE?: EvnMode
  /** 开启请求代理 */
  // readonly VITE_HTTP_PROXY?: boolean
  //代理
  readonly VITE_PROXY?: [string, string][]

  /**是否开启图片压缩 */
  readonly VITE_USE_IMAGEMIN?: boolean

  /** 是否开启打包文件大小结果分析 */
  readonly VITE_VISUALIZER?: boolean

  /** 打包压缩 */
  readonly VITE_BUILD_COMPRESS?: 'none' | 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
  /**压缩是否删除源文件 */
  readonly VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE?: boolean

  /** hash路由模式 */
  readonly VITE_HASH_ROUTE?:boolean
  
  /**菜单权限模式 STATIC 前端固定路由  DYNAMIC 动态获取 */
  readonly VITE_PERMISSION_MODE: 'STATIC' | 'DYNAMIC'

  readonly VITE_DROP_CONSOLE?: boolean
  /**mock */
  readonly VITE_USE_MOCK: boolean;
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
