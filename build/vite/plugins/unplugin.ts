/**
 * 非插件组件
 */
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
// import DefineOptions from 'unplugin-vue-define-options/dist/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
// import path from 'path'
// import { fileURLToPath } from 'url'
export default () => {
  return [

    //安装自动导入组件
    Components({
      // 配置需要默认导入的自定义组件文件夹，该文件夹下的所有组件都会自动 import
      //dirs: ['src/components'], 
      dts: true, // enabled by default if `typescript` is installed
      //配置naive ui 按需自动加载组件
      //注意，这种方法并不会处理函数 API，比如 useMessage，用户仍需要手动导入对应 API，例如 import { useMessage } from 'naive-ui'。
      resolvers: [NaiveUiResolver()],
    }),

    AutoImport({
      /* options */
      // dirs: [
      //   // './hooks',
      //   '@/composables'
      //   // ...
      // ],
      imports: [
        //对于一些常用的VueAPI，比如ref、computed、watch等，在页面上怒用手动进行import就可以直接使用了
        'vue',
        'vue-router',
        'pinia',

        'vue-i18n', // 新增
        // '@vueuse/head',
        // '@vueuse/core',
      ],
    }),

    //处理<script setup> name问题
    DefineOptions(),

    //unplugin-vue-i18n
    // VueI18nPlugin({ include: 'src/locales/**' }) // Internal server error: You need to define an object as the locale message with 'export default'.
    VueI18nPlugin({ include: 'src/locales/**.yaml' })
    //include: resolve(dirname(fileURLToPath(import.meta.url)), '../../../src/locales/**.yaml')
    // VueI18nPlugin({ include: path.resolve(__dirname, '../../../src/locales/**.yaml') })
  ]

}