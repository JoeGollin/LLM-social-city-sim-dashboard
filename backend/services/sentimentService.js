const Sentiment = require('sentiment');
const sentiment = new Sentiment();

class SentimentService {
  analyzeSentiment(text) {
    console.log('Analyzing sentiment for text:', text);
    const result = sentiment.analyze(text);
    
    // Normalize score to range between -1 and 1
    const normalizedScore = result.score / Math.max(Math.abs(result.score), 1);
    
    console.log('Sentiment analysis result:', {
      score: normalizedScore,
      comparative: result.comparative
    });

    return {
      score: normalizedScore,
      comparative: result.comparative,
      tokens: result.tokens,
      positive: result.positive,
      negative: result.negative
    };
  }
}

module.exports = new SentimentService(); 