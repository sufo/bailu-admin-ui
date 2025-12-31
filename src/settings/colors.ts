import colorJson from './colors.json'


interface TraditionColorDetail {
  name: string;
  hex: string;
}
interface TraditionColor {
  name: string;
  colors: TraditionColorDetail[];
}

/** 中国传统颜色 */
export const traditionColors = colorJson as TraditionColor[];

export function isInTraditionColors(color: string) {
  return traditionColors.some(item => {
    const flag = item.colors.some(v => v.hex === color);
    return flag;
  });
}