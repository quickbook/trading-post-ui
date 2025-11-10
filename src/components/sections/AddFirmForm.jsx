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
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import {  
  selectCountryOptions,
  selectCountriesStatus,
  selectCountriesError,
} from "../../features/domain/domainDataSlice"; // adjust path

import {  useSelector } from "react-redux";

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
  "FX",
  "Crypto",
  "Indices",
  "Commodities",
  "Stocks",
  "ETFs",
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
const tierOptions = ["King", "Queen", "Prince", "Knight"];
const phaseOptions = ["1-Step Challenge", "2-Step Challenge", "Evaluation"];
const firmTypeOptions = ["premium", "trusted", "partner"];



const AddFirmForm = ({ firm, onSubmit, onCancel }) => {

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    firmType: "partner",
    rating: "A+",
    description: "",
    tradingConditions: {
      maximumAccountSizeUsd: 100000,
      profitSplitPct: 80,
      tradingPlatforms: [],
      availableAssets: [],
      discountCode: "",
      keyFeatures: [],
      withdrawalSpeed: "1-3 Business Days",
    },
    about: {
      legalName: "",
      registrationNo: "",
      establishedDate: "",
      founders: "",
      headquarters: "",
      jurisdiction: "",
      firmStatus: "Active",
    },
    challenges: [],
  });
 
