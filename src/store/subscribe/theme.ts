/*
 * 
 * @Desc: 
 */
import { usePreferenceStore } from "@/store/modules"
import type { GlobalThemeOverrides } from 'naive-ui'
import { kebabCase } from 'lodash-es'
import { useOsTheme } from 'naive-ui'
import { useContext } from "../useContext"
export default function subscribeThemeStore() {
  const preference = usePreferenceStore()
  const osTheme = useOsTheme()
  const scope = effectScope()
  const { isMobile } = storeToRefs(useContext())
  const { addDarkClass, removeDarkClass } = handleCssDarkMode()
  scope.run(
    () => {
      //监听naiveUI themeOverrides
      watch(
        () => preference.naiveThemeOverrides,
        newValue => {
          if (newValue.common) {
            addThemeCssVarsToHtml(newValue.common);
          }
        },
        { immediate: true }
      );

      //监听暗黑模式
      watch(
        () => preference.isDark,
        newValue => {
          newValue ? addDarkClass() : removeDarkClass()
        }, { immediate: true }
      );

      //监听灰色模式
      watch(
        () => preference.app.grayMode,
        newValue => {
          toggleClass(newValue, 'gray-mode', document.documentElement);
        }, { immediate: true }
      );
      //监听色若模式
      watch(
        () => preference.app.colorWeak,
        newValue => {
          toggleClass(newValue, 'color-weak', document.documentElement);
        }, { immediate: true }
      );

      // 监听操作系统主题模式
      watch(
        osTheme,
        newValue => {
          preference.setAutoFollowSystemMode(newValue);
        },
        { immediate: true }
      );

      //移动端就增加"mobile"
      watch(
        isMobile,
        newValue => {
          toggleClass(newValue, 'mobile', document.documentElement);
        }, { immediate: true }
      )
    }
  );
  onScopeDispose(() => { scope.stop })
}


/** css 暗黑模式 */
function handleCssDarkMode() {
  const DARK_CLASS = 'dark';
  function addDarkClass() {
    document.documentElement.classList.add(DARK_CLASS);
  }
  function removeDarkClass() {
    document.documentElement.classList.remove(DARK_CLASS);
  }
  return {
    addDarkClass,
    removeDarkClass
  };
}

export function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, '');
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

type ThemeVars = Exclude<GlobalThemeOverrides['common'], undefined>;
type ThemeVarsKeys = keyof ThemeVars;

/** 添加css vars至html 这样定义的css变量才能使用*/
function addThemeCssVarsToHtml(themeVars: ThemeVars) {
  const keys = Object.keys(themeVars) as ThemeVarsKeys[];
  const style: string[] = [];
  keys.forEach(key => {
    const color = themeVars[key];
    if (color) {
      style.push(`--${kebabCase(key)}: ${color}`);
    }
  });
  const styleStr = style.join(';');
  document.documentElement.style.cssText += styleStr;
}