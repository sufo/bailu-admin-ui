import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'



export function configSvgIconPlugin(isBuild: boolean) {
  const svgIconPlugin = createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
    /**
     * svgo configuration, used to compress svg
     * @default：true
     */
    svgoOptions: isBuild,

    symbolId: 'icon-[dir]-[name]'
  })
  return svgIconPlugin;
}