const countryOptions = useSelector(selectCountryOptions);   // [{value, label}]
const countriesStatus = useSelector(selectCountriesStatus); // idle|loading|succeeded|failed
const countriesError = useSelector(selectCountriesError);


  const [newChallenge, setNewChallenge] = useState({
    tier: "King",
    phase: "2-Step Challenge",
    profitTargetPct: 10.0,
    dailyLossPct: 3.0,
    maxLossPct: 5.0,
    accountSizeUsd: 100000,
    price: { amount: 0, currency: "USD" },
    buyUrl: "",
  });

  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    if (firm) {
      setFormData(firm);
      if (firm.logo) setLogoPreview(firm.logo);
    }
  }, [firm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleTradingConditionsChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      tradingConditions: { ...p.tradingConditions, [name]: value },
    }));
  };

  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      about: { ...p.about, [name]: value },
    }));
  };

  const handleMultiSelect = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      tradingConditions: {
        ...p.tradingConditions,
        [name]: typeof value === "string" ? value.split(",") : value,
      },
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: parseFloat(value) || 0 }));
  };

  const handleTradingNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      tradingConditions: {
        ...p.tradingConditions,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setLogoPreview(base64String);
        setFormData((p) => ({ ...p, logo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChallengeChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("price.")) {
      const field = name.split(".")[1];
      setNewChallenge((p) => ({
        ...p,
        price: {
          ...p.price,
          [field]: field === "amount" ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setNewChallenge((p) => ({
        ...p,
        [name]:
          name.includes("Pct") || name === "accountSizeUsd"
            ? parseFloat(value) || 0
            : value,
      }));
    }
  };

  const addChallenge = () => {
    if (newChallenge.accountSizeUsd > 0 && newChallenge.price.amount > 0) {
      setFormData((p) => ({
        ...p,
        challenges: [...p.challenges, { ...newChallenge }],
      }));
      setNewChallenge({
        tier: "King",
        phase: "2-Step Challenge",
        profitTargetPct: 10.0,
        dailyLossPct: 3.0,
        maxLossPct: 5.0,
        accountSizeUsd: 100000,
        price: { amount: 0, currency: "USD" },
        buyUrl: "",
      });
    }
  };

  const removeChallenge = (index) => {
    setFormData((p) => ({
      ...p,
      challenges: p.challenges.filter((_, i) => i !== index),
    }));
  };

  const handleFirmStatusToggle = (e) => {
    const isActive = e.target.checked;
    setFormData((p) => ({
      ...p,
      about: {
        ...p.about,
        firmStatus: isActive ? "Active" : "Inactive",
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate slug from name if not provided
    const finalFormData = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
    };

    onSubmit(finalFormData);

    if (!firm) {
      setFormData({
        name: "",
        slug: "",
        logo: "",
        firmType: "partner",
        rating: "A",
        allRatings: 0,
        description: "",
        tradingConditions: {
          maximumAccountSizeUsd: 100000,
          profitSplitPct: 80,
          tradingPlatforms: [],
          availableAssets: [],
          discountCode: "",
          keyFeatures: [],
          withdrawalSpeed: "1-3 Business Days",
        },
        about: {
          legalName: "",
          registrationNo: "",
          establishedDate: "",
          founders: "",
          headquarters: "",
          jurisdiction: "",
          firmStatus: "Active",
        },
        challenges: [],
      });
      setLogoPreview("");
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 1000,
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
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="auto-generated-from-name"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth required>
              <InputLabel>Firm Type</InputLabel>
              <Select
                name="firmType"
                value={formData.firmType}
                label="Firm Type"
                onChange={handleChange}
              >
                {firmTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                name="rating"
                value={formData.rating}
                label="Rating"
                onChange={handleChange}
              >
                {["A+", "A", "B", "C", "D"].map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
              >
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>
              {logoPreview && (
                <Avatar
                  src={logoPreview}
                  sx={{ width: 75, height: 65 }}
                  variant="rounded"
                />
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="number"
              label="Total Ratings"
              name="allRatings"
              value={formData.allRatings}
              onChange={handleNumberChange}
            />
          </Grid> 
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl
  fullWidth
  required         // if you track field errors
  disabled={countriesStatus === "loading"}
>
  <InputLabel id="country-label">Country</InputLabel>
  <Select
    labelId="country-label"
    name="country"
    value={formData.country ?? ""}             // keep controlled
    label="Country"
    onChange={handleChange}                    // expects e.target.name/value
    displayEmpty
  >
    <MenuItem value="">
      <em>Select country</em>                  {/* placeholder (instead of "USA") */}
    </MenuItem>

    {countryOptions.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </Select>

  {/* helper text states */}
  {countriesStatus === "loading" && (
    <FormHelperText>Loading countries…</FormHelperText>
  )}
  {countriesStatus === "failed" && (
    <FormHelperText error>
      {String(countriesError) || "Failed to load countries"}
    </FormHelperText>
  )}
   
</FormControl>

          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Trading Conditions */}
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          Trading Conditions
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              type="number"
              label="Maximum Account Size (USD)"
              name="maximumAccountSizeUsd"
              value={formData.tradingConditions.maximumAccountSizeUsd}
              onChange={handleTradingNumberChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              type="number"
              label="Profit Split (%)"
              name="profitSplitPct"
              value={formData.tradingConditions.profitSplitPct}
              onChange={handleTradingNumberChange}
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Available Assets</InputLabel>
              <Select
                multiple
                name="availableAssets"
                value={formData.tradingConditions.availableAssets}
                onChange={handleMultiSelect}
                input={<OutlinedInput label="Available Assets" />}
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
                    <Checkbox
                      checked={
                        formData.tradingConditions.availableAssets.indexOf(
                          asset
                        ) > -1
                      }
                    />
                    <ListItemText primary={asset} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Trading Platforms</InputLabel>
              <Select
                multiple
                name="tradingPlatforms"
                value={formData.tradingConditions.tradingPlatforms}
                onChange={handleMultiSelect}
                input={<OutlinedInput label="Trading Platforms" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value, i) => (
                      <Chip key={i + "chip"} label={value} size="small" />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {platformOptions.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    <Checkbox
                      checked={
                        formData.tradingConditions.tradingPlatforms.indexOf(
                          platform
                        ) > -1
                      }
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
              label="Discount Code"
              name="discountCode"
              value={formData.tradingConditions.discountCode}
              onChange={handleTradingConditionsChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Withdrawal Speed"
              name="withdrawalSpeed"
              value={formData.tradingConditions.withdrawalSpeed}
              onChange={handleTradingConditionsChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* About Section */}
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          About the Firm
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Legal Name"
              name="legalName"
              value={formData.about.legalName}
              onChange={handleAboutChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Registration Number"
              name="registrationNo"
              value={formData.about.registrationNo}
              onChange={handleAboutChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Established Date"
              name="establishedDate"
              value={formData.about.establishedDate}
              onChange={handleAboutChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Headquarters"
              name="headquarters"
              value={formData.about.headquarters}
              onChange={handleAboutChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Jurisdiction"
              name="jurisdiction"
              value={formData.about.jurisdiction}
              onChange={handleAboutChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.about.firmStatus === "Active"}
                    onChange={handleFirmStatusToggle}
                    color="success"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">
                      Firm Status: {formData.about.firmStatus}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formData.about.firmStatus === "Active"
                        ? "Active"
                        : "Inactive"}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Challenges Section */}
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          Trading Challenges
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addChallenge}
          sx={{ width: "fit-content", bgcolor: "#4b0082", mb: 4 }}
          fullWidth
        >
          Add Challenge
        </Button>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Tier</InputLabel>
              <Select
                name="tier"
                value={newChallenge.tier}
                label="Tier"
                onChange={handleChallengeChange}
              >
                {tierOptions.map((tier) => (
                  <MenuItem key={tier} value={tier}>
                    {tier}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Phase</InputLabel>
              <Select
                name="phase"
                value={newChallenge.phase}
                label="Phase"
                onChange={handleChallengeChange}
              >
                {phaseOptions.map((phase) => (
                  <MenuItem key={phase} value={phase}>
                    {phase}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Account Size (USD)"
              name="accountSizeUsd"
              value={newChallenge.accountSizeUsd}
              onChange={handleChallengeChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Price (USD)"
              name="price.amount"
              value={newChallenge.price.amount}
              onChange={handleChallengeChange}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Profit Target (%)"
              name="profitTargetPct"
              value={newChallenge.profitTargetPct}
              onChange={handleChallengeChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Daily Loss (%)"
              name="dailyLossPct"
              value={newChallenge.dailyLossPct}
              onChange={handleChallengeChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Max Loss (%)"
              name="maxLossPct"
              value={newChallenge.maxLossPct}
              onChange={handleChallengeChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Page URL"
              name="buyUrl"
              value={newChallenge.buyUrl}
              onChange={handleChallengeChange}
            />
          </Grid>
        </Grid>

        {/* Challenges List */}
        {formData.challenges.map((challenge, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  {challenge.tier} - {challenge.phase}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => removeChallenge(index)}
                >
                  <Delete />
                </IconButton>
              </Box>
              <Typography>
                Account Size: ${challenge.accountSizeUsd.toLocaleString()} |
                Price: ${challenge.price.amount} | Profit Target:{" "}
                {challenge.profitTargetPct}%
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Action Buttons */}
        <Box sx={{ mt: '6rem', display: "flex", justifyContent: "center", gap: 2 }}>
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
