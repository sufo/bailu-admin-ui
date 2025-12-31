//引入css
// import 'virtual:uno.css'
import 'uno.css'
// import '@/styles/index.less'
import '@/styles/index.css'
import { createApp } from 'vue'
// import BootLoading from '@/components/common/BootLoading.vue'
import App from './App.vue'
import { setupStore } from './store'
// Register icon sprite
import 'virtual:svg-icons-register'
import { setupRouter } from './router'
import { setupDirectives } from '@/directives'
import { setupI18n } from "@/locales/i18n"
import { setupAxios } from '@/http'
//VueTelInput
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css';
import { setupGlobalComp } from './plugins'
import { loadingFadeOut } from 'virtual:app-loading'

async function bootstrap() {

  //应用启动进度动画,初始化--primary-color
  // const appLoading = createApp(BootLoading);
  // appLoading.mount("#app")

  const app = createApp(App);
  // Configure store
  setupStore(app);

  setupI18n(app);

  //路由和路由守卫
  await setupRouter(app);

  //configura directive
  setupDirectives(app);

  setupAxios(app);

  setupGlobalComp(app);

  // appLoading.unmount();
  app.use(VueTelInput).mount('#app');
  loadingFadeOut()
}

bootstrap()

// function getYaml() {
//   let x = Object.entries(import.meta.globEager("./locales/lang/*.y(a)?ml"))
//   console.log(x)
// }

// import parseIcon from '@/components/icon/data/parse'
// parseIcon()
