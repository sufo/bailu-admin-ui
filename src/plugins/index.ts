/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-11
 * @Desc: 
 */
import type { App } from 'vue';
import VueEcharts from 'vue-echarts'
import { setupDayjs } from './dayjs';
import { setupNaive } from './naive'
import { setupGlobalProperties } from './properties'

// export {setupNaive, setupGlobalProperties}

export function setupGlobalComp(app: App<Element>) {
  setupDayjs();
  //naive ui from BaseForm 
  setupNaive(app);

  setupGlobalProperties(app)

  //vue-echarts
  app.component("v-chart", VueEcharts)

}