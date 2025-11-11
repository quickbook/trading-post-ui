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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  Container,
} from "@mui/material";
import { Save, Cancel, Delete, Add, CloudUpload } from "@mui/icons-material";
import {
  selectCountryOptions,
  selectCountriesStatus,
  selectCountriesError,
} from "../../features/domain/domainDataSlice"; // adjust path

import { useSelector } from "react-redux";
import { COUNTRIES } from "../pages/RegisterPage";

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

const tierOptions = [
  "King",
  "Duke",
  "1 Step",
  "2 Step",
  "3 Step",
  "One-Stage",
  "Two-Stage",
  "Three-Stage",
  "Knight",
];
const phaseOptions = [
  "1-Phase",
  "2-Phase",
  "Evaluation",
  "1-Step Challenge",
  "2-Step Challenge",
];
const firmTypeOptions = ["premium", "trusted", "partner"];
const keyFeaturesOptions = [
  "Multiple Account Sizes",
  "Fast Withdrawals",
  "Up to $1M Funding",
  "Bi-Weekly Payouts",
  "Daily Payouts",
  "No Time Limit",
  "Scaling Plan",
  "Expert Advisors Allowed",
];

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`firm-form-tabpanel-${index}`}
      aria-labelledby={`firm-form-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AddFirmForm = ({ firm, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    firmPageURL: "",
    firmType: "partner",
    rating: "A+",
    country: "",
    countryCode: "",
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

  //const countryOptions = useSelector(selectCountryOptions); // [{value, label}]
  //const countriesStatus = useSelector(selectCountriesStatus); // idle|loading|succeeded|failed
  //const countriesError = useSelector(selectCountriesError);
  const countriesStatus = "succeeded";

  const [newChallenge, setNewChallenge] = useState({
    tier: "King",
    phase: "2-Phase",
    profitTargetPct: 10.0,
    dailyLossPct: 3.0,
    maxLossPct: 5.0,
    accountSizeUsd: 100000,
    price: { amount: 0, currency: "USD" },
    buyUrl: "",
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [errors, setErrors] = useState({});
  const [logoError, setLogoError] = useState("");

  useEffect(() => {
    if (firm) {
      setFormData(firm);
      if (firm.logo) setLogoPreview(firm.logo);
    }
  }, [firm]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const validateBasicDetails = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Firm name is required";
    }
    if (!formData.firmType) {
      newErrors.firmType = "Firm type is required";
    }
    if (!formData.rating) {
      newErrors.rating = "Rating is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "Country code is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.logo && !firm?.logo) {
      setLogoError("Logo is required");
    }

    return newErrors;
  };

  const validateTradingConditions = () => {
    const newErrors = {};

    if (
      !formData.tradingConditions.maximumAccountSizeUsd ||
      formData.tradingConditions.maximumAccountSizeUsd <= 0
    ) {
      newErrors.maximumAccountSizeUsd =
        "Maximum account size is required and must be greater than 0";
    }
    if (
      !formData.tradingConditions.profitSplitPct ||
      formData.tradingConditions.profitSplitPct <= 0
    ) {
      newErrors.profitSplitPct =
        "Profit split percentage is required and must be greater than 0";
    }
    if (!formData.tradingConditions.tradingPlatforms.length) {
      newErrors.tradingPlatforms = "At least one trading platform is required";
    }
    if (!formData.tradingConditions.availableAssets.length) {
      newErrors.availableAssets = "At least one asset type is required";
    }
    if (!formData.tradingConditions.withdrawalSpeed.trim()) {
      newErrors.withdrawalSpeed = "Withdrawal speed is required";
    }

    return newErrors;
  };

  const validateChallenge = (challenge) => {
    const challengeErrors = {};

    if (!challenge.tier) {
      challengeErrors.tier = "Tier is required";
    }
    if (!challenge.phase) {
      challengeErrors.phase = "Phase is required";
    }
    if (!challenge.accountSizeUsd || challenge.accountSizeUsd <= 0) {
      challengeErrors.accountSizeUsd =
        "Account size is required and must be greater than 0";
    }
    if (!challenge.price.amount || challenge.price.amount <= 0) {
      challengeErrors.price = "Price is required and must be greater than 0";
    }
    if (!challenge.profitTargetPct || challenge.profitTargetPct <= 0) {
      challengeErrors.profitTargetPct =
        "Profit target is required and must be greater than 0";
    }
    if (!challenge.dailyLossPct || challenge.dailyLossPct <= 0) {
      challengeErrors.dailyLossPct =
        "Daily loss limit is required and must be greater than 0";
    }
    if (!challenge.maxLossPct || challenge.maxLossPct <= 0) {
      challengeErrors.maxLossPct =
        "Maximum loss limit is required and must be greater than 0";
    }
    if (!challenge.buyUrl.trim()) {
      challengeErrors.buyUrl = "Buy URL is required";
    }

    return challengeErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTradingConditionsChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      tradingConditions: { ...p.tradingConditions, [name]: value },
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

    // Clear error when user selects something
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    setLogoError("");

    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (100KB = 100 * 1024 bytes)
    if (file.size > 100 * 1024) {
      setLogoError("Logo must be less than 100KB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setLogoPreview(base64String);
      setFormData((p) => ({ ...p, logo: base64String }));
    };
    reader.readAsDataURL(file);
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

  const openChallengeDialog = () => {
    setChallengeDialogOpen(true);
  };

  const closeChallengeDialog = () => {
    setChallengeDialogOpen(false);
    // Reset new challenge form
    setNewChallenge({
      tier: "King",
      phase: "2-Phase",
      profitTargetPct: 10.0,
      dailyLossPct: 3.0,
      maxLossPct: 5.0,
      accountSizeUsd: 100000,
      price: { amount: 0, currency: "USD" },
      buyUrl: "",
    });
  };

  const addChallenge = () => {
    const challengeErrors = validateChallenge(newChallenge);

    if (Object.keys(challengeErrors).length === 0) {
      setFormData((p) => ({
        ...p,
        challenges: [...p.challenges, { ...newChallenge }],
      }));
      closeChallengeDialog();
    } else {
      // Show errors in dialog
      setErrors((prev) => ({ ...prev, ...challengeErrors }));
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

    // Validate all required sections
    const basicErrors = validateBasicDetails();
    const tradingErrors = validateTradingConditions();

    const allErrors = { ...basicErrors, ...tradingErrors };

    if (Object.keys(allErrors).length > 0 || logoError) {
      setErrors(allErrors);
      setCurrentTab(0); // Go to first tab to show errors
      return;
    }

    //country code add
    const countryObj = COUNTRIES.find((e)=>e.name===formData.country)

    // Generate slug from name if not provided
    const finalFormData = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      countryCode: countryObj.code,
    };

    onSubmit(finalFormData);

    if (!firm) {
      setFormData({
        name: "",
        slug: "",
        logo: "",
        firmPageURL: "",
        firmType: "partner",
        rating: "A+",
        country: "",
        countryCode: "",
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
      setErrors({});
      setLogoError("");
    }
  };

  const handleNextTab = () => {
    if (currentTab === 0) {
      const basicErrors = validateBasicDetails();
      if (Object.keys(basicErrors).length > 0 || logoError) {
        setErrors(basicErrors);
        return;
      }
    } else if (currentTab === 1) {
      const tradingErrors = validateTradingConditions();
      if (Object.keys(tradingErrors).length > 0) {
        setErrors(tradingErrors);
        return;
      }
    }
    setCurrentTab(currentTab + 1);
  };

  const handlePreviousTab = () => {
    setCurrentTab(currentTab - 1);
  };

  return (
    <Container
      elevation={4}
      sx={{
        p: 4,
        width: { xs: "100vw", lg: 940, xl: 1200 },
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
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="firm form tabs"
          >
            <Tab label="Basic Details" />
            <Tab label="Trading Conditions" />
            <Tab label="About Firm" />
            <Tab label="Challenges" />
          </Tabs>
        </Box>

        {/* Basic Details Tab */}
        <TabPanel value={currentTab} index={0}>
          <Typography
            variant="h6"
            gutterBottom
            fontWeight={600}
            color="primary"
          >
            Basic Information
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label="Firm Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label="Firm Page URL"
                name="firmPageURL"
                value={formData.firmPageURL}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth required error={!!errors.firmType}>
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
                {errors.firmType && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 2, mt: 0.5, display: "block" }}
                  >
                    {errors.firmType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth required error={!!errors.rating}>
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
                {errors.rating && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 2, mt: 0.5, display: "block" }}
                  >
                    {errors.rating}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl
                fullWidth
                required // if you track field errors
                disabled={countriesStatus === "loading"}
              >
                <InputLabel>Select Country</InputLabel>
                <Select
                  name="country"
                  value={formData.country ?? ""} // keep controlled
                  label="Select Country"
                  onChange={handleChange} // expects e.target.name/value
                >
                  {countriesStatus === "loading" ? (
                    <MenuItem value="" disabled>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CircularProgress size={16} />
                        <span>Loading countries...</span>
                      </Box>
                    </MenuItem>
                  ) : countriesStatus === "failed" ? (
                    <MenuItem value="" disabled>
                      <Typography variant="body2" color="error">
                        Failed to load countries
                      </Typography>
                    </MenuItem>
                  ) : COUNTRIES.length === 0 ? (
                    <MenuItem value="" disabled>
                      <em>No countries available</em>
                    </MenuItem>
                  ) : (
                    COUNTRIES.map((country) => (
                      <MenuItem key={country.code} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))
                  )}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  required
                >
                  Upload Logo *
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
              {logoError && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {logoError}
                </Typography>
              )}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Required. Image files only, max 100KB
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter firm description..."
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Trading Conditions Tab */}
        <TabPanel value={currentTab} index={1}>
          <Typography
            variant="h6"
            gutterBottom
            fontWeight={600}
            color="primary"
          >
            Trading Conditions
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Maximum Account Size (USD)"
                name="maximumAccountSizeUsd"
                value={formData.tradingConditions.maximumAccountSizeUsd}
                onChange={handleTradingNumberChange}
                error={!!errors.maximumAccountSizeUsd}
                helperText={errors.maximumAccountSizeUsd}
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
                error={!!errors.profitSplitPct}
                helperText={errors.profitSplitPct}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!errors.availableAssets}>
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
                {errors.availableAssets && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 2, mt: 0.5, display: "block" }}
                  >
                    {errors.availableAssets}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!errors.tradingPlatforms}>
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
                {errors.tradingPlatforms && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 2, mt: 0.5, display: "block" }}
                  >
                    {errors.tradingPlatforms}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Key Features</InputLabel>
                <Select
                  multiple
                  name="keyFeatures"
                  value={formData.tradingConditions.keyFeatures}
                  onChange={handleMultiSelect}
                  input={<OutlinedInput label="Key Features" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {keyFeaturesOptions.map((feature) => (
                    <MenuItem key={feature} value={feature}>
                      <Checkbox
                        checked={
                          formData.tradingConditions.keyFeatures.indexOf(
                            feature
                          ) > -1
                        }
                      />
                      <ListItemText primary={feature} />
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
                required
                fullWidth
                label="Withdrawal Speed"
                name="withdrawalSpeed"
                value={formData.tradingConditions.withdrawalSpeed}
                onChange={handleTradingConditionsChange}
                error={!!errors.withdrawalSpeed}
                helperText={errors.withdrawalSpeed}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* About Firm Tab */}
        <TabPanel value={currentTab} index={2}>
          <Typography
            variant="h6"
            gutterBottom
            fontWeight={600}
            color="primary"
          >
            About the Firm
          </Typography>

          <Grid container spacing={3}>
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
              <TextField
                fullWidth
                label="Founders"
                name="founders"
                value={formData.about.founders}
                onChange={handleAboutChange}
                placeholder="Comma separated names"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", height: "100%" }}
              >
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
        </TabPanel>

        {/* Challenges Tab */}
        <TabPanel value={currentTab} index={3}>
          <Typography
            variant="h6"
            gutterBottom
            fontWeight={600}
            color="primary"
          >
            Trading Challenges
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {formData.challenges.length} challenge(s) added
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openChallengeDialog}
              sx={{ bgcolor: "#4b0082" }}
            >
              Add Challenge
            </Button>
          </Box>

          {/* Challenges List */}
          {formData.challenges.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No challenges added yet. Click "Add Challenge" to create one.
            </Alert>
          ) : (
            formData.challenges.map((challenge, index) => (
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
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Account Size:</strong> $
                    {challenge.accountSizeUsd.toLocaleString()} |{" "}
                    <strong>Price:</strong> ${challenge.price.amount} |{" "}
                    <strong>Profit Target:</strong> {challenge.profitTargetPct}%
                    | <strong>Daily Loss:</strong> {challenge.dailyLossPct}% |{" "}
                    <strong>Max Loss:</strong> {challenge.maxLossPct}%
                  </Typography>
                  {challenge.buyUrl && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      <strong>Buy URL:</strong> {challenge.buyUrl}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          {/* Challenge Dialog */}
          <Dialog
            open={challengeDialogOpen}
            onClose={closeChallengeDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Add New Challenge</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required error={!!errors.tier}>
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
                    {errors.tier && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ ml: 2, mt: 0.5, display: "block" }}
                      >
                        {errors.tier}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required error={!!errors.phase}>
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
                    {errors.phase && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ ml: 2, mt: 0.5, display: "block" }}
                      >
                        {errors.phase}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Account Size (USD)"
                    name="accountSizeUsd"
                    value={newChallenge.accountSizeUsd}
                    onChange={handleChallengeChange}
                    error={!!errors.accountSizeUsd}
                    helperText={errors.accountSizeUsd}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Price (USD)"
                    name="price.amount"
                    value={newChallenge.price.amount}
                    onChange={handleChallengeChange}
                    error={!!errors.price}
                    helperText={errors.price}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Profit Target (%)"
                    name="profitTargetPct"
                    value={newChallenge.profitTargetPct}
                    onChange={handleChallengeChange}
                    error={!!errors.profitTargetPct}
                    helperText={errors.profitTargetPct}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Daily Loss (%)"
                    name="dailyLossPct"
                    value={newChallenge.dailyLossPct}
                    onChange={handleChallengeChange}
                    error={!!errors.dailyLossPct}
                    helperText={errors.dailyLossPct}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Max Loss (%)"
                    name="maxLossPct"
                    value={newChallenge.maxLossPct}
                    onChange={handleChallengeChange}
                    error={!!errors.maxLossPct}
                    helperText={errors.maxLossPct}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    label="Buy URL"
                    name="buyUrl"
                    value={newChallenge.buyUrl}
                    onChange={handleChallengeChange}
                    error={!!errors.buyUrl}
                    helperText={errors.buyUrl}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeChallengeDialog}>Cancel</Button>
              <Button onClick={addChallenge} variant="contained">
                Add Challenge
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handlePreviousTab}
            disabled={currentTab === 0}
          >
            Previous
          </Button>

          {currentTab < 3 ? (
            <Button variant="contained" onClick={handleNextTab}>
              Next
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
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
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AddFirmForm;
