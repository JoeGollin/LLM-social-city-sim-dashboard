const express = require('express');
const router = express.Router();
const modelService = require('../services/modelService');

router.get('/', async (req, res) => {
  try {
    const models = await modelService.getAvailableModels();
    res.json(models);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 