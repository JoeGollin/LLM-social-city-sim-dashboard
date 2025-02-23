import React from 'react';
import { Paper, Typography, Box, Stack, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const HealthChip = styled(Chip)(({ theme, health }) => ({
  backgroundColor: health >= 75 ? theme.palette.success.main :
                  health >= 50 ? theme.palette.warning.main :
                  theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const StatChip = styled(Chip)(({ theme, type }) => ({
  backgroundColor: type === 'positive' ? theme.palette.success.light :
                  type === 'negative' ? theme.palette.error.light :
                  theme.palette.grey[300],
  color: type === 'neutral' ? theme.palette.text.primary : theme.palette.common.white,
  '& .MuiChip-label': {
    fontWeight: 500
  }
}));

function SentimentOverview({ posts, cityHealth }) {
  const getHealthStatus = (health) => {
    if (health >= 75) return 'Healthy';
    if (health >= 50) return 'Warning';
    return 'Critical';
  };

  const calculateSentimentStats = () => {
    if (!posts || posts.length === 0) {
      return {
        average: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0,
        summary: 'No posts yet'
      };
    }

    const stats = posts.reduce((acc, post) => {
      if (post.sentimentScore > 0) acc.positive++;
      else if (post.sentimentScore < 0) acc.negative++;
      else acc.neutral++;
      
      acc.total += post.sentimentScore;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0, total: 0 });

    stats.average = (stats.total / posts.length).toFixed(2);
    
    // Calculate sentiment summary
    const total = posts.length;
    const positiveRatio = stats.positive / total;
    const negativeRatio = stats.negative / total;

    if (total < 5) {
      stats.summary = 'Not enough data';
    } else if (positiveRatio > 0.6) {
      stats.summary = 'Overwhelmingly positive';
    } else if (positiveRatio > 0.4) {
      stats.summary = 'Generally positive';
    } else if (negativeRatio > 0.6) {
      stats.summary = 'Overwhelmingly negative';
    } else if (negativeRatio > 0.4) {
      stats.summary = 'Generally negative';
    } else {
      stats.summary = 'Mixed sentiment';
    }

    return stats;
  };

  const stats = calculateSentimentStats();

  return (
    <Paper sx={{ p: 2, minWidth: 300 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            City Health
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <HealthChip
              label={`${Math.round(cityHealth)}%`}
              health={cityHealth}
            />
            <Typography variant="body2">
              {getHealthStatus(cityHealth)}
            </Typography>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Sentiment Analysis
          </Typography>
          <Stack spacing={1}>
            <Box>
              <Typography variant="body2">
                Average: {stats.average}
              </Typography>
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ fontStyle: 'italic' }}
              >
                {stats.summary}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <StatChip
                type="positive"
                size="small"
                label={`${stats.positive} Positive`}
              />
              <StatChip
                type="neutral"
                size="small"
                label={`${stats.neutral} Neutral`}
              />
              <StatChip
                type="negative"
                size="small"
                label={`${stats.negative} Negative`}
              />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

export default SentimentOverview; 