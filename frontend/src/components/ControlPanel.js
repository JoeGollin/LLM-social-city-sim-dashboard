import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  TextField,
  Stack
} from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

function ControlPanel({ onPostsCleared }) {
  const { showNotification } = useNotification();
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingModels, setFetchingModels] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [interval, setInterval] = useState(60);
  const [timer, setTimer] = useState(null);
  const [intervalTimer, setIntervalTimer] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, []);

  // Handle auto-generate changes
  useEffect(() => {
    // Clear existing timers
    if (timer) clearTimeout(timer);
    if (intervalTimer) clearInterval(intervalTimer);
    setTimer(null);
    setIntervalTimer(null);

    // Only start new timers if auto-generate is enabled and we have a model
    if (autoGenerate && selectedModel && !loading) {
      // Set the first timer to start after the interval
      const newTimer = setTimeout(() => {
        handleGeneratePosts();
        // After the first generation, set up recurring interval
        const newIntervalTimer = setInterval(handleGeneratePosts, interval * 1000);
        setIntervalTimer(newIntervalTimer);
      }, interval * 1000);
      
      setTimer(newTimer);
    }
  }, [autoGenerate, selectedModel]);

  const handleIntervalChange = (newInterval) => {
    // Validate and update interval
    const validInterval = Math.max(1, parseInt(newInterval) || interval);
    setInterval(validInterval);

    // Only handle timer updates if auto-generate is on
    if (autoGenerate && selectedModel && !loading) {
      // Clear existing timers
      if (timer) clearTimeout(timer);
      if (intervalTimer) clearInterval(intervalTimer);
      setTimer(null);
      setIntervalTimer(null);

      // Start new timers
      const newTimer = setTimeout(() => {
        handleGeneratePosts();
        const newIntervalTimer = setInterval(handleGeneratePosts, validInterval * 1000);
        setIntervalTimer(newIntervalTimer);
      }, validInterval * 1000);
      
      setTimer(newTimer);
    }
  };

  const handleAutoGenerateToggle = (enabled) => {
    setAutoGenerate(enabled);
    // Clear any existing timers when toggling off
    if (!enabled) {
      if (timer) clearTimeout(timer);
      if (intervalTimer) clearInterval(intervalTimer);
      setTimer(null);
      setIntervalTimer(null);
    }
  };

  const fetchModels = async () => {
    try {
      setFetchingModels(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/models');
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      
      // Ensure we have an array of models
      const modelList = Array.isArray(data) ? data : [];
      console.log('Fetched models:', modelList);
      
      setModels(modelList);
      if (modelList.length > 0) {
        setSelectedModel(modelList[0].name);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setError('Failed to load available models');
      setModels([]);
    } finally {
      setFetchingModels(false);
    }
  };

  const handleGeneratePosts = async () => {
    if (!selectedModel || loading) {
      showNotification('Please select a model first', { severity: 'error' });
      handleAutoGenerateToggle(false);
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: selectedModel })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate posts');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to generate posts');
      }

      showNotification('Posts generated successfully', { severity: 'success' });
    } catch (error) {
      console.error('Error generating posts:', error);
      showNotification(error.message || 'Failed to generate posts', { severity: 'error' });
      handleAutoGenerateToggle(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFeed = async () => {
    try {
      setClearing(true);
      
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear feed');
      }

      showNotification('Feed cleared successfully', { severity: 'success' });
      await onPostsCleared();
    } catch (error) {
      console.error('Error clearing feed:', error);
      showNotification(error.message || 'Failed to clear feed', { severity: 'error' });
    } finally {
      setClearing(false);
    }
  };

  if (fetchingModels) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Controls
      </Typography>

      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Model</InputLabel>
          <Select
            value={selectedModel}
            label="Model"
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={loading || fetchingModels}
          >
            {models.map((model) => (
              <MenuItem key={model.name} value={model.name}>
                {model.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoGenerate}
                onChange={(e) => handleAutoGenerateToggle(e.target.checked)}
                disabled={!selectedModel || loading}
              />
            }
            label="Auto Generate Posts"
          />
          <TextField
            type="number"
            label="Interval (seconds)"
            value={interval}
            onChange={(e) => handleIntervalChange(e.target.value)}
            size="small"
            disabled={loading}
            InputProps={{ 
              inputProps: { min: 1 },
              endAdornment: <Typography variant="caption">seconds</Typography>
            }}
            sx={{ width: 150 }}
          />
        </Box>

        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            onClick={handleGeneratePosts}
            disabled={loading || !selectedModel}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            fullWidth
          >
            {loading ? 'Generating...' : 'Generate Posts'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearFeed}
            disabled={loading || clearing}
            startIcon={clearing ? <CircularProgress size={20} /> : null}
          >
            {clearing ? 'Clearing...' : 'Clear Feed'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

ControlPanel.defaultProps = {
  onPostsCleared: () => {}
};

export default ControlPanel; 