import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Dashboard from './components/Dashboard';
import { theme } from './theme';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <CssBaseline />
        <Dashboard />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App; 