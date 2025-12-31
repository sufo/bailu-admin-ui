/*
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-11 17:33:55
 * @Desc: 
 */

/**
 * 
 *  主要解决defineProps无法使用导入类型的问题
 * 
 */
// export const iconProps = {
//   // icon name
//   name: {
//     type: String,
//     required: true,  //运行时校验
//   },
//   // icon color
//   color: String,
//   // icon size
//   size: {
//     type: [String, Number] as PropType<string | number>,
//     default: 16,
//   },
//   spin: {
//     type: Boolean as PropType<boolean>,
//     default: false
//   },
//   prefix: {
//     type: String as PropType<string>,
//     default: 'i-'  //Unocss preset icon default prefix
//   },
//   title:{
//     type: String as PropType<string>,
//     default: ''
//   }
// }
// export type IconProps = ExtractPublicPropTypes<typeof iconProps>


import { IconProps as IconifyIconProps } from '@iconify/vue'
import { CSSProperties } from 'vue';

export type IconProps = Omit<IconifyIconProps, 'style'> & {
  spin?: boolean;
  prefix?: string;
  title?: string;
  style?: string | CSSProperties;
  size?: string | number;
}