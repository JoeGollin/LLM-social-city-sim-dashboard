const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sentimentScore: {
    type: Number,
    required: true
  },
  cityRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  facilityRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  highlights: {
    facilities: [String],
    submodules: [String]
  }
}, {
  timestamps: true
});

// Add a pre-remove hook to log deletions
postSchema.pre('deleteMany', function(next) {
  console.log('Deleting all posts...');
  next();
});

// Extract highlights before saving
postSchema.pre('save', function(next) {
  // Extract facility names [facility name]
  this.highlights.facilities = (this.content.match(/\[(.*?)\]/g) || [])
    .map(match => match.slice(1, -1));

  // Extract submodule names <submodule name>
  this.highlights.submodules = (this.content.match(/<(.*?)>/g) || [])
    .map(match => match.slice(1, -1));

  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post; 