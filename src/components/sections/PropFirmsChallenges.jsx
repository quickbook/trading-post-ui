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
  Rating,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { filter } from "framer-motion/client";

// Sample data for prop firms
const sampleFirms = [
  {
    id: 1,
    name: "TopStep",
    daily_loss: 3,
    max_loss: 5,
    logo: "/static/images/avatar/1.jpg",
    profitTarget: 90,
    challenge_price: 165,
    trustRating: "A",
    trusted: true,
    features: ["No Time Limit", "Scaling Plan", "One-Step Evaluation"],
    phaseType: "One-Step",
    minAccount: 5000,
  },
  {
    id: 2,
    name: "FTMO",
    logo: "/static/images/avatar/2.jpg",
    daily_loss: 3,
    max_loss: 5,
    profitTarget: 90,
    challenge_price: 155,
    trustRating: "A",
    trusted: false,
    features: ["Free Retry", "Instant Funding", "Balance-Based Drawdown"],
    phaseType: "Two-Step",
    minAccount: 10000,
  },
  {
    id: 3,
    name: "FundedNext",
    daily_loss: 3,
    max_loss: 5,
    logo: "/static/images/avatar/3.jpg",
    profitTarget: 90,
    challenge_price: 99,
    trustRating: "A",
    trusted: false,
    features: ["15% Profit Target", "Express Model", "No Daily Drawdown"],
    phaseType: "Express",
    minAccount: 5000,
  },
  {
    id: 4,
    name: "Apex Trader Funding",
    logo: "/static/images/avatar/4.jpg",
    daily_loss: 3,
    max_loss: 5,
    profitTarget: 70,
    challenge_price: 85,
    trustRating: "A",
    trusted: true,
    features: ["Futures Only", "One-Time Fee", "No Scaling Fees"],
    phaseType: "One-Step",
    minAccount: 25000,
  },
  {
    id: 5,
    name: "The 5%ers",
    logo: "/static/images/avatar/5.jpg",
    daily_loss: 3,
    max_loss: 5,
    profitTarget: 50,
    challenge_price: 250,
    trustRating: "A",
    trusted: true,
    features: ["Instant Funding", "No Time Limit", "Scaling Plan"],
    phaseType: "Two-Step",
    minAccount: 6000,
  },
  {
    id: 6,
    name: "Funded Trading Plus",
    logo: "/static/images/avatar/6.jpg",
    daily_loss: 3,
    max_loss: 5,
    profitTarget: 80,
    challenge_price: 299,
    trustRating: "A",
    trusted: false,
    features: ["No Daily Drawdown", "Profit Sharing", "Monthly Payouts"],
    phaseType: "One-Step",
    minAccount: 15000,
  },
];

