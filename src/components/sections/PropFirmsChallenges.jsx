import React, { useEffect, useState } from "react";
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
import { cardData } from "../../../CardsData";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChallenges,
  selectChallenges,
  selectChallengesError,
  selectChallengesStatus,
} from "../../features/challenges/challengesSlice";
import { LoadingScreen } from "../pages/HomePage";

// Main Component
const PropFirmsChallenges = ({firm = null}) => {
  const dispatch = useDispatch();
  const allChallenges = useSelector(selectChallenges);
  const challengesStatus = useSelector(selectChallengesStatus);
  const ChallengesError = useSelector(selectChallengesError);

  const [challengesDetails, setChallengesDetails] = useState(
    allChallenges ?? []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("All");
  const [selectedPhase, setSelectedPhase] = useState("All");
  const [maxAccountFilter, setMaxAccountFilter] = useState("All");
  const [sortBy, setSortBy] = useState("maxAccountSize");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchChallenges());
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(challengesStatus === 'loading' ? true : false)
    setChallengesDetails(allChallenges);
  }, [allChallenges]);

  // Get unique values for filters
  const firmNames = [
    "All",
    ...new Set(challengesDetails?.map((challenge) => challenge?.firmName)),
  ];
  const phaseTypes = [
    "All",
    ...new Set(challengesDetails?.map((challenge) => challenge?.phase)),
  ];

  const maxAccountOptions = [
    "All",
    "$5,000",
    "$10,000",
    "$25,000",
    "$50,000",
    "$100,000",
    "$500,000+",
  ];

  // Filter challenges based on criteria
  const filteredChallenges = challengesDetails?.filter((challenge) => {
    const matchesSearch =
      challenge?.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge?.tier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge?.phase.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFirm =
      firm ? challenge?.firmName === firm :(selectedFirm === "All" || challenge?.firmName === selectedFirm);
    const matchesPhase =
      selectedPhase === "All" || challenge?.phase === selectedPhase;

    // Handle max account filter
    let matchesMaxAccount = true;
    if (maxAccountFilter !== "All") {
      const maxAmount = parseInt(maxAccountFilter.replace(/[$,+]/g, ""));
      if (maxAccountFilter.includes("+")) {
        matchesMaxAccount = challenge?.accountSizeUsd >= maxAmount;
      } else {
        matchesMaxAccount = challenge?.accountSizeUsd <= maxAmount;
      }
    }

    return matchesSearch && matchesFirm && matchesPhase && matchesMaxAccount;
  });

  // Sort challenges
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case "maxAccountSize":
        return b.accountSizeUsd - a.accountSizeUsd;
      case "minAccountSize":
        return a.accountSizeUsd - b.accountSizeUsd;
      case "priceLow":
        return a.price.amount - b.price.amount;
      case "priceHigh":
        return b.price.amount - a.price.amount;
      case "profitTarget":
        return b.profitTargetPct - a.profitTargetPct;
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

  return isLoading ? <LoadingScreen /> :(
    <Box>
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
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
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
          {!firm && <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <TextField
              select
              fullWidth
              label="Firm Name"
              value={firm ? firm : selectedFirm}
              disabled={firm}
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
          </Grid>}

          {/* Phase Type Select */}
          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
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
          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
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
                <MenuItem key={option} value={option} sx={{ color: "#FFFFFF" }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Sort By */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
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
              <MenuItem value="minAccountSize" sx={{ color: "#FFFFFF" }}>
                Min Account Size (Low to High)
              </MenuItem>
              <MenuItem value="priceHigh" sx={{ color: "#FFFFFF" }}>
                Price (High to Low)
              </MenuItem>
              <MenuItem value="priceLow" sx={{ color: "#FFFFFF" }}>
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
            Showing {sortedChallenges?.length} of {challengesDetails?.length}{" "}
            challenges
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
      <ChallengesGridView challenges={sortedChallenges} challengesStatus={challengesStatus} />
    </Box>
  );
};

// Reusable Grid View Component
const ChallengesGridView = ({ challenges, challengesStatus }) => {
  if (challenges.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          my: 4,
          textAlign: "center",
          width: "100%",
          background:
            "linear-gradient(135deg, #eed6ffff 0%, #e2bcffff 40%, #b173f8ff 100%)",
        }}
      >
        <Typography variant="h6">{challengesStatus === 'loading'? "Loading Challenges..." :"No challenges found."}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Try adjusting your search criteria or filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {challenges.map((challenge) => (
        <Grid size={{ xs: 12 }} key={challenge?.id}>
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
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
          variant="rounded"
        >
          {challenge?.firmName.charAt(0)}
        </Avatar>
      </Box>

      {/* Middle Section - Challenge Details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 3,
        }}
      >
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
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
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
              color: "#4b0082",
            }}
          />
        </Box>

        {/* Trading Metrics */}
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Profit Target:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {challenge?.profitTargetPct}%
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Daily Loss Limit:
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="error.main">
              {challenge?.dailyLossPct}%
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Max Loss Limit:
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="error.main">
              {challenge?.maxLossPct}%
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
            ${foreignNumberSystem(challenge?.accountSizeUsd)}
          </Typography>
          <Typography variant="body1">
            Price: <strong>${challenge?.price.amount}</strong>
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
          onClick={() => window.open(challenge?.buyUrl, "_blank")}
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
    buyUrl: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    phase: PropTypes.string.isRequired,
    profitTarget: PropTypes.number.isRequired,
    dailyLoss: PropTypes.number.isRequired,
    maxLoss: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    accountSizeUsd: PropTypes.number.isRequired,
  }).isRequired,
};

ChallengesGridView.propTypes = {
  challenges: PropTypes.array.isRequired,
};

export default PropFirmsChallenges;
