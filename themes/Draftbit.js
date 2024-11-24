import { systemWeights } from 'react-native-typography';
import palettes from './palettes';
import { createTheme, DefaultTheme } from '@draftbit/ui';
export default createTheme({
  breakpoints: {},
  palettes,
  baseTheme: DefaultTheme,
  theme: {
    name: 'Draftbit',
    colors: {
      background: {
        brand: palettes.Brand.Background,
        danger: palettes.Brand.Error,
      },
      border: { brand: palettes.Brand.Divider, danger: palettes.Brand.Error },
      branding: {
        primary: palettes.Brand.Primary,
        secondary: palettes.Brand.Secondary,
      },
      foreground: { brand: palettes.Brand.Light, danger: palettes.Brand.Light },
      text: {
        danger: palettes.Brand.Error,
        light: palettes.Brand.Light,
        strong: palettes.Brand.Text,
      },
    },
    typography: {
      body1: {
        ...systemWeights.regular,
        fontSize: 16,
        lineHeight: 26,
        letterSpacing: 0,
      },
      body2: {
        ...systemWeights.regular,
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0,
      },
      button: {
        ...systemWeights.bold,
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0,
      },
      caption: {
        ...systemWeights.regular,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
      },
      headline1: {
        ...systemWeights.bold,
        fontSize: 60,
        lineHeight: 71,
        letterSpacing: 0,
      },
      headline2: {
        ...systemWeights.bold,
        fontSize: 48,
        lineHeight: 58,
        letterSpacing: 0,
      },
      headline3: {
        ...systemWeights.bold,
        fontSize: 34,
        lineHeight: 40,
        letterSpacing: 0,
      },
      headline4: {
        ...systemWeights.bold,
        fontSize: 24,
        lineHeight: 34,
        letterSpacing: 0,
      },
      headline5: {
        ...systemWeights.bold,
        fontSize: 20,
        lineHeight: 26,
        letterSpacing: 0,
      },
      headline6: {
        ...systemWeights.bold,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
      },
      overline: {
        ...systemWeights.regular,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 2,
      },
      subtitle1: {
        ...systemWeights.regular,
        fontSize: 16,
        lineHeight: 26,
        letterSpacing: 0,
      },
      subtitle2: {
        ...systemWeights.regular,
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0,
      },
    },
  },
});
