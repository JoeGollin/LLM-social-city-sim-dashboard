import React, { useState, useEffect } from 'react';
import { Grid, Container, Box, CircularProgress, Alert, Typography, Stack } from '@mui/material';
import FacilityList from './FacilityList';
import SocialFeed from './SocialFeed';
import SentimentOverview from './SentimentOverview';
import ControlPanel from './ControlPanel';
import { io } from 'socket.io-client';
import EditableTitle from './EditableTitle';
import FacilityDetails from './FacilityDetails';
import FacilityCard from './FacilityCard';

const socket = io('http://localhost:5000');

function calculateCityHealth(city) {
  if (!city || !city.facilities) return 0;
  
  let totalHealth = 0;
  let totalFacilities = city.facilities.length;

  city.facilities.forEach(facility => {
    // Calculate facility health based on submodules
    let facilityHealth = 100;
    if (facility.submodules && facility.submodules.length > 0) {
      const criticalCount = facility.submodules.filter(sub => sub.status === 'critical').length;
      const warningCount = facility.submodules.filter(sub => sub.status === 'warning').length;
      const totalSubmodules = facility.submodules.length;
      
      facilityHealth = Math.max(0, 100 - 
        (criticalCount * 30 + warningCount * 15) / totalSubmodules);
    }
    
    // Add to total based on facility status
    if (facility.status === 'critical') {
      facilityHealth *= 0.3;
    } else if (facility.status === 'warning') {
      facilityHealth *= 0.7;
    }
    
    totalHealth += facilityHealth;
  });

  return totalFacilities > 0 ? Math.round(totalHealth / totalFacilities) : 0;
}

function Dashboard() {
  const [city, setCity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFacilityDetails, setShowFacilityDetails] = useState(false);

  useEffect(() => {
    fetchCity();
    fetchPosts();

    socket.on('newPost', (data) => {
      setPosts(prevPosts => [data.post, ...prevPosts]);
    });

    return () => {
      socket.off('newPost');
    };
  }, []);

  const fetchCity = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/cities');
      if (!response.ok) {
        throw new Error('Failed to fetch city data');
      }
      const data = await response.json();
      // Add health calculation to city data
      const cityData = data[0];
      cityData.health = calculateCityHealth(cityData);
      setCity(cityData);
    } catch (error) {
      console.error('Error fetching city:', error);
      setError('Failed to load city data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostsCleared = async () => {
    try {
      console.log('Refreshing posts after clear...');
      await fetchPosts();
      // Force update the posts state to empty if fetch somehow fails
      setPosts([]);
    } catch (error) {
      console.error('Error refreshing posts:', error);
      // Ensure posts are cleared even if refresh fails
      setPosts([]);
    }
  };

  const handleFacilityCreated = async () => {
    try {
      console.log('Refreshing city data after facility change...');
      await fetchCity();
    } catch (error) {
      console.error('Error refreshing facilities:', error);
      setError('Failed to refresh facilities');
    }
  };

  const handleCityNameUpdate = async (newName) => {
    try {
      const response = await fetch('http://localhost:5000/api/cities/name', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update city name');
      }

      // Update local state
      setCity(prev => ({ ...prev, name: newName }));
    } catch (error) {
      console.error('Error updating city name:', error);
      throw error;
    }
  };

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setShowFacilityDetails(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Header Row */}
          <Grid item xs={12} container alignItems="center">
            <Grid item xs={3}>
              <EditableTitle 
                title={city?.name || 'City Dashboard'} 
                onSave={handleCityNameUpdate}
              />
            </Grid>
            <Grid item xs={9}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <SentimentOverview 
                  posts={posts} 
                  cityHealth={city?.health || 0}
                />
                <ControlPanel onPostsCleared={handlePostsCleared} />
              </Stack>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} container spacing={3}>
            {/* Facilities Column */}
            <Grid item xs={4}>
              <Stack spacing={2}>
                {city?.facilities.map((facility) => (
                  <FacilityCard
                    key={facility._id}
                    facility={facility}
                    selected={selectedFacility?._id === facility._id}
                    onSelect={() => handleFacilitySelect(facility)}
                    onUpdate={handleFacilityCreated}
                  />
                ))}
              </Stack>
            </Grid>

            {/* Social Feed Column */}
            <Grid item xs={8}>
              <SocialFeed 
                posts={posts}
                selectedFacility={selectedFacility}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard; 