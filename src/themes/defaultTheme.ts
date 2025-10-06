import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette, shape } from './themePrimitives';

const defaultTheme = createTheme({
  cssVariables: {
    // use the built-in 'data' selector so MUI will toggle [data-light]/[data-dark]
    colorSchemeSelector: 'data',
  },
  colorSchemes: {
    light: { palette: lightPalette },
    dark:  { palette: darkPalette },
  },
  shape,
});

export default defaultTheme;