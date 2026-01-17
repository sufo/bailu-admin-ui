import type { App } from 'vue'

const omit = (obj: Recordable = {}, keys: Array<string | number>) => {
  const newObj = { ...obj };
  for (const key of keys) {
    delete newObj[key];
  }
  return newObj;
}

export function setupGlobalProperties(app: App<Element>) {
  app.config.globalProperties.$omit = omit
}