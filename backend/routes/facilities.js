const express = require('express');
const router = express.Router();
const City = require('../models/City');

// Add a facility to the city
router.post('/', async (req, res) => {
  try {
    const city = await City.findOne(); // Get the single city
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    city.facilities.push(req.body);
    await city.save();
    res.status(201).json(city.facilities[city.facilities.length - 1]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a facility
router.patch('/:facilityId', async (req, res) => {
  try {
    const city = await City.findOne();
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    const facilityIndex = city.facilities.findIndex(f => f._id.toString() === req.params.facilityId);
    if (facilityIndex === -1) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // Update facility fields
    Object.keys(req.body).forEach(key => {
      if (key === 'details') {
        city.facilities[facilityIndex].details = {
          ...city.facilities[facilityIndex].details,
          ...req.body.details
        };
      } else {
        city.facilities[facilityIndex][key] = req.body[key];
      }
    });

    await city.save();
    res.json(city.facilities[facilityIndex]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a facility
router.delete('/:facilityId', async (req, res) => {
  try {
    const city = await City.findOne();
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    city.facilities = city.facilities.filter(f => f._id.toString() !== req.params.facilityId);
    await city.save();
    res.json({ message: 'Facility deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 