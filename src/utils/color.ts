import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import type { HsvColor } from 'colord';
import type { RgbColor } from 'colord';
// import { getThemeColors } from '@/store/modules/preference/helper';

extend([mixPlugin]);

type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const hueStep = 2;
const saturationStep = 16;
const saturationStep2 = 5;
const brightnessStep1 = 5;
const brightnessStep2 = 15;
const lightColorCount = 5;
const darkColorCount = 4;
/**
 * 根据颜色获取调色板颜色(从左至右颜色从浅到深，6为主色号)
 * @param color - 颜色
 * @param index - 调色板的对应的色号(6为主色号)
 * @description 算法实现从ant-design调色板算法中copy https://github.com/ant-design/ant-design/blob/master/components/style/color/colorPalette.less
 */
export function getColorPalette(color: string, index: ColorIndex) {
  if (index === 6) return color;

  const isLight = index < 6;
  const hsv = colord(color).toHsv()
  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1

  const newHsv = {
    h: getHue(hsv, i, isLight),
    s: getSaturation(hsv, i, isLight),
    v: getValue(hsv, i, isLight)
  }
  return colord(newHsv).toHex();
}

/**
 * 获取色相渐变
 * @param hsv - hsv格式颜色值
 * @param i - 与6的相对距离
 * @param isLight - 是否是亮颜色
 */
function getHue(hsv: HsvColor, i: number, isLight: boolean) {
  let hue: number;
  if (hsv.h >= 60 && hsv.h <= 240) {
    // 冷色调
    // 减淡变亮 色相顺时针旋转 更暖
    // 加深变暗 色相逆时针旋转 更冷
    hue = isLight ? hsv.h - hueStep * i : hsv.h + hueStep * i;
  } else {
    // 暖色调
    // 减淡变亮 色相逆时针旋转 更暖
    // 加深变暗 色相顺时针旋转 更冷
    hue = isLight ? hsv.h + hueStep * i : hsv.h - hueStep * i;
  }

  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}


/**
 * 获取饱和度渐变
 * @param hsv - hsv格式颜色值
 * @param i - 与6的相对距离
 * @param isLight - 是否是亮颜色
 */
function getSaturation(hsv: HsvColor, i: number, isLight: boolean) {
  let saturation: number;
  if (isLight) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }

  if (saturation > 100) {
    saturation = 100
  }

  if (isLight && i === lightColorCount && saturation > 10) {
    saturation = 10
  }

  if (saturation < 6) {
    saturation = 6;
  }
  return saturation;
}

/**
 * 获取明度渐变
 * @param hsv - hsv格式颜色值
 * @param i - 与6的相对距离
 * @param isLight - 是否是亮颜色
 */
function getValue(hsv: HsvColor, i: number, isLight: boolean) {
  let value: number;
  if (isLight) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }
  if (value > 100) {
    value = 100;
  }
  return value;
}


/**
 * 给颜色加透明度
 * @param color - 颜色
 * @param alpha - 透明度(0 - 1)
 */
export function addColorAlpha(color: string, alpha: number) {
  return colord(color).alpha(alpha).toHex();
}

/**
 * 颜色混合
 * @param firstColor - 第一个颜色
 * @param secondColor - 第二个颜色
 * @param ratio - 第二个颜色占比
 */
export function mixColor(firstColor: string, secondColor: string, ratio: number) {
  return colord(firstColor).mix(secondColor, ratio).toHex();
}

/**
 * 是否是白颜色
 * @param color - 颜色
 */
export function isWhiteColor(color: string) {
  return colord(color).isEqual('#ffffff');
}

/**
 *	获取颜色的rgb值
 * @param color 颜色
 */
export function toRgbOfColor(color: string) {
  return colord(color).toRgb();
}


/**
 * 将带有透明度的颜色转换成相近的没有透明度的颜色
 * @param color - 颜色
 * @param alpha - 透明度(0 - 1)
 * @param bgColor 背景颜色(一般是白色或者黑色)
 */
export function transformColorWithOpacity(color: string, alpha: number, bgColor = '#ffffff') {
  const originColor = addColorAlpha(color, alpha);
  const { r: oR, g: oG, b: oB } = colord(originColor).toRgb();

  const { r: bgR, g: bgG, b: bgB } = colord(bgColor).toRgb();

  function calRgb(or: number, bg: number, al: number) {
    return bg + (or - bg) * al;
  }

  const resultRgb: RgbColor = {
    r: calRgb(oR, bgR, alpha),
    g: calRgb(oG, bgG, alpha),
    b: calRgb(oB, bgB, alpha)
  };

  return colord(resultRgb).toHex();
}


