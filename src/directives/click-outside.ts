import type { App, Directive } from "vue";

export default function setClickOutsideDirective(app: App){

  const clickOutsideDirective: Directive<HTMLElement&{clickOutsideEvent:(e:Event)=>void}, (e:Event)=>void |undefined> = {
    mounted: function (el, binding, vnode) {
      el.clickOutsideEvent = function (event) {
        // here I check that click was outside the el and his children
        if (!(el == event.target || el.contains(event.target as Node))) {
          // and if it did, call method provided in attribute value
          binding.value(event)
        }
        
      };
      document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted: function (el) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
    },
  }
  app.directive('click-outside',clickOutsideDirective)
}