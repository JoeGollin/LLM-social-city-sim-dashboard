import React, { useState } from 'react';
import { 
  Paper, 
  List, 
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';

const AnimatedListItem = styled(motion.div)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const PostCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const FacilityChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderColor: theme.palette.divider,
  '& .MuiChip-label': {
    color: theme.palette.text.primary,
  },
}));

const SentimentChip = styled(Chip)(({ theme, sentiment }) => {
  const getColor = () => {
    if (sentiment > 0) return theme.palette.success.main;
    if (sentiment < 0) return theme.palette.error.main;
    return theme.palette.grey[600];
  };

  return {
    backgroundColor: 'transparent',
    border: `1px solid ${getColor()}`,
    '& .MuiChip-label': {
      color: getColor(),
    },
  };
});

function SocialFeed({ posts, selectedFacility }) {
  const [showAllPosts, setShowAllPosts] = useState(false);

  const filteredPosts = showAllPosts ? posts : 
    selectedFacility ? posts.filter(post => post.facilityRef === selectedFacility._id) : posts;

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Social Feed {selectedFacility && !showAllPosts && `- ${selectedFacility.name}`}
        </Typography>
        {selectedFacility && (
          <Button 
            size="small"
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowAllPosts(!showAllPosts)}
          >
            {showAllPosts ? 'Show Selected Facility' : 'Show All Posts'}
          </Button>
        )}
      </Box>
      
      <List sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
        <AnimatePresence>
          {filteredPosts.map((post) => (
            <AnimatedListItem
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PostCard elevation={1}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FacilityChip 
                      size="small" 
                      label={post.facilityRef}
                      variant="outlined"
                    />
                    <SentimentChip
                      size="small"
                      label={post.sentimentScore > 0 ? 'Positive' : post.sentimentScore < 0 ? 'Negative' : 'Neutral'}
                      sentiment={post.sentimentScore}
                    />
                  </Stack>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.primary',
                      lineHeight: 1.6,
                    }}
                  >
                    {post.content}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      display: 'block',
                      textAlign: 'right',
                      opacity: 0.8
                    }}
                  >
                    {new Date(post.timestamp).toLocaleString()}
                  </Typography>
                </Stack>
              </PostCard>
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </List>
    </Paper>
  );
}

export default SocialFeed; 