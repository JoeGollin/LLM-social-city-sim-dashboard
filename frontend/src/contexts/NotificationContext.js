import React, { createContext, useContext, useState } from 'react';
import { 
  Snackbar, 
  Alert, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    minWidth: '300px',
  },
}));

const NotificationContext = createContext({
  showNotification: () => {},
  toggleHistory: () => {},
  clearHistory: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 3000,
  });
  const [history, setHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showNotification = (message, options = {}) => {
    const newNotification = {
      message,
      severity: options.severity || 'info',
      timestamp: new Date(),
    };

    // Add to history
    setHistory(prev => [newNotification, ...prev]);

    // Show snackbar
    setNotification({
      open: true,
      ...newNotification,
      autoHideDuration: options.autoHideDuration || 3000,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  const toggleHistory = () => {
    setDrawerOpen(!drawerOpen);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, toggleHistory, clearHistory }}>
      {children}
      <StyledSnackbar
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={notification.severity}
          variant="filled"
          elevation={6}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </StyledSnackbar>

      <IconButton 
        onClick={toggleHistory}
        sx={{ 
          position: 'fixed', 
          right: 20, 
          top: 20,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': { bgcolor: 'background.paper' }
        }}
      >
        <HistoryIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 350, bgcolor: 'background.paper' }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Notification History</Typography>
            <Box>
              <IconButton onClick={clearHistory} title="Clear History">
                <DeleteSweepIcon />
              </IconButton>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <List>
            {history.length === 0 ? (
              <ListItem>
                <ListItemText 
                  secondary="No notifications yet"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            ) : (
              history.map((notif, index) => (
                <ListItem 
                  key={index}
                  divider={index !== history.length - 1}
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
                    <Chip
                      size="small"
                      label={notif.severity}
                      color={notif.severity}
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {notif.message}
                  </Typography>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Drawer>
    </NotificationContext.Provider>
  );
}; 