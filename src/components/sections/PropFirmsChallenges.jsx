import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { foreignNumberSystem } from "../commonFuctions/CommonFunctions";

// Sample data for prop firms challenges (individual challenge objects)
export const sampleFirmChallenges = [
  {
    id: 1,
    firmName: "Gilmer",
    firmPageURL: 'https://gilmer.com/ref/123/',
    logo: "/firms/gilmer.png",
    firmType: 'standard',
    tier: "Two Step Path",
    phase: "2-Phase",
    profitTarget: 13,
    dailyLoss: 5,
    maxLoss: 10,
    price: 15,
    maxAccountSize: 2000
  },
  {
    id: 2,
    firmName: "Alpha Trading Group",
    firmPageURL: 'https://alphafunded.com/ref/1491/',
    logo: "/firms/alpha-trading.png",
    firmType: 'premium',
    tier: "King",
    phase: "1-Phase",
    profitTarget: 25,
    dailyLoss: 3,
    maxLoss: 5,
    price: 2000,
    maxAccountSize: 1000000
  },
  {
    id: 3,
    firmName: "Alpha Trading Group",
    firmPageURL: 'https://alphafunded.com/ref/1491/',
    logo: "/firms/alpha-trading.png",
    firmType: 'premium',
    tier: "Duke",
    phase: "2-Phase",
    profitTarget: 20,
    dailyLoss: 4,
    maxLoss: 6,
    price: 1500,
    maxAccountSize: 500000
  },
  {
    id: 4,
    firmName: "Blue Guardian",
    firmPageURL: 'https://blueguardian.com/ref/456/',
    logo: "/firms/blue-guardian.png",
    firmType: 'premium',
    tier: "Guardian",
    phase: "1-Phase",
    profitTarget: 15,
    dailyLoss: 4,
    maxLoss: 8,
    price: 99,
    maxAccountSize: 50000
  },
  {
    id: 5,
    firmName: "Apex Trader Funding",
    firmPageURL: 'https://apextrader.com/ref/789/',
    logo: "/firms/apex-trader.png",
    firmType: 'standard',
    tier: "Pro",
    phase: "Instant-Funding",
    profitTarget: 20,
    dailyLoss: 3,
    maxLoss: 6,
    price: 85,
    maxAccountSize: 25000
  },
  {
    id: 6,
    firmName: "The 5%ers",
    firmPageURL: 'https://the5ers.com/ref/101/',
    logo: "/firms/5percenters.png",
    firmType: 'standard',
    tier: "One-stage",
    phase: "Funded",
    profitTarget: 50,
    dailyLoss: 3,
    maxLoss: 5,
    price: 250,
    maxAccountSize: 6000
  },
  {
    id: 7,
    firmName: "Funded Trading Plus",
    firmPageURL: 'https://fundedtradingplus.com/ref/202/',
    logo: "/firms/funded-trading-plus.png",
    firmType: 'premium',
    tier: "1 Step",
    phase: "Instant-Funding",
    profitTarget: 80,
    dailyLoss: 3,
    maxLoss: 5,
    price: 299,
    maxAccountSize: 15000
  },
  {
    id: 8,
    firmName: "Gilmer",
    firmPageURL: 'https://gilmer.com/ref/123/',
    logo: "/firms/gilmer.png",
    firmType: 'standard',
    tier: "One-stage",
    phase: "1-Phase",
    profitTarget: 10,
    dailyLoss: 6,
    maxLoss: 12,
    price: 25,
    maxAccountSize: 1000
  }
];

