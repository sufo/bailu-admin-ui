import type { App, Directive } from "vue";
import { i18n } from '@/locales/i18n'


export default function setupNetworkDirective(app: App) {
  function listenHandler(event: MouseEvent) {
    const hasNetwork = window.navigator.onLine;
    if (!hasNetwork) {
      window.$message?.error(i18n.global.t("api.networkException"))
      event.stopPropagation()
    }
  }

  const networkDirective: Directive<HTMLElement, boolean | undefined> = {
    mounted(el: HTMLElement, binding) {
      if (binding.value === false) return;
      el.addEventListener('click', listenHandler, { capture: true })
    },
    unmounted(el: HTMLElement, binding) {
      if (binding.value === false) return;
      el.removeEventListener('click', listenHandler);
    }
  }
  app.directive("network", networkDirective)
}


