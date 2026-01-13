/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-06 11:12:11
 * @Desc: 
 */
import type { App } from 'vue'
import { createPinia } from 'pinia'

const store = createPinia()

export function setupStore(app: App<Element>) {
  app.use(store)
}

export { store };
//存在循环导入
// export * from './modules';
