/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2023-11-06 15:12:03
 * @Desc: 
 */
export * from './src/types'
import { IconProps } from './src/types'
import Icon from './src/Icon.vue'
import SvgIcon from './src/SvgIcon.vue'
import IconPicker from './src/IconPicker.vue';
import { isString } from '@/utils/util';

/**
 * 图标渲染
 * - 用于vue的render函数
 */
const useIconRender = () => {
  /**
   * 图标渲染
   */
  const iconRender = (config: IconProps | string) => {
    isString(config) && (config = { icon: config })
    return () => h(Icon, config);
  };

  return {
    iconRender,
    r: iconRender
  };
};


export { Icon, SvgIcon, IconPicker, useIconRender }