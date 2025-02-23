const City = require('../models/City');

const facilitySubmodules = {
  powerplant: [
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
  ],
  hospital: [
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
  ],
  airport: [
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
  ],
  police: [
    {
      name: 'Communications',
      status: 'operational',
      details: { efficiency: 95, load: 70, errors: 0 }
    },
    {
      name: 'Dispatch System',
      status: 'operational',
      details: { efficiency: 98, load: 65, errors: 0 }
    }
  ],
  fire: [
    {
      name: 'Emergency Response System',
      status: 'operational',
      details: { efficiency: 100, load: 50, errors: 0 }
    },
    {
      name: 'Water Supply',
      status: 'operational',
      details: { efficiency: 95, load: 40, errors: 0 }
    }
  ],
  transport: [
    {
      name: 'Traffic Control',
      status: 'operational',
      details: { efficiency: 90, load: 75, errors: 0 }
    },
    {
      name: 'Signaling System',
      status: 'operational',
      details: { efficiency: 95, load: 65, errors: 0 }
    }
  ]
};

async function updateFacilitiesWithSubmodules() {
  try {
    const city = await City.findOne();
    if (!city) {
      console.log('No city found');
      return;
    }

    // Update each facility with its submodules
    city.facilities = city.facilities.map(facility => {
      if (!facility.submodules || facility.submodules.length === 0) {
        facility.submodules = facilitySubmodules[facility.type] || [];
      }
      return facility;
    });

    await city.save();
    console.log('Successfully updated facilities with submodules');
  } catch (error) {
    console.error('Error updating facilities:', error);
  }
}

module.exports = updateFacilitiesWithSubmodules; 