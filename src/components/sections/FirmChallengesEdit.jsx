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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stack,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { Add, Edit, Delete, Star, Search } from "@mui/icons-material";
import { getGradeColor } from "./Reviews";
import { sampleFirmChallenges } from "./PropFirmsChallenges";


const FirmChallengesEdit = () => {
  const [challenges, setChallenges] = useState(sampleFirmChallenges);
  const [openModal, setOpenModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [firmNameFilter, setFirmNameFilter] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    prop_id: "",
    daily_loss: "",
    max_loss: "",
    logo: "",
    profitTarget: "",
    challenge_price: "",
    trustRating: "",
    trusted: false,
    features: [],
    phaseType: "",
    minAccount: "",
  });

  const trustRatings = ["A+", "A", "B", "C", "D"];
  const phaseTypes = ["One-Step", "Two-Step", "Instant Funding", "Rapid Challenge"];

  // Get unique firm names for filter
  const firmNames = useMemo(() => {
    return [...new Set(challenges.map(challenge => challenge.name))].sort();
  }, [challenges]);

  // Filter challenges based on search and filter criteria
  const filteredChallenges = useMemo(() => {
    return challenges.filter(challenge => {
      const matchesSearch = searchTerm === "" || 
        challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        challenge.phaseType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFirmName = firmNameFilter === "" || challenge.name === firmNameFilter;

      return matchesSearch && matchesFirmName;
    });
  }, [challenges, searchTerm, firmNameFilter]);

  const handleOpenModal = (challenge = null) => {
    if (challenge) {
      setEditingChallenge(challenge);
      setFormData(challenge);
    } else {
      setEditingChallenge(null);
      setFormData({
        name: "",
        prop_id: "",
        daily_loss: "",
        max_loss: "",
        logo: "",
        profitTarget: "",
        challenge_price: "",
        trustRating: "",
        trusted: false,
        features: [],
        phaseType: "",
        minAccount: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingChallenge(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeaturesChange = (e) => {
    const features = e.target.value;
    setFormData(prev => ({
      ...prev,
      features: typeof features === 'string' ? features.split(',') : features
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingChallenge) {
      // Update existing challenge
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === editingChallenge.id 
            ? { ...formData, id: editingChallenge.id }
            : challenge
        )
      );
    } else {
      // Add new challenge
      const newChallenge = {
        ...formData,
        id: Math.max(...challenges.map(c => c.id)) + 1,
      };
      setChallenges(prev => [...prev, newChallenge]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFirmNameFilter("");
  };


  return (
    <Box sx={{ p: 1, width:{xs:'100%', md: 940, xl: '75vw'} }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Trading Challenges
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage and view all trading challenges ({filteredChallenges.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
          sx={{ minWidth: 160, bgcolor:"#4b0082" }}
        >
          Add Challenge
        </Button>
      </Box>

      {/* Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter Challenges
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
          {/* Search Input */}
          <TextField
            label="Search Challenges"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            placeholder="Search by name, features, or phase type..."
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

          {/* Clear Filters Button */}
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{ minWidth: 120, padding: '14px' }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Active Filters Display */}
        {(searchTerm || firmNameFilter) && (
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm("")}
                size="small"
              />
            )}
            {firmNameFilter && (
              <Chip
                label={`Firm: ${firmNameFilter}`}
                onDelete={() => setFirmNameFilter("")}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Challenges Grid */}
      {filteredChallenges.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No challenges match your search criteria.
          </Typography>
          <Button onClick={clearFilters} sx={{ mt: 2 }}>
            Clear all filters
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredChallenges.map((challenge) => (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={challenge.id}>
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  overflow: "visible", // Changed from hidden to visible
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                {/* Trusted Badge - Moved to right side */}
                {challenge.trusted && (
                  <Chip
                    icon={<Star sx={{ fontSize: 16 }} />}
                    label="Trusted"
                    color="success"
                    size="small"
                    sx={{ 
                      position: "absolute", 
                      top: -8, 
                      right: 12,
                      fontWeight: "bold"
                    }}
                  />
                )}

                <CardContent sx={{ overflow: "visible" }}>
                  {/* Header with Logo and Name */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {challenge.logo ? (
                      <img
                        src={challenge.logo}
                        alt={challenge.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "8px",
                          objectFit: "cover",
                          marginRight: 12,
                          border: "2px solid #e0e0e0",
                        }}
                        onError={(e) => {
                          // If image fails to load, replace with avatar
                          e.target.style.display = 'none';
                          const avatar = document.getElementById(`avatar-${challenge.id}`);
                          if (avatar) avatar.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Avatar fallback - hidden by default if logo exists */}
                    <Avatar
                      id={`avatar-${challenge.id}`}
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        backgroundColor: '#4b0082',
                        display: challenge.logo ? 'none' : 'flex',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      {challenge.name.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div">
                        {challenge.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ID: {challenge.prop_id}
                      </Typography>
                      {/* Rating display under firm name */}
                      <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Rating: 
                        </Typography>
                        <Chip
                          label={challenge.trustRating}
                          size="medium"
                          sx={{ 
                            ml: 1,
                            backgroundColor: getGradeColor(challenge.trustRating),
                            color: 'white',
                            fontWeight: 'bold',
                            height: 26,
                            fontSize:'16px',
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Challenge Details */}
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">
                        <strong>Daily Loss:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {challenge.daily_loss}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">
                        <strong>Max Loss:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {challenge.max_loss}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">
                        <strong>Profit Target:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {challenge.profitTarget}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">
                        <strong>Price:</strong>
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        ${challenge.challenge_price}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">
                        <strong>Min Account:</strong>
                      </Typography>
                      <Typography variant="body2">
                        ${challenge.minAccount.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">
                        <strong>Phase Type:</strong>
                      </Typography>
                      <Chip 
                        label={challenge.phaseType} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                  </Stack>

                  {/* Features */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Features:</strong>
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {challenge.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(challenge)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(challenge.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Challenge Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingChallenge ? "Edit Challenge" : "Add New Challenge"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Challenge Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Prop ID"
                  name="prop_id"
                  type="number"
                  value={formData.prop_id}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Daily Loss (%)"
                  name="daily_loss"
                  type="number"
                  value={formData.daily_loss}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Max Loss (%)"
                  name="max_loss"
                  type="number"
                  value={formData.max_loss}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Profit Target (%)"
                  name="profitTarget"
                  type="number"
                  value={formData.profitTarget}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Challenge Price ($)"
                  name="challenge_price"
                  type="number"
                  value={formData.challenge_price}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Minimum Account ($)"
                  name="minAccount"
                  type="number"
                  value={formData.minAccount}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField
                  fullWidth
                  label="Logo URL"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  margin="normal"
                  helperText="Leave empty to use avatar with first letter"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 4}}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Trust Rating</InputLabel>
                  <Select
                    name="trustRating"
                    value={formData.trustRating}
                    label="Trust Rating"
                    onChange={handleInputChange}
                    required
                  >
                    {trustRatings.map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        {rating}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{xs: 12, sm: 4}}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Phase Type</InputLabel>
                  <Select
                    name="phaseType"
                    value={formData.phaseType}
                    label="Phase Type"
                    onChange={handleInputChange}
                    required
                  >
                    {phaseTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{xs: 12, sm: 4}}>
                <FormControl component="fieldset" margin="normal">
                  <Typography variant="body1" gutterBottom>
                    Trusted Firm
                  </Typography>
                  <RadioGroup
                    row
                    name="trusted"
                    value={formData.trusted}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid size={{xs: 12}}>
                <TextField
                  fullWidth
                  label="Features (comma-separated)"
                  name="features"
                  value={formData.features.join(',')}
                  onChange={handleFeaturesChange}
                  margin="normal"
                  placeholder="No Time Limit, Scaling Plan, One-Step Evaluation"
                  helperText="Enter features separated by commas"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingChallenge ? "Update Challenge" : "Add Challenge"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default FirmChallengesEdit;