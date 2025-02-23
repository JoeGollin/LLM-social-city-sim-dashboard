import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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

const FACILITY_TYPES = {
  powerplant: {
    name: 'Power Plant',
    detailField: 'powerCapacity',
    detailLabel: 'Power Capacity (%)',
    detailType: 'number'
  },
  hospital: {
    name: 'Hospital',
    detailField: 'patientCapacity',
    detailLabel: 'Patient Capacity (%)',
    detailType: 'number'
  },
  airport: {
    name: 'Airport',
    detailField: 'flightDelays',
    detailLabel: 'Average Flight Delays (minutes)',
    detailType: 'number'
  },
  police: {
    name: 'Police Station',
    detailField: 'staffingLevel',
    detailLabel: 'Staffing Level (%)',
    detailType: 'number'
  },
  fire: {
    name: 'Fire Station',
    detailField: 'incidentCount',
    detailLabel: 'Active Incidents',
    detailType: 'number'
  },
  transport: {
    name: 'Transport Hub',
    detailField: 'congestionLevel',
    detailLabel: 'Congestion Level (%)',
    detailType: 'number'
  }
};

function FacilityDialog({ open, onClose, onSubmit, initialFacility }) {
  const [facility, setFacility] = useState({
    name: '',
    type: '',
    status: 'operational',
    details: {}
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialFacility) {
      setFacility(initialFacility);
    } else {
      setFacility({
        name: '',
        type: '',
        status: 'operational',
        details: {}
      });
    }
  }, [initialFacility, open]);

  const handleSubmit = async () => {
    if (!facility.name.trim() || !facility.type) {
      setError('Name and type are required');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await onSubmit(facility);
      handleClose();
    } catch (error) {
      console.error('Error in facility dialog:', error);
      setError(error.message || 'Failed to save facility');
      setIsSubmitting(false);
      // Don't close dialog on error so user can see the error message
    }
  };

  const handleClose = () => {
    setFacility({
      name: '',
      type: '',
      status: 'operational',
      details: {}
    });
    setError(null);
    onClose();
  };

  const handleDetailChange = (value) => {
    if (facility.type) {
      const detailField = FACILITY_TYPES[facility.type].detailField;
      setFacility(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [detailField]: Number(value)
        }
      }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialFacility ? 'Edit Facility' : 'Add New Facility'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2}>
            <TextField
              autoFocus
              label="Facility Name"
              fullWidth
              value={facility.name}
              onChange={(e) => setFacility(prev => ({ ...prev, name: e.target.value }))}
              error={Boolean(error && !facility.name.trim())}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={facility.type}
                label="Type"
                onChange={(e) => setFacility(prev => ({ 
                  ...prev, 
                  type: e.target.value,
                  details: {} // Reset details when type changes
                }))}
              >
                {Object.entries(FACILITY_TYPES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={facility.status}
                label="Status"
                onChange={(e) => setFacility(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="operational">Operational</MenuItem>
                <MenuItem value="disrupted">Disrupted</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
            {facility.type && (
              <TextField
                label={FACILITY_TYPES[facility.type].detailLabel}
                type="number"
                fullWidth
                value={facility.details[FACILITY_TYPES[facility.type].detailField] || ''}
                onChange={(e) => handleDetailChange(e.target.value)}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            )}
          </Stack>
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
          {isSubmitting ? (initialFacility ? 'Updating...' : 'Creating...') : (initialFacility ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FacilityDialog.defaultProps = {
  open: false,
  onClose: () => {},
  onSubmit: () => {},
  initialFacility: null
};

export default FacilityDialog; 