const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const citiesRouter = require('./routes/cities');
const postsRouter = require('./routes/posts');
const PostGenerationService = require('./services/postGenerationService');
const cron = require('node-cron');
const modelsRouter = require('./routes/models');
const facilitiesRouter = require('./routes/facilities');
const initializeCity = require('./utils/initializeCity');
const updateFacilitiesWithSubmodules = require('./utils/updateFacilitiesWithSubmodules');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Route handlers
app.use('/api/cities', citiesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/facilities', facilitiesRouter);

// Initialize post generation service with io instance
const postGenerationService = new PostGenerationService(io);

// Add endpoint to manually trigger post generation
app.post('/api/generate', async (req, res) => {
  try {
    console.log('Generating posts with model:', req.body.model);
    const posts = await postGenerationService.generatePostsForAllCities(req.body.model);
    res.json({ 
      success: true,
      posts: posts,
      message: 'Posts generated successfully'
    });
  } catch (error) {
    console.error('Generate posts error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to generate posts',
      error: error.toString()
    });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'City Social Sim API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB Connection with better error handling
mongoose.connect('mongodb://127.0.0.1:27017/city-social-sim', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  initializeCity();
  updateFacilitiesWithSubmodules();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Add more detailed MongoDB error logging
mongoose.connection.on('error', err => {
  console.error('MongoDB error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: err.stack
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
}); 