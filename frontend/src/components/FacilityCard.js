import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import {
  LocalHospital as HospitalIcon,
  ElectricBolt as PowerIcon,
  Flight as AirportIcon,
  LocalPolice as PoliceIcon,
  LocalFireDepartment as FireIcon,
  DirectionsBus as TransportIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';

const facilityIcons = {
  hospital: HospitalIcon,
  powerplant: PowerIcon,
  airport: AirportIcon,
  police: PoliceIcon,
  fire: FireIcon,
  transport: TransportIcon,
};

const statusColors = {
  operational: 'success',
  disrupted: 'warning',
  critical: 'error',
  offline: 'default',
};

const StyledFacilityCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  },
}));

const SubmoduleStatus = ({ submodule }) => {
  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return 'success';
    if (efficiency >= 70) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography variant="caption" sx={{ flex: 1 }}>
          {submodule.name}
        </Typography>
        <Chip
          size="small"
          label={submodule.status}
          color={statusColors[submodule.status]}
          sx={{ minWidth: 80 }}
        />
      </Stack>
      <Tooltip title={`Efficiency: ${submodule.details.efficiency}%`}>
        <LinearProgress
          variant="determinate"
          value={submodule.details.efficiency}
          color={getEfficiencyColor(submodule.details.efficiency)}
          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
        />
      </Tooltip>
    </Box>
  );
};

function FacilityCard({ facility, selected, onSelect, onUpdate }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);

  const Icon = facilityIcons[facility.type] || HospitalIcon;
  const criticalSubmodules = facility.submodules?.filter(
    sub => sub.status !== 'operational'
  ) || [];

  const calculateSubmoduleStatus = (submodule) => {
    const { efficiency, load, errors } = submodule.details;
    
    if (errors > 5) return 'critical';
    if (errors > 2) return 'disrupted';
    if (efficiency < 50 || load > 95) return 'critical';
    if (efficiency < 70 || load > 85) return 'disrupted';
    return 'operational';
  };

  const calculateFacilityStatus = (facility) => {
    if (!facility.submodules?.length) return 'offline';

    const submoduleStatuses = facility.submodules.map(calculateSubmoduleStatus);
    const criticalCount = submoduleStatuses.filter(s => s === 'critical').length;
    const disruptedCount = submoduleStatuses.filter(s => s === 'disrupted').length;
    const operationalCount = submoduleStatuses.filter(s => s === 'operational').length;

    if (criticalCount > Math.floor(submoduleStatuses.length / 3)) return 'critical';
    if (disruptedCount > Math.floor(submoduleStatuses.length / 2)) return 'disrupted';
    if (operationalCount === submoduleStatuses.length) return 'operational';
    return 'disrupted';
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card selection when clicking edit
    setEditingFacility({ ...facility });
    setEditDialogOpen(true);
  };

  const handleUpdateSubmodule = (submoduleIndex, updates) => {
    const updatedFacility = { ...editingFacility };
    const updatedSubmodule = {
      ...updatedFacility.submodules[submoduleIndex],
      ...updates,
    };

    // Update submodule status based on metrics
    updatedSubmodule.status = calculateSubmoduleStatus(updatedSubmodule);
    updatedFacility.submodules[submoduleIndex] = updatedSubmodule;

    // Update facility status based on submodules
    updatedFacility.status = calculateFacilityStatus(updatedFacility);

    setEditingFacility(updatedFacility);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/facilities/${facility._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingFacility),
      });

      if (!response.ok) {
        throw new Error('Failed to update facility');
      }

      onUpdate();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating facility:', error);
    }
  };

  return (
    <>
      <StyledFacilityCard selected={selected} onClick={onSelect}>
        <Stack spacing={2}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon color="primary" />
            <Typography variant="subtitle1" sx={{ flex: 1 }}>
              {facility.name}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleEditClick}
              sx={{ mr: 1 }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
            {criticalSubmodules.length > 0 && (
              <Tooltip title={`${criticalSubmodules.length} issues detected`}>
                <Chip
                  size="small"
                  icon={<WarningIcon />}
                  label={criticalSubmodules.length}
                  color="warning"
                />
              </Tooltip>
            )}
          </Stack>

          {/* Status */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={facility.status}
              color={statusColors[facility.status]}
            />
            {facility.type === 'powerplant' && (
              <Chip size="small" label={`${facility.details.powerCapacity}% capacity`} />
            )}
            {facility.type === 'hospital' && (
              <Chip size="small" label={`${facility.details.patientCapacity}% occupancy`} />
            )}
          </Stack>

          {/* Submodules */}
          <Stack spacing={1}>
            {facility.submodules?.map((submodule) => (
              <SubmoduleStatus key={submodule.name} submodule={submodule} />
            ))}
          </Stack>
        </Stack>
      </StyledFacilityCard>

      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Facility: {facility.name}
        </DialogTitle>
        <DialogContent>
          {editingFacility && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Facility Name"
                value={editingFacility.name}
                onChange={(e) => setEditingFacility({
                  ...editingFacility,
                  name: e.target.value
                })}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingFacility.status}
                  label="Status"
                  onChange={(e) => setEditingFacility({
                    ...editingFacility,
                    status: e.target.value
                  })}
                >
                  <MenuItem value="operational">Operational</MenuItem>
                  <MenuItem value="disrupted">Disrupted</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="h6" gutterBottom>
                Submodules
              </Typography>
              {editingFacility.submodules?.map((submodule, index) => (
                <Box key={submodule.name} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">
                      {submodule.name}
                    </Typography>
                    
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        size="small"
                        value={submodule.status}
                        label="Status"
                        onChange={(e) => handleUpdateSubmodule(index, { status: e.target.value })}
                      >
                        <MenuItem value="operational">Operational</MenuItem>
                        <MenuItem value="disrupted">Disrupted</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                        <MenuItem value="offline">Offline</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="Efficiency"
                      type="number"
                      size="small"
                      value={submodule.details.efficiency}
                      onChange={(e) => handleUpdateSubmodule(index, {
                        details: { ...submodule.details, efficiency: Number(e.target.value) }
                      })}
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />

                    <TextField
                      label="Load"
                      type="number"
                      size="small"
                      value={submodule.details.load}
                      onChange={(e) => handleUpdateSubmodule(index, {
                        details: { ...submodule.details, load: Number(e.target.value) }
                      })}
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />

                    <TextField
                      label="Errors"
                      type="number"
                      size="small"
                      value={submodule.details.errors}
                      onChange={(e) => handleUpdateSubmodule(index, {
                        details: { ...submodule.details, errors: Number(e.target.value) }
                      })}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FacilityCard; 