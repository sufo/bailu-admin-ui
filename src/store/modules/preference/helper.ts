import storage from "@/utils/storage";
import { ThemeCacheKey } from "@/constants/enum"
import settings from '@/settings/projectSetting'
import { cloneDeep } from 'lodash-es'
import { GlobalThemeOverrides } from "naive-ui";
import { addColorAlpha, getColorPalette } from "@/utils/color";



/** 初始化主题配置 */
export function initThemeSetting() {
  const isProd = import.meta.env.PROD
  // 生产环境才缓存主题配置，本地开发实时调整配置更改配置的json
  const storageSetting = getThemeSettings()
  if (isProd && storageSetting) {
    return storageSetting
  }
  const themeColor = storage.get<string>(ThemeCacheKey.THEME_COLOR, settings.theme.themeColor) as string

  const setting = cloneDeep({ ...settings, themeColor })
  // Object.assign(setting, { isMobile: false })
  return setting
}



type ColorType = 'primary' | 'info' | 'success' | 'warning' | 'error';
type ColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active';
type ColorKey = `${ColorType}Color${ColorScene}`;
type ThemeColor = Partial<Record<ColorKey, string>>;

interface ColorAction {
  scene: ColorScene;
  handler: (color: string) => string;
}

/** 获取主题颜色的各种场景对应的颜色 */
export function getThemeColors(colors: [ColorType, string][]) {
  const colorActions: ColorAction[] = [
    { scene: '', handler: color => color },
    { scene: 'Suppl', handler: color => color },
    { scene: 'Hover', handler: color => getColorPalette(color, 5) },
    { scene: 'Pressed', handler: color => getColorPalette(color, 7) },
    { scene: 'Active', handler: color => addColorAlpha(color, 0.1) }
  ]

  const themeColor: ThemeColor = {}
  colors.forEach(color => {
    colorActions.forEach(action => {
      const [colorType, colorValue] = color;
      const colorKey: ColorKey = `${colorType}Color${action.scene}`
      themeColor[colorKey] = action.handler(colorValue)
    })
  })

  return themeColor
}

/** 获取naive的主题颜色 */
export function getNaiveThemeOverrides(colors: Record<ColorType, string>): GlobalThemeOverrides {
  const { primary, info, success, warning, error } = colors

  const themeColors = getThemeColors([
    ['primary', primary],
    ['info', info],
    ["success", success],
    ['warning', warning],
    ["error", error]
  ])

  const colorLoading = primary

  return {
    common: {
      ...themeColors
    },
    LoadingBar: {
      colorLoading
    }
  }
}

/** 获取缓存中的主题配置 */
export function getThemeSettings() {
  return storage.get<Settings>(ThemeCacheKey.THEME_SETTINGS, null, false);
}

/** 获取缓存中的主题配置 */
export function setThemeSettings(settings: Settings) {
  return storage.set(ThemeCacheKey.THEME_SETTINGS, settings, null, false);
}

/** 清除缓存配置 */
export function clearThemeSettings() {
  storage.remove(ThemeCacheKey.THEME_SETTINGS);
}

