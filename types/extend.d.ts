//该文件需要包含至少一个顶级的 import 或 export，即使它只是 export {}。如果扩展被放在模块之外，它将覆盖原始类型，而不是扩展!
export { }

//[扩展全局属性](https://cn.vuejs.org/guide/typescript/options-api#augmenting-global-properties)
declare module 'vue' {
  //解决全局变量或者函数报错问题
  interface ComponentCustomProperties {
    $omit: (obj?: Recordable, keys: Array<string | number>) => Recordable,
  }
}