

export type CssVarsProps = {
  primaryColor: string;
  primaryColor1: string;
  primaryColor2: string;
  primaryColorOpacity1: string;
  primaryColorOpacity2: string;
  primaryColorOpacity3: string;
};


export function createCssVars(props: CssVarsProps, prefix: string = 'bailu') {
  const cssVars: CssVars<CssVarsProps> = {
    [`--${prefix}-primary-color`]: props.primaryColor,
    [`--${prefix}-primary-color1`]: props.primaryColor1,
    [`--${prefix}-primary-color2`]: props.primaryColor2,
    [`--${prefix}-primary-color-opacity1`]: props.primaryColorOpacity1,
    [`--${prefix}-primary-color-opacity2`]: props.primaryColorOpacity2,
    [`--${prefix}-primary-color-opacity3`]: props.primaryColorOpacity3
  };

  return cssVars;
}