// Main Component
const PropFirmsChallenges = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("All");
  const [selectedPhase, setSelectedPhase] = useState("All");
  const [maxAccountFilter, setMaxAccountFilter] = useState("All");
  const [sortBy, setSortBy] = useState("maxAccountSize");

  const navigate = useNavigate();
  
  const allChallenges = sampleFirmChallenges;

  // Get unique values for filters
  const firmNames = ["All", ...new Set(allChallenges?.map((challenge) => challenge?.firmName))];
  const phaseTypes = [
    "All",
    ...new Set(allChallenges?.map((challenge) => challenge?.phase)),
  ];
  
  const maxAccountOptions = [
    "All",
    "$1,000",
    "$2,000",
    "$10,000",
    "$25,000",
    "$50,000",
    "$100,000+",
  ];

  // Filter challenges based on criteria
  const filteredChallenges = allChallenges?.filter((challenge) => {
    const matchesSearch =
      challenge?.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge?.tier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge?.phase.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFirm = selectedFirm === "All" || challenge?.firmName === selectedFirm;
    const matchesPhase = selectedPhase === "All" || challenge?.phase === selectedPhase;

    // Handle max account filter
    let matchesMaxAccount = true;
    if (maxAccountFilter !== "All") {
      const maxAmount = parseInt(maxAccountFilter.replace(/[$,+]/g, ""));
      if (maxAccountFilter.includes("+")) {
        matchesMaxAccount = challenge?.maxAccountSize >= maxAmount;
      } else {
        matchesMaxAccount = challenge?.maxAccountSize <= maxAmount;
      }
    }

    return matchesSearch && matchesFirm && matchesPhase && matchesMaxAccount;
  });

  // Sort challenges
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case "maxAccountSize":
        return b.maxAccountSize - a.maxAccountSize;
      case "price":
        return a.price - b.price;
      case "profitTarget":
        return b.profitTarget - a.profitTarget;
      default:
        return 0;
    }
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFirmChange = (event) => {
    setSelectedFirm(event.target.value);
  };

  const handlePhaseChange = (event) => {
    setSelectedPhase(event.target.value);
  };

  const handleMaxAccountChange = (event) => {
    setMaxAccountFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filterTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#1A1A1A",
      "& fieldset": {
        borderColor: "#333333",
      },
      "&:hover fieldset": {
        borderColor: "#666666",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#FFFFFF",
      },
    },
    "& .MuiInputBase-input": {
      color: "#FFFFFF",
    },
    "& .MuiInputLabel-root": {
      color: "#FFFFFF",
    },
    "& .MuiSelect-icon": {
      color: "#FFFFFF",
    },
  };

  return (
    <Box sx={{ py: 1 }}>
      <Container maxWidth="lg">
        <Button
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        
        {/* Header */}
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mb: 4,
            bgcolor: "rgba(255,255,255,0.12)",
            p: 3,
            borderRadius: 2,
            border: "1px solid #cecece",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: 2,
              color: "#ffffff",
            }}
          >
            Trading Post Challenges
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 2,
              maxWidth: "600px",
              mx: "auto",
              color: "#cecece",
            }}
          >
            Find the perfect prop firm challenge that matches your trading style
            and goals
          </Typography>
        </Box>

        {/* Filter Controls */}
        <Paper
          sx={{
            width: "100%",
            p: 3,
            mb: 4,
            borderRadius: 2,
            backgroundColor: "#000000a9",
            color: "#FFFFFF",
          }}
        >
          <Grid container spacing={3}>
            {/* Search Input */}
            <Grid size={{xs:12, md: 6, lg:3}}>
              <TextField
                fullWidth
                placeholder="Search firms, tiers or phases..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#1A1A1A",
                    "& fieldset": {
                      borderColor: "#333333",
                    },
                    "&:hover fieldset": {
                      borderColor: "#666666",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FFFFFF",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#FFFFFF",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#FFFFFF",
                  },
                }}
              />
            </Grid>

            {/* Firm Name Select */}
            <Grid size={{xs:12, md: 6, lg:2}}>
              <TextField
                select
                fullWidth
                label="Firm Name"
                value={selectedFirm}
                onChange={handleFirmChange}
                sx={filterTextFieldStyles}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#1A1A1A",
                        color: "white",
                        "& .MuiMenuItem-root": {
                          "&:hover": {
                            backgroundColor: "#333333",
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {firmNames.map((firm) => (
                  <MenuItem key={firm} value={firm} sx={{ color: "#FFFFFF" }}>
                    {firm}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Phase Type Select */}
            <Grid size={{xs:12, md: 6, lg:2}}>
              <TextField
                select
                fullWidth
                label="Phase Type"
                value={selectedPhase}
                onChange={handlePhaseChange}
                sx={filterTextFieldStyles}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#1A1A1A",
                        color: "white",
                        "& .MuiMenuItem-root": {
                          "&:hover": {
                            backgroundColor: "#333333",
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {phaseTypes.map((phase) => (
                  <MenuItem key={phase} value={phase} sx={{ color: "#FFFFFF" }}>
                    {phase}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Max Account Filter */}
            <Grid size={{xs:12, md: 6, lg:2}}>
              <TextField
                select
                fullWidth
                label="Max Account Size"
                value={maxAccountFilter}
                onChange={handleMaxAccountChange}
                sx={filterTextFieldStyles}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#1A1A1A",
                        color: "white",
                        "& .MuiMenuItem-root": {
                          "&:hover": {
                            backgroundColor: "#333333",
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {maxAccountOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{ color: "#FFFFFF" }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Sort By */}
            <Grid size={{xs:12, md: 6, lg:3}}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortBy}
                onChange={handleSortChange}
                sx={filterTextFieldStyles}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#1A1A1A",
                        color: "white",
                        "& .MuiMenuItem-root": {
                          "&:hover": {
                            backgroundColor: "#333333",
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="maxAccountSize" sx={{ color: "#FFFFFF" }}>
                  Max Account Size (High to Low)
                </MenuItem>
                <MenuItem value="price" sx={{ color: "#FFFFFF" }}>
                  Price (Low to High)
                </MenuItem>
                <MenuItem value="profitTarget" sx={{ color: "#FFFFFF" }}>
                  Profit Target (High to Low)
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Results Count */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
              Showing {sortedChallenges?.length} of {allChallenges?.length} challenges
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm("");
                setSelectedFirm("All");
                setSelectedPhase("All");
                setMaxAccountFilter("All");
                setSortBy("maxAccountSize");
              }}
              sx={{
                color: "#FFFFFF",
                borderColor: "#FFFFFF",
                "&:hover": {
                  borderColor: "#FFFFFF",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>

        {/* Challenges Grid */}
        <ChallengesGridView challenges={sortedChallenges} />
      </Container>
    </Box>
  );
};

// Reusable Grid View Component
const ChallengesGridView = ({ challenges }) => {
  if (challenges.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          width: "100%",
          background:
            "linear-gradient(135deg, #eed6ffff 0%, #e2bcffff 40%, #b173f8ff 100%)",
        }}
      >
        <Typography variant="h6">
          No challenges match your current filters.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Try adjusting your search criteria or filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {challenges.map((challenge) => (
        <Grid size={{xs: 12}} key={challenge?.id}>
          <ChallengeCard challenge={challenge} />
        </Grid>
      ))}
    </Grid>
  );
};

// Individual Challenge Card Component
const ChallengeCard = ({ challenge }) => {
  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        transition: "all 0.3s ease-in-out",
        background:
          "linear-gradient(135deg, #eed6ffff 0%, #e2bcffff 40%, #b173f8ff 100%)",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
        borderRadius: 2,
        overflow: "hidden",
        minHeight: 200,
      }}
    >
      {/* Left Section - Logo and Basic Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          minWidth: { md: 120 },
          bgcolor: "transparent",
          borderRight: { md: "1px solid" },
          borderColor: { md: "divider" },
        }}
      >
        <Avatar
          src={challenge?.logo}
          sx={{ 
            width: 60, 
            height: 60, 
            bgcolor: "#4b0082",
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
          variant="rounded"
        >
          {challenge?.firmName.charAt(0)}
        </Avatar>
      </Box>

      {/* Middle Section - Challenge Details */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        flexGrow: 1,
        p: 3 
      }}>
        {/* Firm Name and Tier */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: "bold", color: "#4b0082" }}
          >
            {challenge?.firmName}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {challenge?.tier}
          </Typography>
          <Chip
            label={challenge?.phase}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ 
              fontWeight: "bold",
              borderColor: "#4b0082",
              color: "#4b0082"
            }}
          />
        </Box>

        {/* Trading Metrics */}
        <Box sx={{ display: "flex", gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Profit Target:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {challenge?.profitTarget}%
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Daily Loss Limit:
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="error.main">
              {challenge?.dailyLoss}%
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Max Loss Limit:
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="error.main">
              {challenge?.maxLoss}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Section - Price and Action */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          p: 3,
          minWidth: { md: 200 },
          bgcolor: "transparent",
          borderLeft: { md: "1px solid" },
          borderColor: { md: "divider" },
        }}
      >
        {/* Account Size and Price */}
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            ${foreignNumberSystem(challenge?.maxAccountSize)}
          </Typography>
          <Typography variant="body1">
            Price: <strong>${challenge?.price}</strong>
          </Typography>
        </Box>

        {/* Buy Now Button */}
        <Button
          variant="contained"
          size="large"
          sx={{
            minWidth: 120,
            borderRadius: 2,
            fontWeight: "bold",
            bgcolor: "#4b0082",
            "&:hover": {
              bgcolor: "#5a1a8c",
            },
          }}
          onClick={() => window.open(challenge?.firmPageURL, '_blank')}
        >
          Buy Now
        </Button>
      </Box>
    </Card>
  );
};

// Prop Types
ChallengeCard.propTypes = {
  challenge: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firmName: PropTypes.string.isRequired,
    firmPageURL: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    phase: PropTypes.string.isRequired,
    profitTarget: PropTypes.number.isRequired,
    dailyLoss: PropTypes.number.isRequired,
    maxLoss: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    maxAccountSize: PropTypes.number.isRequired,
  }).isRequired,
};

ChallengesGridView.propTypes = {
  challenges: PropTypes.array.isRequired,
};

export default PropFirmsChallenges;