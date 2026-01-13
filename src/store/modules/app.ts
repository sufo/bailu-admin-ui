/*
 * @Desc: 当前应用状态
 */
import { nextTick } from 'vue';
import { defineStore } from 'pinia';
import { SCROLL_ID } from '@/constants/consts'
interface AppState {
  /** 滚动元素的id */
  scrollId: string;
  /** 功能同F11 */
  isFullScreen: boolean;
  /**内容全屏 */
  fullContent: boolean;
  /** 禁用主体内容的水平方向的滚动 */
  disableMainXScroll: boolean;
  /** 重载页面(控制页面的显示) */
  reloadFlag: boolean;
  /** 项目配置的抽屉可见状态 */
  settingDrawerVisible: boolean;
  /** 侧边栏折叠状态 */
  siderCollapse: boolean;  //true: 折叠
  /** vertical-mix模式下 侧边栏的固定状态 */
  /**固定展开菜单 */
  mixSiderFixed: boolean;
}

export const useAppStore = defineStore('app-state-store', {
  //为了完整类型推理，推荐使用箭头函数
  state: (): AppState => ({
    scrollId: SCROLL_ID,
    isFullScreen: false,
    fullContent: false,
    disableMainXScroll: false,
    reloadFlag: true,
    settingDrawerVisible: false,
    siderCollapse: false,
    mixSiderFixed: false
  }),
  actions: {

    /**
     * 获取滚动配置
     */
    getScrollConfig() {
      const scrollEle = document.querySelector(`#${this.scrollId}`);

      const { scrollLeft = 0, scrollTop = 0 } = scrollEle || {};
      return {
        scrollEle,
        scrollLeft,
        scrollTop
      };
    },

    /**
     * 重载页面
     * @param duration - 重载的延迟时间(ms)
     */
    async reloadPage(duration = 0) {
      this.reloadFlag = false;
      await nextTick();
      if (duration) {
        setTimeout(() => {
          this.reloadFlag = true;
        }, duration);
      } else {
        this.reloadFlag = true;
      }
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 });
      }, 100);
    },
    /** 打开设置抽屉 */
    openSettingDrawer() {
      this.settingDrawerVisible = true;
    },
    /** 关闭设置抽屉 */
    closeSettingDrawer() {
      this.settingDrawerVisible = false;
    },
    /** 切换抽屉可见状态 */
    toggleSettingDrawerVisible() {
      this.settingDrawerVisible = !this.settingDrawerVisible;
    },
    /** 设置侧边栏折叠状态 */
    setSiderCollapse(collapse: boolean) {
      this.siderCollapse = collapse;
    },
    /** 折叠/展开 侧边栏折叠状态 */
    toggleSiderCollapse() {
      this.siderCollapse = !this.siderCollapse;
    },
    /** 设置 vertical-mix模式下 侧边栏的固定状态 */
    setMixSiderIsFixed(isFixed: boolean) {
      this.mixSiderFixed = isFixed;
    },
    /** 设置 vertical-mix模式下 侧边栏的固定状态 */
    toggleMixSiderFixed() {
      this.mixSiderFixed = !this.mixSiderFixed;
    },
    /** 设置主体是否禁用滚动 */
    setDisableMainXScroll(disable: boolean) {
      this.disableMainXScroll = disable;
    },
    /** 设置全屏 */
    setFullScreen(fullScreen: boolean) {
      this.isFullScreen = fullScreen
    },
    /** 设置内容全屏 */
    setContentFull(full: boolean) {
      this.fullContent = full;
    }
  }
});


