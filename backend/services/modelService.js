const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class ModelService {
  async getAvailableModels() {
    try {
      console.log('Fetching models from Ollama CLI...');
      const { stdout } = await execPromise('ollama list');
      console.log('Raw Ollama output:', stdout);

      // Parse the CLI output
      // Skip the header line and empty lines
      const lines = stdout.split('\n').slice(1).filter(line => line.trim());
      
      const models = lines.map(line => {
        const [name, id, size, modified] = line.split(/\s+/).filter(Boolean);
        return {
          name,
          id,
          size,
          modified: `${modified} ${size}`  // Combine the "time ago" with units
        };
      });

      console.log('Processed models:', models);
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      if (error.stderr) {
        console.error('CLI Error:', error.stderr);
      }
      return [];
    }
  }
}

module.exports = new ModelService(); 