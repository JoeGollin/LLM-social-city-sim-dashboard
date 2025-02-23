import React, { useState } from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddIcon from '@mui/icons-material/Add';

function CityList({ cities = [], selectedCity, onCitySelect, onCityCreated }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCity, setNewCity] = useState({
    name: '',
    powerGridStatus: 'stable',
    weather: 'clear'
  });

  const handleClickOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setNewCity({ name: '', powerGridStatus: 'stable', weather: 'clear' });
  };

  const handleSubmit = async () => {
    if (!newCity.name.trim()) {
      setError('City name is required');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      
      const response = await fetch('http://localhost:5000/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await onCityCreated();
        handleClose();
      } else {
        setError(data.message || 'Failed to create city');
      }
    } catch (error) {
      console.error('Error creating city:', error);
      setError('Failed to create city. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Cities
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          size="small"
        >
          Add City
        </Button>
      </Box>
      
      <List>
        {cities.map((city) => (
          <ListItem 
            key={city._id}
            selected={selectedCity?._id === city._id}
            onClick={() => onCitySelect(city)}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemIcon>
              <LocationCityIcon />
            </ListItemIcon>
            <ListItemText 
              primary={city.name}
              secondary={
                <Stack direction="row" spacing={1}>
                  <Chip 
                    size="small" 
                    label={city.powerGridStatus}
                    color={city.powerGridStatus === 'stable' ? 'success' : 'error'}
                  />
                  <Chip 
                    size="small" 
                    label={city.weather}
                  />
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New City</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="City Name"
              fullWidth
              variant="outlined"
              value={newCity.name}
              onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
              error={Boolean(error && !newCity.name.trim())}
              helperText={error && !newCity.name.trim() ? 'City name is required' : ''}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Power Grid Status</InputLabel>
              <Select
                value={newCity.powerGridStatus}
                label="Power Grid Status"
                onChange={(e) => setNewCity({ ...newCity, powerGridStatus: e.target.value })}
              >
                <MenuItem value="stable">Stable</MenuItem>
                <MenuItem value="unstable">Unstable</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Weather</InputLabel>
              <Select
                value={newCity.weather}
                label="Weather"
                onChange={(e) => setNewCity({ ...newCity, weather: e.target.value })}
              >
                <MenuItem value="clear">Clear</MenuItem>
                <MenuItem value="cloudy">Cloudy</MenuItem>
                <MenuItem value="rainy">Rainy</MenuItem>
                <MenuItem value="stormy">Stormy</MenuItem>
                <MenuItem value="snowy">Snowy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default CityList; 