/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-11 14:45:55
 * @Desc: 
 */
import type { App } from 'vue';
import VueEcharts from 'vue-echarts'
import { setupNaive } from './naive'
import { setupGlobalProperties } from './properties'

// export {setupNaive, setupGlobalProperties}

export function setupGlobalComp(app: App<Element>) {
  //naive ui from BaseForm 
  setupNaive(app);

  setupGlobalProperties(app)

  //vue-echarts
  app.component("v-chart", VueEcharts)

}