import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const statusColors = {
  operational: 'success',
  disrupted: 'warning',
  critical: 'error',
  offline: 'default'
};

function SubmoduleEditor({ submodule, onSave, onClose }) {
  const [editedSubmodule, setEditedSubmodule] = useState(submodule);

  const handleSave = () => {
    onSave(editedSubmodule);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Submodule: {submodule.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={editedSubmodule.status}
              label="Status"
              onChange={(e) => setEditedSubmodule(prev => ({ ...prev, status: e.target.value }))}
            >
              <MenuItem value="operational">Operational</MenuItem>
              <MenuItem value="disrupted">Disrupted</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Efficiency (%)"
            type="number"
            value={editedSubmodule.details.efficiency}
            onChange={(e) => setEditedSubmodule(prev => ({
              ...prev,
              details: { ...prev.details, efficiency: Number(e.target.value) }
            }))}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
          <TextField
            label="Load (%)"
            type="number"
            value={editedSubmodule.details.load}
            onChange={(e) => setEditedSubmodule(prev => ({
              ...prev,
              details: { ...prev.details, load: Number(e.target.value) }
            }))}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
          <TextField
            label="Errors"
            type="number"
            value={editedSubmodule.details.errors}
            onChange={(e) => setEditedSubmodule(prev => ({
              ...prev,
              details: { ...prev.details, errors: Number(e.target.value) }
            }))}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function FacilityDetails({ facility, onBack, onUpdate }) {
  const [editingSubmodule, setEditingSubmodule] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdateSubmodule = async (updatedSubmodule) => {
    try {
      const updatedFacility = {
        ...facility,
        submodules: facility.submodules.map(sub =>
          sub.name === updatedSubmodule.name ? updatedSubmodule : sub
        )
      };

      const response = await fetch(`http://localhost:5000/api/facilities/${facility._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFacility),
      });

      if (!response.ok) {
        throw new Error('Failed to update facility');
      }

      onUpdate();
      setEditingSubmodule(null);
    } catch (error) {
      console.error('Error updating submodule:', error);
      setError(error.message);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          {facility.name}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facility Status
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={facility.status}
                    color={statusColors[facility.status]}
                  />
                  {facility.type === 'powerplant' && (
                    <Chip label={`${facility.details.powerCapacity}% capacity`} />
                  )}
                  {facility.type === 'hospital' && (
                    <Chip label={`${facility.details.patientCapacity}% occupancy`} />
                  )}
                  {facility.type === 'airport' && (
                    <Chip label={`${facility.details.flightDelays} min delays`} />
                  )}
                </Stack>
                
                <Typography variant="body2" color="text.secondary">
                  {facility.submodules?.filter(sub => sub.status === 'operational').length || 0} 
                  of {facility.submodules?.length || 0} subsystems operational
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Submodules
          </Typography>
          <Grid container spacing={2}>
            {facility.submodules?.map((submodule) => (
              <Grid item xs={12} md={4} key={submodule.name}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1">
                        {submodule.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => setEditingSubmodule(submodule)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                    <Stack spacing={1} mt={1}>
                      <Chip
                        size="small"
                        label={submodule.status}
                        color={statusColors[submodule.status]}
                      />
                      <Typography variant="body2">
                        Efficiency: {submodule.details.efficiency}%
                      </Typography>
                      <Typography variant="body2">
                        Load: {submodule.details.load}%
                      </Typography>
                      <Typography variant="body2">
                        Errors: {submodule.details.errors}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {editingSubmodule && (
        <SubmoduleEditor
          submodule={editingSubmodule}
          onSave={handleUpdateSubmodule}
          onClose={() => setEditingSubmodule(null)}
        />
      )}
    </Paper>
  );
}

export default FacilityDetails; 