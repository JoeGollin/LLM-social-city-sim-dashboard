const express = require('express');
const router = express.Router();
const City = require('../models/City');

// Get all cities
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all cities...');
    const cities = await City.find();
    console.log('Cities found:', cities);
    res.json(cities);
  } catch (err) {
    console.error('Error fetching cities:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new city
router.post('/', async (req, res) => {
  try {
    console.log('Creating new city with data:', req.body);
    const city = new City({
      name: req.body.name,
      powerGridStatus: req.body.powerGridStatus,
      weather: req.body.weather
    });

    console.log('City model created:', city);
    const newCity = await city.save();
    console.log('City saved successfully:', newCity);
    res.status(201).json(newCity);
  } catch (err) {
    console.error('Error creating city:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update city name
router.patch('/name', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'City name is required' });
    }

    const city = await City.findOne();
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    city.name = name.trim();
    await city.save();

    res.json({ 
      message: 'City name updated successfully',
      name: city.name 
    });
  } catch (err) {
    console.error('Error updating city name:', err);
    res.status(500).json({ 
      message: 'Failed to update city name',
      error: err.message 
    });
  }
});

// Get one city
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (city) {
      res.json(city);
    } else {
      res.status(404).json({ message: 'City not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a city
router.patch('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    if (req.body.name) city.name = req.body.name;
    if (req.body.powerGridStatus) city.powerGridStatus = req.body.powerGridStatus;
    if (req.body.weather) city.weather = req.body.weather;
    
    const updatedCity = await city.save();
    res.json(updatedCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a city
router.delete('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    await city.remove();
    res.json({ message: 'City deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 