export interface ThemeColors {
  border: string,
  input: string,
  ring: string,
  background: string,
  foreground: string,
  primary: {
    DEFAULT: string,
    foreground: string,
  },
  secondary: {
    DEFAULT: string,
    foreground: string,
  },
  destructive: {
    DEFAULT: string,
    foreground: string,
  },
  muted: {
    DEFAULT: string,
    foreground: string,
  },
  accent: {
    DEFAULT: string,
    foreground: string,
  },
  popover: {
    DEFAULT: string,
    foreground: string,
  },
  card: {
    DEFAULT: string,
    foreground: string,
  },
}

/**
 * Generates a theme palette based on a primary HSL color.
 * Inspired by shadcn/ui color system structure.
 *
 * @param {number} hue - The hue of the primary color (0-360).
 * @param {number} saturation - The saturation of the primary color (0-100).
 * @param {number} lightness - The lightness of the primary color (0-100).
 * @returns {object} An object containing light and dark theme palettes.
 *                   Returns null if input is invalid.
 */
// export function generateThemePalette(hue:number, saturation:number, lightness:number) {
//   // Basic Input Validation
//   if (
//     typeof hue !== 'number' || hue < 0 || hue > 360 ||
//     typeof saturation !== 'number' || saturation < 0 || saturation > 100 ||
//     typeof lightness !== 'number' || lightness < 0 || lightness > 100
//   ) {
//     console.error("Invalid HSL input. Hue: 0-360, Saturation/Lightness: 0-100.");
//     return null;
//   }

//   // --- Helper Functions ---
//   const clamp = (val:number, min = 0, max = 100) => Math.max(min, Math.min(val, max));
//   const formatHsl = (h:number, s:number, l:number) => `${h.toFixed(1)} ${clamp(s).toFixed(1)}% ${clamp(l).toFixed(1)}%`;

//   // --- Color Definitions ---

//   // ** Destructive colors (usually kept consistent - red) **
//   const destructiveLight = "0 84.2% 60.2%";
//   const destructiveLightFg = "0 0% 98%";
//   const destructiveDark = "0 62.8% 30.6%";
//   const destructiveDarkFg = "0 0% 98%"; // Often same as light

//   // ** Generate Light Mode Palette **
//   const light = {} as ThemeColors;

//   // Base primary
//   light.primary.DEFAULT = formatHsl(hue, saturation, lightness);

//   // Primary Foreground: High contrast to primary. Dark if primary is light, light if primary is dark.
//   // Simple heuristic: if primary lightness > 50, use dark text, else light text.
//   light.primaryForeground = lightness > 55
//     ? formatHsl(hue, clamp(saturation * 0.8, 10), clamp(lightness * 0.15, 0, 20)) // Darker text
//     : formatHsl(hue, clamp(saturation * 0.8, 10), 98); // Lighter text (near white)

//   // Background: Usually white or very light with a *very* subtle tint
//   light.background = formatHsl(hue, clamp(saturation * 0.1, 5, 20), 99); // Very light, low saturation
//   // Alternative: Pure white: "0 0% 100%"

//   // Foreground: Dark, readable text, subtly tinted
//   light.foreground = formatHsl(hue, clamp(saturation * 0.15, 10, 30), 5); // Very dark, low saturation

//   // Card/Popover: Often same as background, or pure white for distinct cards
//   light.card = formatHsl(0, 0, 100); // Pure white card
//   light.popover = formatHsl(0, 0, 100); // Pure white popover
//   light.cardForeground = light.foreground; // Use main foreground text
//   light.popoverForeground = light.foreground;

//   // Secondary: Slightly darker than background, used for subtle containers/elements
//   light.secondary = formatHsl(hue, clamp(saturation * 0.1, 5, 15), 96); // Very light gray tint
//   light.secondaryForeground = formatHsl(hue, clamp(saturation * 0.1, 10, 25), 25); // Darker gray text

//   // Muted: Similar to secondary, often for less important text/elements
//   light.muted = light.secondary;
//   light.mutedForeground = formatHsl(hue, clamp(saturation * 0.1, 10, 20), 45); // Lighter gray text than secondary FG

//   // Accent: Often derived from primary, can be slightly brighter or different saturation
//   light.accent = formatHsl(hue, clamp(saturation * 1.1, 0, 100), clamp(lightness * 0.95, 0, 95)); // Slightly adjusted primary
//   light.accentForeground = lightness > 55 // Match contrast logic of primary foreground
//      ? formatHsl(hue, clamp(saturation * 0.8, 10), clamp(lightness * 0.15, 0, 20))
//      : formatHsl(hue, clamp(saturation * 0.8, 10), 98);

//   // Border/Input: Very light gray, subtly tinted
//   light.border = formatHsl(hue, clamp(saturation * 0.1, 10, 25), 90);
//   light.input = formatHsl(hue, clamp(saturation * 0.1, 10, 25), 91); // Slightly different for inputs if needed

//   // Ring: Focus ring, often related to primary but needs visibility
//   light.ring = formatHsl(hue, saturation, clamp(lightness * 1.1, 40, 70)); // Brighter/Mid-tone version

