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
  Box,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import FlightIcon from '@mui/icons-material/Flight';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WarningIcon from '@mui/icons-material/Warning';
import FacilityDialog from './FacilityDialog';

const facilityIcons = {
  hospital: LocalHospitalIcon,
  powerplant: ElectricBoltIcon,
  airport: FlightIcon,
  police: LocalPoliceIcon,
  fire: LocalFireDepartmentIcon,
  transport: DirectionsBusIcon
};

const statusColors = {
  operational: 'success',
  disrupted: 'warning',
  critical: 'error',
  offline: 'default'
};

function FacilityList({ facilities = [], selectedFacility, onFacilitySelect, onFacilityCreated }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedForMenu, setSelectedForMenu] = useState(null);
  const [error, setError] = useState(null);

  const handleAddFacility = async (facilityData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create facility');
      }

      // Call the callback if it exists
      if (typeof onFacilityCreated === 'function') {
        await onFacilityCreated();
      }
    } catch (error) {
      console.error('Error creating facility:', error);
      setError(error.message);
      throw error;
    }
  };

  const handleEditFacility = async (facilityData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/facilities/${editingFacility._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });

      if (!response.ok) {
        throw new Error('Failed to update facility');
      }

      await onFacilityCreated();
      setEditingFacility(null);
    } catch (error) {
      console.error('Error updating facility:', error);
      throw error;
    }
  };

  const handleDeleteFacility = async (facility) => {
    try {
      const response = await fetch(`http://localhost:5000/api/facilities/${facility._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete facility');
      }

      await onFacilityCreated();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
    handleCloseMenu();
  };

  const handleOpenMenu = (event, facility) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedForMenu(facility);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedForMenu(null);
  };

  const handleEditClick = () => {
    setEditingFacility(selectedForMenu);
    setDialogOpen(true);
    handleCloseMenu();
  };

  return (
    <Paper sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          City Facilities
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => setDialogOpen(true)}
        >
          Add Facility
        </Button>
      </Box>
      
      <List>
        {facilities.map((facility) => {
          const IconComponent = facilityIcons[facility.type] || LocalHospitalIcon;
          const criticalSubmodules = facility.submodules?.filter(
            sub => sub.status !== 'operational'
          ) || [];
          
          return (
            <ListItem 
              key={facility._id}
              selected={selectedFacility?._id === facility._id}
              onClick={() => onFacilitySelect(facility)}
              sx={{ cursor: 'pointer' }}
              secondaryAction={
                <Box display="flex" alignItems="center">
                  {criticalSubmodules.length > 0 && (
                    <Chip
                      size="small"
                      icon={<WarningIcon />}
                      label={`${criticalSubmodules.length} issues`}
                      color="warning"
                      sx={{ mr: 1 }}
                    />
                  )}
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleOpenMenu(e, facility)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText 
                primary={facility.name}
                secondary={
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      size="small" 
                      label={facility.status}
                      color={statusColors[facility.status]}
                    />
                    {facility.type === 'powerplant' && (
                      <Chip 
                        size="small" 
                        label={`${facility.details.powerCapacity}% capacity`}
                      />
                    )}
                    {facility.type === 'hospital' && (
                      <Chip 
                        size="small" 
                        label={`${facility.details.patientCapacity}% occupancy`}
                      />
                    )}
                    {/* Add more facility-specific details as needed */}
                  </Stack>
                }
              />
            </ListItem>
          );
        })}
      </List>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this facility?')) {
              handleDeleteFacility(selectedForMenu);
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      <FacilityDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingFacility(null);
        }}
        onSubmit={editingFacility ? handleEditFacility : handleAddFacility}
        initialFacility={editingFacility}
      />
    </Paper>
  );
}

FacilityList.defaultProps = {
  facilities: [],
  onFacilityCreated: () => {},
  onFacilitySelect: () => {}
};

export default FacilityList; 