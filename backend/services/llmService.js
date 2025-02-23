const axios = require('axios');

class LLMService {
  constructor() {
    this.baseURL = 'http://127.0.0.1:11434/api/generate';
    this.MAX_POST_LENGTH = 280;
  }

  createPrompt(context) {
    const { cityName, cityHealth, facilities, sentimentGuideline } = context;
    
    let prompt = `Generate a VERY brief social media post about ${cityName}. 
      The post MUST be under ${this.MAX_POST_LENGTH} characters.
      The city is ${sentimentGuideline.description}.
      Write in a ${sentimentGuideline.tone} tone.
      Use natural, conversational language.
      
      Context:`;

    facilities.forEach(facility => {
      prompt += `\n- The ${facility.type} ${facility.name} is ${facility.status}`;
      
      const criticalSubmodules = facility.submodules
        .filter(sub => sub.status !== 'operational')
        .map(sub => `${sub.name} (${sub.status})`);
      
      if (criticalSubmodules.length > 0) {
        prompt += `. Issues with: ${criticalSubmodules.join(', ')}`;
      }
    });

    if (cityHealth < 40) {
      prompt += "\nTone: Express serious concern about the city's infrastructure.";
    } else if (cityHealth > 80) {
      prompt += "\nTone: Highlight the exceptional quality of city services.";
    }

    prompt += `\n\nRemember:
      - Keep it under ${this.MAX_POST_LENGTH} characters
      - Don't mention specific numbers or percentages
      - Be concise and direct
      - Use natural language to describe facilities and their issues`;

    return prompt;
  }

  formatResponse(content) {
    // Just clean up spacing and ensure length limit
    let formatted = content
      .replace(/\s+/g, ' ')
      .trim();

    if (formatted.length > this.MAX_POST_LENGTH) {
      formatted = formatted.substring(0, this.MAX_POST_LENGTH - 3) + '...';
    }

    return formatted;
  }

  async generatePost(city, selectedFacilities, modelName) {
    const cityHealth = city.calculateHealthStatus();
    const sentimentGuideline = this.getSentimentGuideline(cityHealth);
    
    const context = {
      cityName: city.name,
      cityHealth,
      facilities: selectedFacilities,
      sentimentGuideline
    };

    const prompt = this.createPrompt(context);
    
    try {
      const response = await this.generateFromModel(modelName, prompt);
      const formattedContent = this.formatResponse(response);
      return formattedContent;
    } catch (error) {
      console.error('Error generating post:', error);
      throw error;
    }
  }

  getSentimentGuideline(healthScore) {
    if (healthScore >= 90) return { tone: 'very positive', description: 'thriving' };
    if (healthScore >= 75) return { tone: 'positive', description: 'doing well' };
    if (healthScore >= 60) return { tone: 'slightly positive', description: 'stable' };
    if (healthScore >= 40) return { tone: 'neutral', description: 'facing some challenges' };
    if (healthScore >= 25) return { tone: 'negative', description: 'struggling' };
    return { tone: 'very negative', description: 'in crisis' };
  }

  async generateFromModel(modelName, prompt) {
    if (!modelName) throw new Error('Model name is required');
    if (!prompt) throw new Error('Prompt is required');

    try {
      const response = await axios.post(this.baseURL, {
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: Math.floor(this.MAX_POST_LENGTH / 2),
        }
      });

      if (!response.data?.response) {
        throw new Error('Invalid response from Ollama');
      }

      // Just clean up basic formatting, actual highlighting will be done in formatResponse
      return response.data.response
        .trim()
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ');

    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw error;
    }
  }
}

module.exports = LLMService; 