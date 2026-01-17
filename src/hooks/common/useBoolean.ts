/**
 * 加载状态
*/

// export default function useLoadState(initValue = false) {
//   const state = ref(initValue)

//   const startLoading = () => state.value = true

//   const endLoading = () => state.value = false

//   const toggle = () => state.value = !state.value

//   return {
//     loading: state,
//     startLoading,
//     endLoading,
//     toggle
//   }
// }


/**
 * boolean组合式函数
 * @param initValue 初始值
 */
export default function useBoolean(initValue = false) {
  const bool = ref(initValue);

  function setBool(value: boolean) {
    bool.value = value;
  }
  function setTrue() {
    setBool(true);
  }
  function setFalse() {
    setBool(false);
  }
  function toggle() {
    setBool(!bool.value);
  }

  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle
  };
}
