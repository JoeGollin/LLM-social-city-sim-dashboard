import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2E86C1',
    },
    secondary: {
      main: '#2ECC71',
      light: '#82E0AA',
      dark: '#27AE60',
    },
    success: {
      main: '#27AE60',
      light: '#2ECC71',
      dark: '#219A52',
    },
    warning: {
      main: '#F39C12',
      light: '#F1C40F',
      dark: '#D68910',
    },
    error: {
      main: '#E74C3C',
      light: '#EC7063',
      dark: '#CB4335',
    },
    background: {
      default: '#1a1a2e',
      paper: '#232342',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.2)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
}); 