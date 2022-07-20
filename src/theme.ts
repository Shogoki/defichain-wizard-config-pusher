import { createTheme } from '@mui/material/styles';
import { red, deepOrange } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2'
        }
      }
    }
  },
  palette: {
    primary: {
      main: '#FF00AF'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    mode: 'dark'
  }
});

export default theme;
