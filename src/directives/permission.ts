import type { App, Directive } from 'vue';
import { usePermission } from '@/hooks/business/usePermission'


/**
 * 用法
 * v-permission="{value:'sys:menu:list'}", 
 * v-permission="{value:['xxxx', 'xxxx]}"
 * v-permission="{value:['xxxx', 'xxxx], effect:'disabled'}"
 */

export default function setupPermissionDirective(app: App) {

  function isAuth(el: Element, binding: any) {
    const { hasPermission } = usePermission();

    const { value, effect } = binding.value;
    if (!value) {
      throw new Error(`need permission: like v-permission="{value:'sys:menu:list'}", v-permission="{value:['xxxx', 'xxxx]}"`);
    }

    if (!hasPermission(value)) {
      if (effect == 'disabled' && el.tagName.toUpperCase() === 'BUTTON') {
        const btn = el as HTMLButtonElement
        btn.disabled = true;
        btn.setAttribute('disabled', 'disabled');
        el.classList.add('n-button--disabled');
      } else {
        // el.remove();
        el.parentNode?.removeChild(el);
      }
    }
  }

  const permissionDirective: Directive = {
    mounted(el, binding) {
      // isAuth(el, binding.value);
      isAuth(el, binding);
    },
    beforeUpdate(el, binding) {
      isAuth(el, binding);
    }
  };

  app.directive('permission', permissionDirective);
}
