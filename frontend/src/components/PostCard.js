import React from 'react';
import { Card, CardContent, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HighlightedLink = styled(Link)(({ theme }) => ({
  color: theme.palette.warning.main,
  fontWeight: 500,
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
    opacity: 0.8
  }
}));

function PostCard({ post, facilities }) {
  const navigate = useNavigate();

  const renderContent = (content) => {
    if (!content || !facilities) return content;

    let result = content;
    const words = result.split(/\s+/);
    
    return words.map((word, index) => {
      // Check if word matches a facility name or type
      const facility = facilities.find(f => 
        word.toLowerCase().includes(f.name.toLowerCase()) ||
        word.toLowerCase().includes(f.type.toLowerCase())
      );

      // Check if word matches a submodule name
      const facilityWithSubmodule = facilities.find(f => 
        f.submodules?.some(sub => 
          word.toLowerCase().includes(sub.name.toLowerCase())
        )
      );

      const submodule = facilityWithSubmodule?.submodules?.find(sub => 
        word.toLowerCase().includes(sub.name.toLowerCase())
      );

      if (facility) {
        return (
          <React.Fragment key={index}>
            <HighlightedLink
              component="button"
              onClick={() => navigate(`/facility/${facility._id}`)}
            >
              {word}
            </HighlightedLink>
            {' '}
          </React.Fragment>
        );
      } else if (submodule) {
        return (
          <React.Fragment key={index}>
            <HighlightedLink
              component="button"
              onClick={() => navigate(`/facility/${facilityWithSubmodule._id}`)}
            >
              {word}
            </HighlightedLink>
            {' '}
          </React.Fragment>
        );
      }

      return <React.Fragment key={index}>{word} </React.Fragment>;
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="body1" component="div">
          {renderContent(post.content)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PostCard; 