const llmService = require('./llmService');
const sentimentService = require('./sentimentService');
const Post = require('../models/Post');
const City = require('../models/City');
const initializeCity = require('../utils/initializeCity');

class PostGenerationService {
  constructor(io) {
    this.io = io;
    this.llmService = new llmService();
  }

  async generatePostsForCity(cityId, modelName) {
    try {
      const city = await City.findById(cityId);
      if (!city) {
        throw new Error('City not found');
      }

      if (!city.facilities?.length) {
        throw new Error('No facilities found');
      }

      const numPosts = Math.floor(Math.random() * 3) + 1;
      const posts = [];

      for (let i = 0; i < numPosts; i++) {
        const numFacilities = Math.floor(Math.random() * 3) + 1;
        const shuffledFacilities = [...city.facilities].sort(() => Math.random() - 0.5);
        const selectedFacilities = shuffledFacilities.slice(0, numFacilities);
        const primaryFacility = selectedFacilities[0];

        const content = await this.llmService.generatePost(city, selectedFacilities, modelName);
        console.log('Generated content before saving:', content);
        
        const sentimentAnalysis = sentimentService.analyzeSentiment(content);

        const post = new Post({
          content,
          sentimentScore: sentimentAnalysis.score,
          cityRef: city._id,
          facilityRef: primaryFacility._id
        });

        await post.save();
        console.log('Saved post:', post.toObject());
        
        posts.push(post);

        if (this.io) {
          this.io.emit('newPost', {
            post: post.toObject(),
            cityName: city.name,
            facility: primaryFacility.type,
            relatedFacilities: selectedFacilities.slice(1).map(f => f.type),
            sentiment: sentimentAnalysis
          });
        }
      }

      return {
        success: true,
        posts,
        message: `Generated ${posts.length} posts successfully`
      };
    } catch (error) {
      console.error('Error generating posts:', error);
      return {
        success: false,
        message: error.message || 'Failed to generate posts'
      };
    }
  }

  async generatePostsForAllCities(modelName) {
    if (!modelName) {
      throw new Error('Model name is required');
    }

    const cities = await City.find();
    const results = await Promise.all(
      cities.map(city => this.generatePostsForCity(city._id, modelName))
    );

    const success = results.every(result => result.success);
    const posts = results.flatMap(result => result.posts || []);

    return {
      success,
      posts,
      message: success ? 'All posts generated successfully' : 'Some posts failed to generate'
    };
  }
}

module.exports = PostGenerationService; 