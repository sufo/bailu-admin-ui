import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default (viteEnv: ImportMetaEnv, isBuild: boolean): PluginOption[] => {
  return createHtmlPlugin({
    minify: isBuild,
    // viteNext: true,
    inject: {
      // Inject data into ejs template
      data: {
        title: viteEnv.VITE_APP_TITLE,
      },
      // Embed the generated app.config.js file
      // tags: isBuild
      //   ? [
      //     {
      //       tag: 'script',
      //       attrs: {
      //         //src: ,
      //       },
      //     },
      //   ]
      //   : [],
    },

  })
}