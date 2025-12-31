import { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteImagemin from './imagemin'
import pwaPlugin from './pwa'
import visualizer from './visualizer'
import unocss from 'unocss/vite';
import compress from './compress'
import unplugins from './unplugin'
import htmlPlugin from './html'
// import pages from './pages'
// import VueI18n from '@intlify/vite-plugin-vue-i18n'
// import Layouts from 'vite-plugin-vue-layouts'
import { configSvgIconPlugin } from './svgSprite'
// import purgeIcons from 'vite-plugin-purge-icons'

import svgLoader from 'vite-svg-loader'
import {appLoadingPlugin } from './app-loading'


export function setupVitePlugins(metaEnv: ImportMetaEnv, isBuild: boolean): PluginOption[] {
  const {
    VITE_USE_IMAGEMIN,
    // VITE_USE_MOCK,
    VITE_VISUALIZER,
  } = metaEnv;

  const vitePlugins: PluginOption[]= [
    //提供 Vue 3 单文件组件支持
    //vue()
    vue({
      //处理全局类型，defineProps无法使用问题
      //unresolvable type reference or unsupported built-in utility type
      script:{
        globalTypeFiles: [
          './types/bussiness.d.ts',
          './types/model.d.ts',
        ]
      }
    }),
    //提供 Vue 3 JSX 支持（通过 专用的 Babel 转换插件）
    vueJsx(),

    // support name 支持<script name> 但存在调试时，断点位置错乱问题
    // vueSetupExtend(),
    //暂时使用unplugin-vue-define-options替代


    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    // VueI18n({
    //   runtimeOnly: true,
    //   compositionOnly: true,
    //   // include: [path.resolve("locales/**")]
    //   include: [path.resolve(process.cwd(), "src/locales/lang/**")]
    // }),
    //使用@intlify/unplugin-vue-i18n代替@intlify/vite-plugin-vue-i18n

  ];
  //unocss 
  // https://github.com/antfu/unocss
  // see unocss.config.ts for config
  vitePlugins.push(unocss());

  //配置unplugin
  vitePlugins.push(...unplugins());


  /**能力有限，下面两个用起来不顺手，还是手动配置路由 */
  //自动路由
  // vitePlugins.push(pages);

  //基础布局
  // vitePlugins.push(Layouts({ defaultLayout: 'index' }));

  //app loading插件， 一定要放在htmlPlugin之前
  vitePlugins.push(appLoadingPlugin(isBuild,metaEnv))

  //HMR 一般用在测试环境
  // !isBuild && vitePlugins.push(hmrPlugin());

  // vite-plugin-html
  vitePlugins.push(htmlPlugin(metaEnv, isBuild));

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconPlugin(isBuild))

  // @vitejs/plugin-legacy
  // VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-mock
  // VITE_USE_MOCK && vitePlugins.push(mockPlugin(isBuild));

  // deprecated
  // vite-plugin-purge-icons
  // vitePlugins.push(purgeIcons());

  //svg组件化支持
  vitePlugins.push(svgLoader());

  // The following plugins only work in the production environment
  if (isBuild) {
    //vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(viteImagemin);

    // rollup-plugin-gzip
    vitePlugins.push(compress(metaEnv));

    // vite-plugin-pwa
    vitePlugins.push(pwaPlugin(metaEnv));
  }

  //打包分析
  if (VITE_VISUALIZER) {
    vitePlugins.push(visualizer as PluginOption);
  }

  return vitePlugins
}
