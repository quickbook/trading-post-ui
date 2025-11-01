import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const assetOptions = [
  "forex",
  "crypto",
  "indices",
  "commodities",
  "stocks",
  "etfs",
];
const platformOptions = [
  "MT4",
  "MT5",
  "cTrader",
  "Match Trader",
  "Trade Locker",
  "Project-X",
  "DXtrade",
];

const AddFirmForm = ({ firm, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    firmType: "partner",
    profitSplit: 80,
    account: 100000,
    code: "",
    logo: "",
    rating: "A",
    country: "",
    flag: "",
    assets: [],
    platforms: [],
    maxAllocation: 100000,
    isActive: true,
  });

  useEffect(() => {
    if (firm) setFormData(firm);
  }, [firm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedPlatforms = formData.platforms.map((platform) => ({
      src: `/platforms/${platform.toLowerCase().replace(" ", "-")}.webp`,
      alt: platform,
    }));

    const submitData = {
      ...formData,
      platforms: processedPlatforms,
      flag: formData.flag || `/flags/${formData.country.toLowerCase()}.jpeg`,
    };

    onSubmit(submitData);
    if (!firm) {
      setFormData({
        title: "",
        firmType: "partner",
        profitSplit: 80,
        account: 100000,
        code: "",
        logo: "",
        rating: "A",
        //allRatings: 0,
        country: "",
        flag: "",
        assets: [],
        platforms: [],
        maxAllocation: 100000,
        isActive: true,
      });
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 900,
        mx: "auto",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight={600}>
        {firm ? "Edit Firm" : "Add New Firm"}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        {/* Basic Info Section */}
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          Basic Information
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              label="Firm Name"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Firm Type</InputLabel>
              <Select
                name="firmType"
                value={formData.firmType}
                label="Firm Type"
                onChange={handleChange}
              >
                <MenuItem value="partner">Partner</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="trusted">Trusted</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              type="number"
              label="Profit Split (%)"
              name="profitSplit"
              value={formData.profitSplit}
              onChange={handleNumberChange}
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              type="number"
              label="Account Size ($)"
              name="account"
              value={formData.account}
              onChange={handleNumberChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              label="Discount Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Logo URL"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="/alpha-trading.png"
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Ratings Section */}
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          Ratings & Location
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                name="rating"
                value={formData.rating}
                label="Rating"
                onChange={handleChange}
              >
                {["A+", "A", "B", "C", "D"].map(
                  (r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Total Ratings"
              name="allRatings"
              value={formData.allRatings}
              onChange={handleNumberChange}
            />
          </Grid> */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="USA"
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Trading Details */}
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          Trading Details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Assets</InputLabel>
              <Select
                multiple
                name="assets"
                value={formData.assets}
                onChange={handleMultiSelect}
                input={<OutlinedInput label="Assets" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {assetOptions.map((asset) => (
                  <MenuItem key={asset} value={asset}>
                    <Checkbox checked={formData.assets.indexOf(asset) > -1} />
                    <ListItemText primary={asset} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Platforms</InputLabel>
              <Select
                multiple
                name="platforms"
                value={formData.platforms}
                onChange={handleMultiSelect}
                input={<OutlinedInput label="Platforms" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value,i) => (
                      <Chip key={i+'chip'} label={value} size="small" />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {platformOptions.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    <Checkbox
                      checked={formData.platforms.indexOf(platform) > -1}
                    />
                    <ListItemText primary={platform} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Max Allocation ($)"
              name="maxAllocation"
              value={formData.maxAllocation}
              onChange={handleNumberChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, isActive: e.target.checked }))
                  }
                  name="isActive"
                  color="success"
                />
              }
              label="Active Firm"
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{ mt: 8, display: "flex", justifyContent: "center", gap: 2 }}
        >
          {onCancel && (
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Save />}
            type="submit"
          >
            {firm ? "Update Firm" : "Add Firm"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddFirmForm;
