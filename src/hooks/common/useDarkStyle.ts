
import usePreferenceStore from "@/store/modules/preference";


export function useDarkStyle(){
  const preference = usePreferenceStore()
  const useDarkWrapCls = (inverted?: boolean | undefined) => {
    inverted = (inverted === undefined) ? preference.isDark : inverted
    return [
      "dark:bg-dark dark:text-white dark:text-opacity-82 transition-all",
      inverted ? 'bg-dark text-white' : 'bg-white text-#333639'
    ].join(' ')
  }

  const darkWrapCls = computed(() => {
    return [
      "dark:bg-dark dark:text-white dark:text-opacity-82 transition-all",
      preference.isDark ? 'bg-dark text-white' : 'bg-white text-#333639'
    ].join(' ')
  })

  return {useDarkWrapCls, darkWrapCls}
} 




