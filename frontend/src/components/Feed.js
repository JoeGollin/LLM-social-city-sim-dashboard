import React from 'react';
import { Stack } from '@mui/material';
import PostCard from './PostCard';

function Feed({ posts, facilities }) {
  return (
    <Stack spacing={2}>
      {posts.map(post => (
        <PostCard 
          key={post._id} 
          post={post} 
          facilities={facilities}
        />
      ))}
    </Stack>
  );
}

export default Feed; 