//   // Destructive
//   light.destructive = destructiveLight;
//   light.destructiveForeground = destructiveLightFg;


//   // ** Generate Dark Mode Palette (Invert & Adjust) **
//   const dark = {};

//   // Background: Very dark, subtle tint
//   dark.background = formatHsl(hue, clamp(saturation * 0.1, 5, 15), 5); // Very dark

//   // Foreground: Very light, readable text, subtle tint
//   dark.foreground = formatHsl(hue, clamp(saturation * 0.1, 5, 15), 98); // Near white

//   // Card/Popover: Usually same as background in dark mode, or slightly lighter dark
//   dark.card = dark.background;
//   dark.popover = dark.background;
//   dark.cardForeground = dark.foreground;
//   dark.popoverForeground = dark.foreground;

//   // Primary: Often needs to be *lighter* in dark mode for good contrast
//   dark.primary = formatHsl(hue, clamp(saturation * 0.9, 20), clamp(lightness + (100 - lightness) * 0.6, 60, 90)); // Significantly lighter version
//   // Primary Foreground: Contrasting text for the dark mode primary (usually dark)
//   dark.primaryForeground = formatHsl(hue, clamp(saturation * 0.9, 10), clamp(dark.primary.split(' ')[2].slice(0,-1) * 0.15 , 5, 20)); // Dark text derived from dark primary's lightness

//   // Secondary: Darker gray tint
//   dark.secondary = formatHsl(hue, clamp(saturation * 0.1, 5, 15), 12); // Dark, slightly lighter than background
//   dark.secondaryForeground = formatHsl(hue, clamp(saturation * 0.08, 5, 15), 70); // Light gray text

//   // Muted: Similar to secondary dark
//   dark.muted = dark.secondary;
//   dark.mutedForeground = formatHsl(hue, clamp(saturation * 0.08, 5, 10), 55); // Darker light gray text

//   // Accent: Often uses the *light mode* primary for vibrancy, or a brighter variant
//   dark.accent = light.primary; // Use the original light primary for pop
//   dark.accentForeground = light.primaryForeground; // Use contrast text for light primary

//   // Border/Input: Dark gray, subtly tinted
//   dark.border = formatHsl(hue, clamp(saturation * 0.1, 8, 20), 15); // Dark border
//   dark.input = formatHsl(hue, clamp(saturation * 0.1, 8, 20), 16); // Slightly different for inputs

//   // Ring: Needs visibility on dark background, often a lighter gray or tinted mid-tone
//   dark.ring = formatHsl(hue, clamp(saturation * 0.8, 20), clamp(lightness * 0.8 + 20, 40, 60));

//   // Destructive
//   dark.destructive = destructiveDark;
//   dark.destructiveForeground = destructiveDarkFg;

//   // --- Return structured result ---
//   return {
//     light,
//     dark,
//   };
// }

// // --- Example Usage ---

// // Example 1: A nice Blue (like shadcn default)
// const blueHue = 222.2;
// const blueSat = 47.4;
// const blueLight = 11.2; // Note: Inputting the DARK color value here, function calculates light/dark variants
// const blueTheme = generateThemePalette(blueHue, blueSat, blueLight);
// // console.log("Blue Theme:", JSON.stringify(blueTheme, null, 2));

// // Example 2: A Vibrant Green
// const greenHue = 142.1;
// const greenSat = 76.2;
// const greenLight = 36.3; // Inputting the LIGHT mode primary HSL value
// const greenTheme = generateThemePalette(greenHue, greenSat, greenLight);
// // console.log("\nGreen Theme:", JSON.stringify(greenTheme, null, 2));

// // Example 3: A Slate Gray (Low Saturation)
// const slateHue = 215;
// const slateSat = 15;
// const slateLight = 48;
// const slateTheme = generateThemePalette(slateHue, slateSat, slateLight);
// console.log("\nSlate Theme:", JSON.stringify(slateTheme, null, 2));

// --- How to Use the Output ---

/*
1. Store this generated object (e.g., `blueTheme`, `greenTheme`).
2. Create a script or manually generate the CSS variables based on the selected theme's
   light and dark palettes, similar to the `src/index.css` in previous examples.

   For example, for the blue theme:

   CSS:
   html[data-color-theme="blue"] {
     --background: ${blueTheme.light.background}; // "222.2 7.1% 99.0%"
     --foreground: ${blueTheme.light.foreground}; // "222.2 15.0% 5.0%"
     --primary: ${blueTheme.light.primary};       // "222.2 47.4% 11.2%"
     // ... and so on for all light variables
   }

   html[data-color-theme="blue"].dark {
     --background: ${blueTheme.dark.background}; // "222.2 7.1% 5.0%"
     --foreground: ${blueTheme.dark.foreground}; // "222.2 7.1% 98.0%"
     --primary: ${blueTheme.dark.primary};       // "222.2 42.7% 64.5%" (Calculated lighter version)
     // ... and so on for all dark variables
   }
*/