// Main Component
const PropFirmsChallenges = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("All");
  const [selectedPhase, setSelectedPhase] = useState("All");
  const [minAccountFilter, setMinAccountFilter] = useState("All");

  const navigate = useNavigate();

  // Get unique values for filters
  const firmNames = ["All", ...new Set(sampleFirms.map((firm) => firm.name))];
  const phaseTypes = [
    "All",
    ...new Set(sampleFirms.map((firm) => firm.phaseType)),
  ];
  const minAccountOptions = [
    "All",
    "$5,000",
    "$10,000",
    "$15,000",
    "$20,000",
    "$25,000+",
  ];

  // Filter firms based on criteria
  const filteredFirms = sampleFirms.filter((firm) => {
    const matchesSearch =
      firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firm.features.some((feature) =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFirm = selectedFirm === "All" || firm.name === selectedFirm;
    const matchesPhase =
      selectedPhase === "All" || firm.phaseType === selectedPhase;

    // Handle min account filter
    let matchesMinAccount = true;
    if (minAccountFilter !== "All") {
      const minAmount = parseInt(minAccountFilter.replace(/[$,+]/g, ""));
      if (minAccountFilter.includes("+")) {
        matchesMinAccount = firm.minAccount >= minAmount;
      } else {
        matchesMinAccount = firm.minAccount <= minAmount;
      }
    }

    return matchesSearch && matchesFirm && matchesPhase && matchesMinAccount;
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

  const handleMinAccountChange = (event) => {
    setMinAccountFilter(event.target.value);
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
          &larr; Back
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
            backgroundColor: "#000000",
            color: "#FFFFFF",
          }}
        >
          <Grid container spacing={3}>
            {/* Search Input */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                fullWidth
                placeholder="Search firms or features..."
                value={searchTerm}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
                  },
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
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                select
                fullWidth
                label="Firm Name"
                value={selectedFirm}
                onChange={handleFirmChange}
                sx={filterTextFieldStyles}
                slotProps={{
                  select: {
                    MenuProps: {
                      slotProps: {
                        paper: {
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
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                select
                fullWidth
                label="Phase Type"
                value={selectedPhase}
                onChange={handlePhaseChange}
                sx={filterTextFieldStyles}
                slotProps={{
                  select: {
                    MenuProps: {
                      slotProps: {
                        paper: {
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

            {/* Min Account Filter */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                select
                fullWidth
                label="Min Account Size"
                value={minAccountFilter}
                onChange={handleMinAccountChange}
                sx={filterTextFieldStyles}
                slotProps={{
                  select: {
                    MenuProps: {
                      slotProps: {
                        paper: {
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
                    },
                  },
                }}
              >
                {minAccountOptions.map((option) => (
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
              Showing {filteredFirms.length} of {sampleFirms.length} firms
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm("");
                setSelectedFirm("All");
                setSelectedPhase("All");
                setMinAccountFilter("All");
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

        {/* Firms Grid */}
        <FirmGridView firms={filteredFirms} />
      </Container>
    </Box>
  );
};

// Reusable Grid View Component
const FirmGridView = ({ firms }) => {
  if (firms.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          width: { xs: "100%", md: "1150px" },
          background:
            "linear-gradient(135deg, #eed6ffff 0%, #e2bcffff 40%, #b173f8ff 100%)",
        }}
      >
        <Typography variant="h6">
          No firms match your current filters.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Try adjusting your search criteria or filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {firms.map((firm) => (
        <Grid size={{ xs: 12 }} key={firm.id}>
          <FirmCard firm={firm} />
        </Grid>
      ))}
    </Grid>
  );
};

// Individual Firm Card Component
const FirmCard = ({ firm }) => {
  return (
    <Card
      sx={{
        minWidth: { xs: "100%", md: "1150px" },
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
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          minWidth: { md: 140 },
          bgcolor: "transparent",
          borderRight: { md: "1px solid" },
          borderColor: { md: "divider" },
        }}
      >
        <Avatar
          src={firm.logo}
          sx={{ width: 80, height: 80, bgcolor: "#4b0082" }}
          variant="rounded"
        >
          {firm.name.charAt(0)}
        </Avatar>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flex: "1 0 auto", p: 3 }}>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 2,
            }}
          >
            <Box>
              <Typography component="h2" variant="h5" gutterBottom>
                {firm.name}
              </Typography>
              <Chip
                label={firm.phaseType}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: { xs: 1, sm: 0 },
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Rating:{" "}
                <strong style={{ color: "#000000", marginRight: "16px" }}>
                  {firm.trustRating}
                </strong>
              </Typography>
              {firm.trusted && (
                <Chip label="Trusted" color="success" size="medium" />
              )}
            </Box>
          </Box>

          {/* Features Chips */}
          <Box sx={{ mb: 2 }}>
            {firm.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Details Grid */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Min Account
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ${firm.minAccount}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Profit Target
              </Typography>
              <Typography variant="h6" color="success.main" fontWeight="bold">
                {firm.profitTarget}%
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Daily Loss Limit
              </Typography>
              <Typography variant="h6" color="error" fontWeight="bold">
                {firm.daily_loss}%
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Max loss Limit
              </Typography>
              <Typography variant="h6" color="error" fontWeight="bold">
                {firm.max_loss}%
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Challenge Price
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                ${firm.challenge_price}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>

        {/* Action Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            bgcolor: "transparent",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Start your challenge today
          </Typography>
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
          >
            Apply Now
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

// Prop Types
FirmCard.propTypes = {
  firm: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    leverage: PropTypes.string.isRequired,
    profitTarget: PropTypes.string.isRequired,
    challenge_price: PropTypes.string.isRequired,
    trustRating: PropTypes.number.isRequired,
    trusted: PropTypes.bool.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    phaseType: PropTypes.string.isRequired,
    minAccount: PropTypes.number.isRequired,
  }).isRequired,
};

FirmGridView.propTypes = {
  firms: PropTypes.array.isRequired,
};

export default PropFirmsChallenges;
