import type { Ref } from 'vue';
import { ref, onBeforeUpdate } from 'vue';

// export function useRefs(): [Ref<HTMLElement[]>, (index: number) => (el: HTMLElement) => void] {
//   const refs = ref([]) as Ref<HTMLElement[]>;

//   onBeforeUpdate(() => {
//     refs.value = [];
//   });

//   const setRefs = (index: number) => (el: HTMLElement) => {
//     refs.value[index] = el;
//   };

//   return [refs, setRefs];
// }


export function useRefs(): [Ref<{[key:string|number]:HTMLElement}>, (name: string|number) => (el: HTMLElement) => void] {
  const refs = ref<{[key:string|number]:HTMLElement}>({}) ;

  onBeforeUpdate(() => {
    refs.value = {};
  });

  const setRefs = (name: string|number) => (el: HTMLElement) => {
    refs.value[name] = el;
  };

  return [refs, setRefs];
}
