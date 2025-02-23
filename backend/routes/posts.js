const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('cityRef', 'name')
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get posts for a specific city
router.get('/city/:cityId', async (req, res) => {
  try {
    const posts = await Post.find({ cityRef: req.params.cityId })
      .populate('cityRef', 'name')
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all posts
router.delete('/', async (req, res) => {
  try {
    console.log('Attempting to delete all posts...');
    const result = await Post.deleteMany({});
    console.log('Delete result:', result);
    res.json({ 
      message: 'All posts deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error('Error deleting posts:', err);
    res.status(500).json({ 
      message: 'Failed to delete posts',
      error: err.message 
    });
  }
});

module.exports = router; 