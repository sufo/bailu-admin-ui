import { defineConfig, loadEnv } from 'vite'
//import path from 'path' //报错
import * as path from 'path'
import { fileURLToPath } from 'url'
import { modifyEnv } from './build/utils'
import { setupProxy } from './build/vite/proxy'
//tsconfig.json set "allowSyntheticDefaultImports": true,
import dayjs from 'dayjs'

//tsconfig.json set "resolveJsonModule": true,
import pkg from './package.json'
import { setupVitePlugins } from './build/vite/plugins'
// https://vitejs.dev/config/


const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

export default defineConfig(({ command, mode }) => {

  const root = process.cwd()

  const env = loadEnv(mode, root)

  const metaEnv = modifyEnv(env)

  const rootPath = fileURLToPath(new URL('./', import.meta.url))

  // const srcPath = `${rootPath}src`

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = metaEnv

  const isBuild = command === 'build'

  return {
    base: VITE_PUBLIC_PATH,
    root,
    // 别名设置
    resolve: {
      alias: {
        '~': rootPath,
        '@': path.resolve(__dirname, 'src'), // 把 @ 指向到 src 目录去
        '#': path.resolve(__dirname, 'types'),
      },
      //可以忽略后缀导入
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },

    server: {
      host: '0.0.0.0',
      port: VITE_PORT,
      hmr: true, //热更新
      proxy: setupProxy(VITE_PROXY),
      // open: true, // 在服务器启动时自动在浏览器中打开应用程序
      strictPort: false, // 设为 false 时，若端口已被占用则会尝试下一个可用端口,而不是直接退出
      cors: true, // 为开发服务器配置 CORS。默认启用并允许任何源
      watch: {
        ignored: ['**/auto-imports.d.ts', '**/components.d.ts']
      }
    },

    build: {
      sourcemap: !isBuild,
      // minify: 'terser',
      // terserOptions:{
      //   compress:{
      //     //keep_infinity (default: false) -- Pass true to prevent Infinity from being compressed into 1/0, which may cause performance issues on Chrome.
      //     keep_infinity:true,
      //     drop_console:VITE_DROP_CONSOLE,
      //     drop_debugger: command !== 'serve',
      //     warnings: false,
      //     pure_funcs: ['console.log']
      //   }
      // },
      // minify: 'esbuild',
      minify: 'esbuild',
      esbuild: {
        drop: VITE_DROP_CONSOLE ? ['console', 'debugger'] : ['debugger']
      },

      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              // 因为 node_modules 中的依赖通常是不会改变的
              // 所以直接单独打包出去
              // 这个return 的值就是打包的名称
              return "vendor"
            }
          }
        }
      },

      //deprecated
      // brotliSize:false
      //启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        //define global less variable
        // less: {
        //   javascriptEnabled: true,
        //   //存在重复引入的问题，所以放到了main.ts里面导入
        //   // additionalData: `@import (reference) "${path.resolve(__dirname, 'src/styles/index.less')}";`,
        //   additionalData: `@import (reference) "${path.resolve(__dirname, 'src/styles/var/index.less')}";`,
        //   // modifyVars: {
        //   //   hack: `true; @import (reference) "${path.resolve(__dirname, 'src/styles/index.less')}";`,
        //   // }
        // },
        scss: {
          api: 'modern-compiler',
          // additionalData: `@import "${path.resolve(__dirname, 'src/styles/var/index.scss')}";`,
          // additionalData: `@import "./src/styles/var/index.scss";`
          //解决@use rules must be written before any other rules
          //sass-loader 会根据 additionalData 选项，会在每个加载的 sass 文件之前添加 additionalData 的值。
          additionalData: `@use "@/styles/var/index.scss" as *;` //sass-loader v9.0.0 以前使用的是 prependData 属性。
        }
      },
    },
    plugins: setupVitePlugins(metaEnv, isBuild),
    optimizeDeps: {
      // include: ['@iconify/iconify'],
      exclude: ['vue-demi'],
    },
  }
})
