import React, { useState } from 'react';
import {
  Typography,
  TextField,
  IconButton,
  Stack,
  Box,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function EditableTitle({ title, onSave, variant = "h4", gutterBottom = true }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!editValue.trim()) {
      setError('Name cannot be empty');
      return;
    }
    try {
      await onSave(editValue);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(title);
    setError(null);
  };

  if (isEditing) {
    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: gutterBottom ? 2 : 0 }}>
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          error={Boolean(error)}
          helperText={error}
          size="small"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
        />
        <IconButton onClick={handleSave} color="primary" size="small">
          <CheckIcon />
        </IconButton>
        <IconButton onClick={handleCancel} color="error" size="small">
          <CloseIcon />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: gutterBottom ? 2 : 0 
      }}
    >
      <Typography variant={variant} gutterBottom={false}>
        {title}
      </Typography>
      <Tooltip title="Edit city name">
        <IconButton 
          onClick={() => setIsEditing(true)} 
          size="small" 
          sx={{ ml: 1 }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default EditableTitle; 