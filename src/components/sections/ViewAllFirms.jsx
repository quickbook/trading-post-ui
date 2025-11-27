import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Edit,
  Delete,
  Star,
  Handshake,
  VerifiedUser,
  Search,
} from "@mui/icons-material";
import { selectFirms } from "../../features/firms/firmsSelectors";
import { useSelector } from "react-redux";

const ViewAllFirms = ({ onEdit, onDelete }) => {
  const allFirms = useSelector(selectFirms);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [firmNameFilter, setFirmNameFilter] = useState("");

  // Get unique firm names for filter
  const firmNames = useMemo(() => {
    return [...new Set(allFirms?.map(firm => firm.name))].sort();
  }, [allFirms]);

  // Get unique ratings for filter
  const ratings = useMemo(() => {
    return [...new Set(allFirms?.map(firm => firm.rating))].sort();
  }, [allFirms]);

  // Filter firms based on search and filter criteria
  const filteredFirms = useMemo(() => {
    return allFirms?.filter(firm => {
      const matchesSearch = searchTerm === "" || 
        firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (firm.tradingConditions?.discountCode && firm.tradingConditions.discountCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRating = ratingFilter === "" || firm.rating === ratingFilter;
      const matchesFirmName = firmNameFilter === "" || firm.name === firmNameFilter;

      return matchesSearch && matchesRating && matchesFirmName;
    });
  }, [allFirms, searchTerm, ratingFilter, firmNameFilter]);

  const getBadgeIcon = (firmType) => {
    switch (firmType) {
      case "premium":
        return <Star sx={{ fontSize: 16 }} />;
      case "trusted":
        return <VerifiedUser sx={{ fontSize: 16 }} />;
      case "partner":
      default:
        return <Handshake sx={{ fontSize: 16 }} />;
    }
  };

  const getBadgeColor = (firmType) => {
    switch (firmType) {
      case "premium":
        return "#ffd700";
      case "trusted":
        return "#4b0082";
      case "partner":
      default:
        return "#2e7d32";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRatingFilter("");
    setFirmNameFilter("");
  };

  if (allFirms.length === 0) {
    return (
      <Paper sx={{ width: {xs:'100%',lg:960,xl:'75vw'}, p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No firms added yet. Click "Add New Firm" to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{width: {xs:'100%',lg:960,xl:'75vw'}}}>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          All Firms 
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
         Showing {filteredFirms.length} of {allFirms.length} firms
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          Manage and view all trading firms in your database
        </Typography>

        {/* Filter Section */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Firms
          </Typography>
          
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end" >
            {/* Search Input */}
            <TextField
              label="Search Firms"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200, flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by name, description, or discount code..."
            />

            {/* Firm Name Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Firm Name</InputLabel>
              <Select
                value={firmNameFilter}
                label="Firm Name"
                onChange={(e) => setFirmNameFilter(e.target.value)}
              >
                <MenuItem value="">All Firms</MenuItem>
                {firmNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rating Filter */}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Rating</InputLabel>
              <Select
                value={ratingFilter}
                label="Rating"
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <MenuItem value="">All Ratings</MenuItem>
                {ratings.map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear Filters Button */}
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{ minWidth: 120, padding: '14px' }}
            >
              Clear Filters
            </Button>
          </Stack>

          {/* Active Filters Display */}
          {(searchTerm || ratingFilter || firmNameFilter) && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm("")}
                  size="small"
                  sx={{bgcolor:'#4b008226'}}
                />
              )}
              {firmNameFilter && (
                <Chip
                  label={`Firm: ${firmNameFilter}`}
                  onDelete={() => setFirmNameFilter("")}
                  size="small"
                  sx={{bgcolor:'#4b008226'}}
                />
              )}
              {ratingFilter && (
                <Chip
                  label={`Rating: ${ratingFilter}`}
                  onDelete={() => setRatingFilter("")}
                  size="small"
                  sx={{bgcolor:'#4b008226'}}
                />
              )}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Firms Grid */}
      {filteredFirms.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No firms match your search criteria.
          </Typography>
          <Button onClick={clearFilters} sx={{ mt: 2 }}>
            Clear all filters
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredFirms.map((firm) => (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={firm.id}>
              <Card
                sx={{
                  position: "relative",
                  border: firm.updated
                    ? "2px solid #4caf50"
                    : "1px solid #e0e0e0",
                  overflow: "visible",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "all 0.3s ease-in-out",
                  },
                  height: "100%",
                }}
              >
                {/* Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: 12,
                    backgroundColor: getBadgeColor(firm.firmType),
                    color: firm.firmType === "premium" ? "#000" : "#fff",
                    borderRadius: "12px",
                    padding: "4px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontWeight: "700",
                    fontSize: "12px",
                    zIndex: 1,
                  }}
                >
                  {getBadgeIcon(firm.firmType)}
                  <Typography
                    sx={{ fontSize: "12px", fontWeight: "700", lineHeight: 1 }}
                  >
                    {firm.firmType?.toUpperCase()}
                  </Typography>
                </Box>

                {firm.updated && (
                  <Chip
                    label="Recently Updated"
                    color="success"
                    size="small"
                    sx={{ position: "absolute", top: -8, left: 12 }}
                  />
                )}

                <CardContent>
                  {/* Name with Logo */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {firm.logo && (
                      <img
                        src={firm.logo}
                        alt={firm.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "40%",
                          objectFit: "cover",
                          marginRight: 12,
                          border: "2px solid #e0e0e0",
                        }}
                      />
                    )}
                    <Typography variant="h6" component="div">
                      {firm.name}
                    </Typography>
                  </Box>

                  {/* Profit Split and Account Size */}
                  <Typography color="green" gutterBottom>
                    {firm.tradingConditions?.profitSplitPct}% Profit Split | $
                    {firm.tradingConditions?.maximumAccountSizeUsd?.toLocaleString()} Account
                  </Typography>

                  {/* Rating */}
                  <Typography variant="body2" gutterBottom>
                    <strong>Rating:</strong> {firm.rating}
                  </Typography>

                  {/* Country */}
                  <Typography variant="body2" gutterBottom>
                    <strong>Country:</strong> {firm.country}
                  </Typography>

                  {/* Discount Code */}
                  {firm.tradingConditions?.discountCode && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Discount Code:</strong> {firm.tradingConditions.discountCode}
                    </Typography>
                  )}

                  {/* Challenges Count */}
                  {/* <Typography variant="body2" gutterBottom>
                    <strong>Challenges:</strong> {firm.challenges?.length || 0} available
                  </Typography> */}

                  {/* Trading Platforms */}
                  {firm.tradingConditions?.tradingPlatforms && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Platforms:</strong>
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {firm.tradingConditions.tradingPlatforms?.map((platform) => (
                          <Chip
                            key={platform}
                            label={platform}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Available Assets */}
                  {firm.tradingConditions?.availableAssets && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Assets:</strong>
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {firm.tradingConditions.availableAssets?.map((asset) => (
                          <Chip
                            key={asset}
                            label={asset}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Action Buttons and Status */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(firm)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(firm.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>

                    <Chip
                      label={firm.about?.firmStatus === "Active" ? "Active" : "Inactive"}
                      color={firm.about?.firmStatus === "Active" ? "success" : "default"}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ViewAllFirms;