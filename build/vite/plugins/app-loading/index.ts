import fs from 'node:fs'
import fsp from 'node:fs/promises';
import path from 'node:path'
import process from 'node:process'
import url from 'node:url'
import type { PluginOption } from 'vite'

async function getAppLoadingHtml(filePath: string = 'loading.html'): Promise<string> {
  let appLoadingHtmlPath = path.join(process.cwd(), filePath)
  if (!fs.existsSync(appLoadingHtmlPath)) {
    appLoadingHtmlPath = url.fileURLToPath(new URL(filePath, import.meta.url))
  }
  return await fsp.readFile(appLoadingHtmlPath, 'utf8')
}

function appLoadingPlugin(
  isBuild: boolean,
  env: ImportMetaEnv,
  appLoadingHtmlPath?: string,
): PluginOption {

  //这里面无法使用store和env
  // const env = isBuild ? 'prod' : 'dev';
  const cacheName = `'${env.VITE_APP_NAMESPACE}-__THEME_SETTINGS__'`.toUpperCase()

  // 获取缓存的主题
  // 保证黑暗主题下，刷新页面时，loading也是黑暗主题
  const injectScript = `
  <script data-app-loading="inject-js">
  try {
    var theme = localStorage.getItem(${cacheName});
    if (theme) {
      var themeObj = JSON.parse(theme);
      var mode = themeObj.value ? themeObj.value.theme.mode : themeObj.theme.mode;
      if (mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      var color = themeObj.value ? themeObj.value.theme.themeColor : themeObj.theme.themeColor;
      if (color) {
        document.documentElement.style.setProperty('--primary-color', color);
      }
    }
  } catch (e) {
    console.error('Failed to parse theme setting:', e);
  }
  </script>
`;
  const virtualModuleId = 'virtual:app-loading'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  return {
    name: 'vite-plugin-app-loading',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return {
          code: `
            export function loadingFadeOut() {
              const loadingEl = document.querySelector('#__app-loading__')
              if (loadingEl) {
                loadingEl.style['pointer-events'] = 'none'
                loadingEl.style.visibility = 'hidden'
                loadingEl.style.opacity = 0
                loadingEl.style.transition = 'all 0.5s ease-out'
                loadingEl.addEventListener('transitionend', () => loadingEl.remove(), { once: true })
              }
            }
          `,
          map: null,
        }
      }
    },
    enforce: 'pre',
    transformIndexHtml: {
      handler: async html => html.replace(/<body\s*>/, `<body>${injectScript}${await getAppLoadingHtml(appLoadingHtmlPath)}`),
      order: 'pre',
    },
  }
}

export { appLoadingPlugin }