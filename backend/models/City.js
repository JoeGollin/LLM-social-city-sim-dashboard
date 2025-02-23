const mongoose = require('mongoose');

const submoduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'disrupted', 'critical', 'offline'],
    default: 'operational'
  },
  details: {
    efficiency: Number,  // Percentage
    load: Number,       // Percentage
    errors: Number      // Count of current errors
  }
});

// Add status calculation methods
submoduleSchema.methods.calculateStatus = function() {
  const { efficiency, load, errors } = this.details;
  
  if (errors > 5) return 'critical';
  if (errors > 2) return 'disrupted';
  if (efficiency < 50 || load > 95) return 'critical';
  if (efficiency < 70 || load > 85) return 'disrupted';
  return 'operational';
};

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['powerplant', 'hospital', 'airport', 'police', 'fire', 'transport'],
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'disrupted', 'critical', 'offline'],
    default: 'operational'
  },
  details: {
    powerCapacity: Number,      // For powerplant
    patientCapacity: Number,    // For hospital
    flightDelays: Number,       // For airport
    staffingLevel: Number,      // Common for many facilities
    incidentCount: Number,      // For police/fire
    congestionLevel: Number,    // For transport
  },
  submodules: [submoduleSchema]
});

// Add method to calculate facility status
facilitySchema.methods.calculateStatus = function() {
  if (!this.submodules?.length) return 'offline';

  const statuses = this.submodules.map(sub => sub.calculateStatus());
  const criticalCount = statuses.filter(s => s === 'critical').length;
  const disruptedCount = statuses.filter(s => s === 'disrupted').length;
  const operationalCount = statuses.filter(s => s === 'operational').length;

  if (criticalCount > Math.floor(statuses.length / 3)) return 'critical';
  if (disruptedCount > Math.floor(statuses.length / 2)) return 'disrupted';
  if (operationalCount === statuses.length) return 'operational';
  return 'disrupted';
};

// Add pre-save middleware to update statuses
facilitySchema.pre('save', function(next) {
  // Update submodule statuses
  if (this.submodules) {
    this.submodules.forEach(submodule => {
      submodule.status = submodule.calculateStatus();
    });
  }
  
  // Update facility status
  this.status = this.calculateStatus();
  next();
});

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  weather: {
    type: String,
    required: true,
    default: 'clear'
  },
  facilities: [facilitySchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  // Add timestamps for debugging
  timestamps: true
});

// Add some debug logging
citySchema.pre('save', function(next) {
  console.log('Attempting to save city:', this);
  next();
});

citySchema.methods.calculateHealthStatus = function() {
  if (!this.facilities?.length) return 0;

  const facilityWeights = {
    powerplant: 1.2,  // Critical infrastructure
    hospital: 1.2,    // Critical services
    police: 1.0,
    fire: 1.0,
    transport: 0.8,
    airport: 0.8
  };

  let totalWeight = 0;
  let weightedScore = 0;

  this.facilities.forEach(facility => {
    const weight = facilityWeights[facility.type] || 1;
    totalWeight += weight;

    // Convert status to numeric score
    let statusScore;
    switch (facility.status) {
      case 'operational': statusScore = 100; break;
      case 'disrupted': statusScore = 60; break;
      case 'critical': statusScore = 30; break;
      case 'offline': statusScore = 0; break;
      default: statusScore = 0;
    }

    weightedScore += statusScore * weight;
  });

  return Math.round(weightedScore / totalWeight);
};

// Add health status to JSON representation
citySchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.healthStatus = this.calculateHealthStatus();
  return obj;
};

const City = mongoose.model('City', citySchema);

module.exports = City; 