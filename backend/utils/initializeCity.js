const City = require('../models/City');

async function initializeCity() {
  try {
    // Check if any city exists
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      console.log('No city found. Creating default city...');
      
      const defaultCity = new City({
        name: 'New City',
        weather: 'clear',
        facilities: [
          {
            name: 'Central Power Plant',
            type: 'powerplant',
            status: 'operational',
            details: {
              powerCapacity: 85
            },
            submodules: [
              {
                name: 'Solar Array',
                status: 'operational',
                details: { efficiency: 95, load: 80, errors: 0 }
              },
              {
                name: 'Wind Farm',
                status: 'operational',
                details: { efficiency: 85, load: 60, errors: 0 }
              },
              {
                name: 'Power Grid',
                status: 'operational',
                details: { efficiency: 90, load: 75, errors: 0 }
              }
            ]
          },
          {
            name: 'City General Hospital',
            type: 'hospital',
            status: 'operational',
            details: {
              patientCapacity: 75
            },
            submodules: [
              {
                name: 'Emergency Power',
                status: 'operational',
                details: { efficiency: 100, load: 20, errors: 0 }
              },
              {
                name: 'Life Support Systems',
                status: 'operational',
                details: { efficiency: 98, load: 65, errors: 0 }
              },
              {
                name: 'Medical Equipment',
                status: 'operational',
                details: { efficiency: 95, load: 70, errors: 0 }
              }
            ]
          },
          {
            name: 'International Airport',
            type: 'airport',
            status: 'operational',
            details: {
              flightDelays: 0
            },
            submodules: [
              {
                name: 'Radar System',
                status: 'operational',
                details: { efficiency: 100, load: 65, errors: 0 }
              },
              {
                name: 'Main Runway Lights',
                status: 'operational',
                details: { efficiency: 95, load: 70, errors: 0 }
              },
              {
                name: 'Secondary Runway Lights',
                status: 'operational',
                details: { efficiency: 90, load: 50, errors: 0 }
              }
            ]
          },
          {
            name: 'Police Headquarters',
            type: 'police',
            status: 'operational',
            details: {
              staffingLevel: 90
            }
          },
          {
            name: 'Fire Station 1',
            type: 'fire',
            status: 'operational',
            details: {
              incidentCount: 2
            }
          },
          {
            name: 'Transit Center',
            type: 'transport',
            status: 'operational',
            details: {
              congestionLevel: 30
            }
          }
        ]
      });

      await defaultCity.save();
      console.log('Default city created successfully');
    } else {
      console.log('City already exists, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing city:', error);
  }
}

module.exports = initializeCity; 