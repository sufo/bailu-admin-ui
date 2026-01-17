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