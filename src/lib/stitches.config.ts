import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      dark_green: '#05473C',
      light_green: '#54ECCA',
      primary: '#fff',
      secondary: '#000',
      danger: '#d32f2f',
    },
  },
  utils: {
    marginX: (value) => ({ marginLeft: value, marginRight: value }),
    marginY: (value) => ({ marginTop: value, marginBottom: value }),
    paddingX: (value) => ({ paddingLeft: value, paddingRight: value }),
    paddingY: (value) => ({ paddingTop: value, paddingBottom: value }),
    container: (value) => ({ display: 'flex', width: '100%' , justifyContent: 'center', alignItems: 'center', maxWidth: value, })
  },
});