import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Container,
  Tabs,
  Tab,
  Divider,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

// Color constants
const colors = {
  black: '#000000',
  purple: '#6A0DAD',
  gold: '#FFD700',
  white: '#FFFFFF'
};

// Mock data for challenges
const challengesData = [
  {
    id: 1,
    title: "Beginner Challenge",
    description: "Perfect for traders starting their journey",
    difficulty: "Easy",
    profitTarget: "8%",
    maxDrawdown: "5%",
    timeLimit: "30 Days",
    price: "$99",
    popular: false
  },
  {
    id: 2,
    title: "Professional Challenge",
    description: "For experienced traders seeking growth",
    difficulty: "Medium",
    profitTarget: "10%",
    maxDrawdown: "6%",
    timeLimit: "60 Days",
    price: "$199",
    popular: true
  },
  {
    id: 3,
    title: "Elite Challenge",
    description: "The ultimate test for master traders",
    difficulty: "Hard",
    profitTarget: "12%",
    maxDrawdown: "4%",
    timeLimit: "90 Days",
    price: "$299",
    popular: false
  }
];

const ChallengesTab = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to previous page
  };

  return (
    <Box sx={{ backgroundColor: colors.black, minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{
              color: colors.gold,
              borderColor: colors.gold,
              '&:hover': {
                borderColor: colors.gold,
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
              }
            }}
            variant="outlined"
          >
            Back
          </Button>
        </Box>

        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              color: colors.white,
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Trading Challenges
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: colors.gold,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Choose your challenge and prove your trading skills to unlock funding opportunities
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: colors.purple, mb: 4 }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            textColor="inherit"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: colors.gold,
              },
            }}
          >
            <Tab 
              label="All Challenges" 
              sx={{ 
                color: colors.white,
                '&.Mui-selected': { color: colors.gold }
              }} 
            />
            <Tab 
              label="Beginner" 
              sx={{ 
                color: colors.white,
                '&.Mui-selected': { color: colors.gold }
              }} 
            />
            <Tab 
              label="Professional" 
              sx={{ 
                color: colors.white,
                '&.Mui-selected': { color: colors.gold }
              }} 
            />
            <Tab 
              label="Elite" 
              sx={{ 
                color: colors.white,
                '&.Mui-selected': { color: colors.gold }
              }} 
            />
          </Tabs>
        </Box>

        {/* Challenges Grid */}
        <Grid container spacing={4}>
          {challengesData.map((challenge) => (
            <Grid item xs={12} md={4} key={challenge.id}>
              <Card 
                sx={{ 
                  backgroundColor: 'rgba(106, 13, 173, 0.1)',
                  border: `2px solid ${challenge.popular ? colors.gold : colors.purple}`,
                  borderRadius: 2,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: colors.gold
                  },
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {challenge.popular && (
                  <Chip
                    label="MOST POPULAR"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: colors.gold,
                      color: colors.black,
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}
                  />
                )}
                
                <CardContent sx={{ p: 4 }}>
                  {/* Challenge Header */}
                  <Box textAlign="center" mb={3}>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{ 
                        color: colors.white,
                        fontWeight: 'bold',
                        mb: 1
                      }}
                    >
                      {challenge.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ color: colors.gold }}
                    >
                      {challenge.description}
                    </Typography>
                  </Box>

                  <Divider sx={{ backgroundColor: colors.purple, mb: 3 }} />

                  {/* Challenge Details */}
                  <Box sx={{ mb: 3 }}>
                    <DetailRow label="Difficulty" value={challenge.difficulty} />
                    <DetailRow label="Profit Target" value={challenge.profitTarget} />
                    <DetailRow label="Max Drawdown" value={challenge.maxDrawdown} />
                    <DetailRow label="Time Limit" value={challenge.timeLimit} />
                  </Box>

                  <Divider sx={{ backgroundColor: colors.purple, mb: 3 }} />

                  {/* Price and CTA */}
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: colors.gold,
                        fontWeight: 'bold',
                        mb: 2
                      }}
                    >
                      {challenge.price}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: challenge.popular ? colors.gold : colors.purple,
                        color: challenge.popular ? colors.black : colors.white,
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        '&:hover': {
                          backgroundColor: challenge.popular ? '#FFED4E' : '#7B1FA2',
                        }
                      }}
                    >
                      Start Challenge
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer CTA */}
        <Box textAlign="center" mt={8}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: colors.white,
              mb: 3
            }}
          >
            Ready to take your trading to the next level?
          </Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: colors.gold,
              color: colors.gold,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: colors.gold,
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
              }
            }}
          >
            View All Challenges
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// Helper component for challenge details
const DetailRow = ({ label, value }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2
    }}
  >
    <Typography variant="body2" sx={{ color: colors.white }}>
      {label}
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        color: colors.gold,
        fontWeight: 'bold'
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default ChallengesTab;