import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
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
  Container,
  CircularProgress,
  FormHelperText,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { Save, Cancel, CloudUpload, Add, Delete } from "@mui/icons-material";
import {
  selectCountryOptions,
  resetDomainData,
  selectDomainDataError,
  selectDomainDataStatus,
  fetchAllDomainData,
  selectInstruments,
  selectPlatforms,
  selectPayoutFrequencies,
} from "../../features/domain/domainDataSlice";
import { useDispatch, useSelector } from "react-redux";

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

// const assetOptions = [
//   "Forex",
//   "Crypto",
//   "Indices",
//   "Commodities",
//   "Stocks",
//   "ETFs",
//   "Bonds",
//   "Futures"
// ];

// const platformOptions = [
//   "MetaTrader 4",
//   "MetaTrader 5",
//   "cTrader",
//   "Match Trader",
//   "TradeLocker",
//   "Project-X",
//   "DXtrade",
//   "NinjaTrader"
// ];

const firmTypeOptions = ["premium", "trusted", "partner"];
const keyFeaturesOptions = [
  "Raw spreads",
  "Fast payouts",
  "Multiple platforms",
  "Scaling available",
  "Multiple Account Sizes",
  "Fast Withdrawals",
  "Up to $1M Funding",
  "Bi-Weekly Payouts",
  "Daily Payouts",
  "No Time Limit",
  "Scaling Plan",
  "Expert Advisors Allowed",
];

const payoutMethodOptions = [
  "Rise",
  "Bank Transfer",
  "PayPal",
  "Skrill",
  "Neteller",
  "Crypto",
  "Wire Transfer",
];
const payoutFrequencyOptionsData = ["Daily", "Weekly", "Bi-Weekly", "Monthly"];
const withdrawalSpeedOptions = [
  "1-3 Business Days",
  "WEEKLY",
  "BI-WEEKLY",
  "MONTHLY",
  "INSTANT",
];
const dailyDrawdownOptions = ["equity", "balance", "equityOrBalance"];
//const instrumentOptions = ["FOREX", "CRYPTO", "INDICES", "COMMODITIES", "STOCKS", "ETFs", "FUTURES"];
const leverageProfileOptions = [
  "EVALUATION",
  "FUNDED",
  "INSTANT_STANDARD",
  "INSTANT_PRO",
];

const prohibitedStrategiesOptions = [
  "Martingale",
  "Grid Trading",
  "Latency Arbitrage",
  "Reverse Arbitrage",
  "Tick Scalping",
  "Account Management",
  "Signal Trading",
  "High-Frequency Trading",
  "Hedging Between Accounts",
  "Guaranteed Limit Orders",
  "Data Feed Manipulation",
  "Trading on Delayed Charts",
  "Macroeconomic Trading During High Impact Events",
];

// const restrictedCountriesOptions = [
//   "Afghanistan", "Cuba", "Iran", "North Korea", "Pakistan", "Russia",
//   "Syria", "Somalia", "Nigeria", "Myanmar", "Sudan", "Yemen", "Venezuela"
// ];

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

const initialFirmData = {
  name: "",
  logo: "",
  website: "",
  firmType: "partner",
  rating: "A+",
  allRatings: "",
  country: "",
  isTrusted: false,
  tradingConditions: {
    maximumAccountSizeUsd: 100000,
    profitSplitPct: 80,
    discountCode: "",
    withdrawalSpeed: "WEEKLY",
    keyFeatures: [],
    tradingPlatforms: [],
    availableAssets: [],
    rawSpreads: false,
    commissionPerLot: 0,
    newsTradingRule: "",
    profitSplitOption: {
      initialPct: 80,
      subsequentPct: 100,
      note: "First payout is 80%, next payouts are 100%",
    },
    payoutMethods: [],
    payoutFrequencies: [],
    dailyDrawdownCalculation: "equityOrBalance",
    prohibitedStrategies: [],
    hedgingAllowed: false,
    allowMultipleDevices: true,
    requireIpConsistency: true,
    consistencyRuleApplied: false,
    scalingCriteriaDays: 60,
    maxAllocationAfterScaling: 4000000,
    scalingCycleDays: 60,
    scalingRewardPct: 50,
    restrictedCountries: [],
    supportEmail: "",
    liveChatAvailable: false,
    discordUrl: "",
    supportPhone: "",
    leverages: [
      {
        profile: "EVALUATION",
        instrumentLeverages: [{ instrument: "FOREX", leverageFactor: 100 }],
      },
    ],
  },
  about: {
    legalName: "",
    registrationNo: "",
    establishedDate: "",
    founders: "",
    headquarters: "",
    jurisdiction: "",
    description: "",
    firmStatus: "Active",
    foundedYear: "",
    ceoName: "",
    extraNotes: "",
  },
};

const AddFirmForm = ({ firm, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialFirmData);

  //domaindata
  const countryOptions = useSelector(selectCountryOptions) || [];
  const assetOptions = useSelector(selectInstruments) || [];
  const platformOptions = useSelector(selectPlatforms) || [];
  const payoutFrequencies = useSelector(selectPayoutFrequencies);
  const payoutFrequencyOptions = payoutFrequencies.length
    ? payoutFrequencies
    : payoutFrequencyOptionsData;
  const domainDataStatus = useSelector(selectDomainDataStatus("all"));
  const domainDataError = useSelector(selectDomainDataError);

  const getCountryCode = (label) => {
    const country = countryOptions?.find((c) => c.label === label);
    return country?.value || "";
  };

  const [logoPreview, setLogoPreview] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [errors, setErrors] = useState({});
  const [logoError, setLogoError] = useState("");
  const [newLeverage, setNewLeverage] = useState({
    profile: "EVALUATION",
    instrument: "FOREX",
    leverageFactor: 100,
  });

  useEffect(() => {
    if (firm) {
      const countryValue =
        typeof firm.country === "string" ? firm.country : firm.country;

      setFormData({
        ...firm,
        country: countryValue,
      });
      //if (firm.logo) setLogoPreview(firm.logo);
    } else {
      setFormData(initialFirmData);
    }
  }, [firm, countryOptions]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const validateBasicDetails = () => {
    const newErrors = {};

    if (!formData?.name.trim()) {
      newErrors.name = "Firm name is required";
    }
    if (!formData?.firmType) {
      newErrors.firmType = "Firm type is required";
    }
    if (!formData?.rating) {
      newErrors.rating = "Rating is required";
    }
    if (!formData?.allRatings) {
      newErrors.allRatings = "Total Ratings is required";
    }
    if (!formData?.country) {
      newErrors.country = "Country is required";
    }
    if (!formData?.website) {
      newErrors.website = "Website is Required";
    } else if (!formData?.website.includes("https://")) {
      newErrors.website = "Enter a valid website url";
    }
    if (!formData?.logo) {
      newErrors.logo = "logo is Required";
    } else if (!formData?.logo.includes("https://")) {
      newErrors.logo = "Enter a valid logo url";
    }
    // if (!formData?.logo && !firm?.logo) {
    //   newErrors.logo = "Upload logo is required";
    //   setLogoError("Logo is required");
    // }

    return newErrors;
  };

  const validateTradingConditions = () => {
    const newErrors = {};

    if (
      !formData?.tradingConditions.maximumAccountSizeUsd ||
      formData?.tradingConditions.maximumAccountSizeUsd <= 0
    ) {
      newErrors.maximumAccountSizeUsd =
        "Maximum account size is required and must be greater than 0";
    }
    if (
      !formData?.tradingConditions.profitSplitPct ||
      formData?.tradingConditions.profitSplitPct <= 0
    ) {
      newErrors.profitSplitPct =
        "Profit split percentage is required and must be greater than 0";
    }
    if (!formData?.tradingConditions.tradingPlatforms.length) {
      newErrors.tradingPlatforms = "At least one trading platform is required";
    }
    if (!formData?.tradingConditions.prohibitedStrategies.length) {
      newErrors.prohibitedStrategies =
        "At least one prohibited strategy is required";
    }
    if (!formData?.tradingConditions.payoutMethods.length) {
      newErrors.payoutMethods = "At least one payout method is required";
    }
    if (!formData?.tradingConditions.payoutFrequencies.length) {
      newErrors.payoutFrequencies = "At least one payout frequency is required";
    }
    if (!formData?.tradingConditions.discountCode) {
      newErrors.discountCode = "Discount Code is required";
    }
    if (!formData?.tradingConditions.supportPhone) {
      newErrors.supportPhone = "Discount Code is required";
    }
    if (!formData?.tradingConditions.discordUrl) {
      newErrors.discordUrl = "Discord Url is required";
    } else if (!formData?.tradingConditions.discordUrl.includes("https://")) {
      newErrors.discordUrl = "Enter a valid discord url";
    }
    if (!formData?.tradingConditions.availableAssets.length) {
      newErrors.availableAssets = "At least one asset type is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTradingConditionsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      tradingConditions: {
        ...p.tradingConditions,
        [name]: type === "checkbox" ? checked : value,
      },
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfitSplitChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      tradingConditions: {
        ...p.tradingConditions,
        profitSplitOption: {
          ...p.tradingConditions.profitSplitOption,
          [name]: name.includes("Pct") ? parseFloat(value) ?? 0 : value,
        },
      },
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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // const handleLogoUpload = (e) => {
  //   const file = e.target.files[0];
  //   setLogoError("");

  //   if (!file) return;

  //   if (!file.type.startsWith("image/")) {
  //     setLogoError("Please upload an image file (JPEG, PNG, etc.)");
  //     return;
  //   }

  //   if (file.size > 50 * 1024) {
  //     setLogoError("Logo size must be less than 50KB");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64String = reader.result;
  //     setLogoPreview(base64String);
  //     setFormData((p) => ({ ...p, logo: base64String }));
  //   };
  //   reader.readAsDataURL(file);
  // };

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

  const addLeverage = () => {
    const { profile, instrument, leverageFactor } = newLeverage;

    // Find if profile already exists
    const existingProfileIndex =
      formData?.tradingConditions.leverages.findIndex(
        (l) => l.profile === profile
      );

    if (existingProfileIndex >= 0) {
      // Add to existing profile
      const updatedLeverages = [...formData?.tradingConditions.leverages];
      updatedLeverages[existingProfileIndex] = {
        ...updatedLeverages[existingProfileIndex],
        instrumentLeverages: [
          ...updatedLeverages[existingProfileIndex].instrumentLeverages,
          { instrument, leverageFactor },
        ],
      };

      setFormData((p) => ({
        ...p,
        tradingConditions: {
          ...p.tradingConditions,
          leverages: updatedLeverages,
        },
      }));
    } else {
      // Create new profile
      setFormData((p) => ({
        ...p,
        tradingConditions: {
          ...p.tradingConditions,
          leverages: [
            ...p.tradingConditions.leverages,
            {
              profile,
              instrumentLeverages: [{ instrument, leverageFactor }],
            },
          ],
        },
      }));
    }

    // Reset new leverage form
    setNewLeverage({
      profile: "EVALUATION",
      instrument: "FOREX",
      leverageFactor: 100,
    });
  };

  const removeLeverage = (profileIndex, instrumentIndex) => {
    const updatedLeverages = [...formData?.tradingConditions.leverages];

    if (updatedLeverages[profileIndex].instrumentLeverages.length === 1) {
      // Remove entire profile if last instrument
      updatedLeverages.splice(profileIndex, 1);
    } else {
      // Remove just the instrument
      updatedLeverages[profileIndex].instrumentLeverages.splice(
        instrumentIndex,
        1
      );
    }

    setFormData((p) => ({
      ...p,
      tradingConditions: {
        ...p.tradingConditions,
        leverages: updatedLeverages,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const basicErrors = validateBasicDetails();
    const tradingErrors = validateTradingConditions();
    const allErrors = { ...basicErrors, ...tradingErrors };

    if (Object.keys(allErrors).length > 0 || logoError) {
      setErrors(allErrors);
      setCurrentTab(0);
      return;
    }

    const finalFormData = {
      ...formData,
      slug: formData?.slug || formData?.name.toLowerCase().replace(/\s+/g, "-"),
      countryCode: formData?.countryCode || getCountryCode(formData?.country),
      tradingConditions: {
        ...formData.tradingConditions,
        availableAssets: assetOptions
          .filter((a) =>
            formData.tradingConditions.availableAssets.includes(a.code)
          )
          .map((a) => a.code),
        tradingPlatforms: platformOptions
          .filter((p) =>
            formData.tradingConditions.tradingPlatforms.includes(p.name)
          )
          .map((p) => p.code),
      },
    };

    delete finalFormData.country;

    console.log("Submitting firm data:", finalFormData);
    onSubmit(finalFormData);
    setCurrentTab(0);
    if (!firm) {
      setFormData(initialFirmData);
      setLogoPreview("");
      setErrors({});
      setLogoError("");
    }

    //dispatch(resetDomainData());
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
      sx={{
        p: 4,
        width: { xs: "100vw", lg: 940, xl: "75vw" },
        mx: "auto",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="center" fontWeight={600}>
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
            <Tab label="Leverages" />
            <Tab label="About Firm" />
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
                value={formData?.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            {/* <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label="Firm Page URL"
                name="buyUrl"
                value={formData?.buyUrl}
                onChange={handleChange}
              />
            </Grid> */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData?.website ?? ""}
                onChange={handleChange}
                placeholder="https://example.com"
                error={!!errors.website}
                helperText={errors.website}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!errors.firmType}>
                <InputLabel>Firm Type</InputLabel>
                <Select
                  name="firmType"
                  value={formData?.firmType}
                  label="Firm Type"
                  onChange={handleChange}
                >
                  {firmTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!!errors.firmType}>
                  {errors.firmType}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!errors.rating}>
                <InputLabel>Rating</InputLabel>
                <Select
                  name="rating"
                  value={formData?.rating}
                  label="Rating"
                  onChange={handleChange}
                >
                  {["A+", "A", "B", "C", "D"].map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!!errors.rating}>
                  {errors.rating}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Total Ratings"
                name="allRatings"
                value={formData?.allRatings}
                onChange={handleChange}
                error={!!errors.allRatings}
                helperText={errors.allRatings}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                fullWidth
                required
                disabled={domainDataStatus === "loading"}
                error={!!errors.country}
              >
                <InputLabel>Select Country</InputLabel>
                <Select
                  name="country"
                  value={formData?.country ?? ""}
                  label="Select Country"
                  onChange={handleChange}
                >
                  {domainDataStatus === "loading" ? (
                    <MenuItem value="" disabled>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CircularProgress size={16} />
                        <span>Loading countries...</span>
                      </Box>
                    </MenuItem>
                  ) : domainDataStatus === "failed" ? (
                    <MenuItem value="" disabled>
                      <Typography variant="body2" color="error">
                        Failed to load countries
                      </Typography>
                    </MenuItem>
                  ) : countryOptions?.length === 0 ? (
                    <MenuItem value="" disabled>
                      <em>No countries available</em>
                    </MenuItem>
                  ) : (
                    countryOptions?.map((country) => (
                      <MenuItem key={country.value} value={country.label}>
                        {country.label}
                      </MenuItem>
                    ))
                  )}
                </Select>
                <FormHelperText error={!!errors.country}>
                  {errors.country}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* <Grid size={{ xs: 12, md: 6 }}>
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
                Required. Image files only, max 50KB
              </Typography>
            </Grid> */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                type="text"
                label="Logo Url"
                name="logo"
                value={formData?.logo}
                onChange={handleChange}
                error={!!errors.logo}
                helperText={errors.logo}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.isTrusted}
                    onChange={handleChange}
                    name="isTrusted"
                  />
                }
                label="Trusted Firm"
              />
            </Grid>

            {/* <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData?.description}
                onChange={handleChange}
                placeholder="Enter firm description..."
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid> */}
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
            {/* Basic Trading Conditions */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Maximum Account Size (USD)"
                name="maximumAccountSizeUsd"
                value={formData?.tradingConditions.maximumAccountSizeUsd}
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
                value={formData?.tradingConditions.profitSplitPct}
                onChange={handleTradingNumberChange}
                inputProps={{ min: 0, max: 100 }}
                error={!!errors.profitSplitPct}
                helperText={errors.profitSplitPct}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Withdrawal Speed</InputLabel>
                <Select
                  name="withdrawalSpeed"
                  value={formData?.tradingConditions.withdrawalSpeed ?? " "}
                  label="Withdrawal Speed"
                  onChange={handleTradingConditionsChange}
                >
                  {withdrawalSpeedOptions.map((speed) => (
                    <MenuItem key={speed} value={speed}>
                      {speed}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="Discount Code"
                name="discountCode"
                value={formData?.tradingConditions.discountCode}
                onChange={handleTradingConditionsChange}
                error={!!errors.discountCode}
                helperText={errors.discountCode}
              />
            </Grid>

            {/* Profit Split Option */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Profit Split Options
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Initial Profit Split (%)"
                name="initialPct"
                value={
                  formData?.tradingConditions.profitSplitOption
                    ? formData?.tradingConditions.profitSplitOption.initialPct
                    : 0
                }
                onChange={handleProfitSplitChange}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Subsequent Profit Split (%)"
                name="subsequentPct"
                value={
                  formData?.tradingConditions.profitSplitOption
                    ? formData?.tradingConditions.profitSplitOption
                        .subsequentPct
                    : 0
                }
                onChange={handleProfitSplitChange}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Profit Split Note"
                name="note"
                value={
                  formData?.tradingConditions.profitSplitOption
                    ? formData?.tradingConditions.profitSplitOption.note
                    : ""
                }
                onChange={handleProfitSplitChange}
              />
            </Grid>

            {/* Multi-select Fields */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!errors.availableAssets}>
                <InputLabel>Available Assets</InputLabel>
                <Select
                  multiple
                  name="availableAssets"
                  value={formData?.tradingConditions.availableAssets}
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
                    <MenuItem key={asset.code} value={asset.code}>
                      <Checkbox
                        checked={formData?.tradingConditions.availableAssets.includes(
                          asset.code
                        )}
                      />
                      <ListItemText primary={asset.name} />
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
                  value={formData?.tradingConditions.tradingPlatforms}
                  onChange={handleMultiSelect}
                  input={<OutlinedInput label="Trading Platforms" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {platformOptions.map((platform) => (
                    <MenuItem key={platform.code} value={platform.name}>
                      <Checkbox
                        checked={formData?.tradingConditions.tradingPlatforms.includes(
                          platform.name
                        )}
                      />
                      <ListItemText primary={platform.name} />
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
                  value={formData?.tradingConditions.keyFeatures}
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
                          formData?.tradingConditions.keyFeatures.indexOf(
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
              <FormControl fullWidth required error={!!errors.payoutMethods}>
                <InputLabel>Payout Methods</InputLabel>
                <Select
                  multiple
                  name="payoutMethods"
                  value={formData?.tradingConditions.payoutMethods}
                  onChange={handleMultiSelect}
                  input={<OutlinedInput label="Payout Methods" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {payoutMethodOptions.map((method) => (
                    <MenuItem key={method} value={method}>
                      <Checkbox
                        checked={
                          formData?.tradingConditions.payoutMethods
                            ? formData?.tradingConditions.payoutMethods.indexOf(
                                method
                              ) > -1
                            : ""
                        }
                      />
                      <ListItemText primary={method} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.payoutMethods && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 2, mt: 0.5, display: "block" }}
                  >
                    {errors.payoutMethods}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                fullWidth
                required
                error={!!errors.payoutFrequencies}
              >
                <InputLabel>Payout Frequencies</InputLabel>
                <Select
                  multiple
                  name="payoutFrequencies"
                  value={formData?.tradingConditions.payoutFrequencies}
                  onChange={handleMultiSelect}
                  input={<OutlinedInput label="Payout Frequencies" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {payoutFrequencyOptions.map((frequency) => (
                    <MenuItem key={frequency} value={frequency}>
                      <Checkbox
                        checked={
                          formData?.tradingConditions.payoutFrequencies
                            ? formData?.tradingConditions.payoutFrequencies.indexOf(
                                frequency
                              ) > -1
                            : ""
                        }
                      />
                      <ListItemText primary={frequency} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.payoutFrequencies && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 2, mt: 0.5, display: "block" }}
                  >
                    {errors.payoutFrequencies}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                required
                fullWidth
                error={!!errors.prohibitedStrategies}
              >
                <InputLabel>Prohibited Strategies</InputLabel>
                <Select
                  multiple
                  name="prohibitedStrategies"
                  value={formData?.tradingConditions.prohibitedStrategies}
                  onChange={handleMultiSelect}
                  input={<OutlinedInput label="Prohibited Strategies" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {prohibitedStrategiesOptions.map((strategy) => (
                    <MenuItem key={strategy} value={strategy}>
                      <Checkbox
                        checked={
                          formData?.tradingConditions.prohibitedStrategies
                            ? formData?.tradingConditions.prohibitedStrategies.indexOf(
                                strategy
                              ) > -1
                            : ""
                        }
                      />
                      <ListItemText primary={strategy} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.prohibitedStrategies && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 2, mt: 0.5, display: "block" }}
                  >
                    {errors.prohibitedStrategies}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Restricted Countries</InputLabel>
                <Select
                  multiple
                  name="restrictedCountries"
                  value={formData?.tradingConditions.restrictedCountries}
                  onChange={handleMultiSelect}
                  input={<OutlinedInput label="Restricted Countries" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {countryOptions.map((country) => (
                    <MenuItem key={country.label} value={country.label}>
                      <Checkbox
                        checked={
                          formData?.tradingConditions.restrictedCountries
                            ? formData?.tradingConditions.restrictedCountries.indexOf(
                                country.label
                              ) > -1
                            : ""
                        }
                      />
                      <ListItemText primary={country.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Boolean Switches */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.tradingConditions.rawSpreads}
                    onChange={handleTradingConditionsChange}
                    name="rawSpreads"
                  />
                }
                label="Raw Spreads"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.tradingConditions.hedgingAllowed}
                    onChange={handleTradingConditionsChange}
                    name="hedgingAllowed"
                  />
                }
                label="Hedging Allowed"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.tradingConditions.allowMultipleDevices}
                    onChange={handleTradingConditionsChange}
                    name="allowMultipleDevices"
                  />
                }
                label="Allow Multiple Devices"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.tradingConditions.requireIpConsistency}
                    onChange={handleTradingConditionsChange}
                    name="requireIpConsistency"
                  />
                }
                label="Require IP Consistency"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.tradingConditions.consistencyRuleApplied}
                    onChange={handleTradingConditionsChange}
                    name="consistencyRuleApplied"
                  />
                }
                label="Consistency Rule Applied"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.tradingConditions.liveChatAvailable}
                    onChange={handleTradingConditionsChange}
                    name="liveChatAvailable"
                  />
                }
                label="Live Chat Available"
              />
            </Grid>

            {/* Numeric Fields */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Commission Per Lot"
                name="commissionPerLot"
                value={formData?.tradingConditions.commissionPerLot}
                onChange={handleTradingNumberChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Daily Drawdown Calculation</InputLabel>
                <Select
                  name="dailyDrawdownCalculation"
                  value={
                    formData?.tradingConditions.dailyDrawdownCalculation ?? ""
                  }
                  label="Daily Drawdown Calculation"
                  onChange={handleTradingConditionsChange}
                >
                  {dailyDrawdownOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Scaling Options */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Scaling Criteria Days"
                name="scalingCriteriaDays"
                value={formData?.tradingConditions.scalingCriteriaDays}
                onChange={handleTradingNumberChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Max Allocation After Scaling"
                name="maxAllocationAfterScaling"
                value={formData?.tradingConditions.maxAllocationAfterScaling}
                onChange={handleTradingNumberChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Scaling Reward %"
                name="scalingRewardPct"
                value={formData?.tradingConditions.scalingRewardPct}
                onChange={handleTradingNumberChange}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Scaling Cycle Days"
                name="scalingCycleDays"
                value={formData?.tradingConditions.scalingCycleDays}
                onChange={handleTradingNumberChange}
              />
            </Grid>

            {/* Support Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Support Email"
                name="supportEmail"
                value={formData?.tradingConditions.supportEmail}
                onChange={handleTradingConditionsChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Support Phone"
                name="supportPhone"
                required
                value={formData?.tradingConditions.supportPhone}
                onChange={handleTradingConditionsChange}
                error={!!errors.supportPhone}
                helperText={errors.supportPhone}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Discord URL"
                required
                name="discordUrl"
                value={formData?.tradingConditions.discordUrl}
                onChange={handleTradingConditionsChange}
                error={!!errors.discordUrl}
                helperText={errors.discordUrl}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="News Trading Rule"
                name="newsTradingRule"
                value={formData?.tradingConditions.newsTradingRule}
                onChange={handleTradingConditionsChange}
                placeholder="Enter news trading rules..."
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Leverages Tab */}
        <TabPanel value={currentTab} index={2}>
          <Typography
            variant="h6"
            gutterBottom
            fontWeight={600}
            color="primary"
          >
            Leverage Configuration
          </Typography>

          <Grid container spacing={3}>
            {/* Add New Leverage */}
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Add New Leverage
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Profile</InputLabel>
                      <Select
                        value={newLeverage.profile}
                        label="Profile"
                        onChange={(e) =>
                          setNewLeverage({
                            ...newLeverage,
                            profile: e.target.value,
                          })
                        }
                      >
                        {leverageProfileOptions.map((profile) => (
                          <MenuItem key={profile} value={profile}>
                            {profile}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Instrument</InputLabel>
                      <Select
                        value={newLeverage.instrument}
                        label="Instrument"
                        onChange={(e) =>
                          setNewLeverage({
                            ...newLeverage,
                            instrument: e.target.value,
                          })
                        }
                      >
                        {assetOptions.map((instrument) => (
                          <MenuItem
                            key={instrument.code}
                            value={instrument.code}
                          >
                            {instrument.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Leverage Factor"
                      value={newLeverage.leverageFactor}
                      onChange={(e) =>
                        setNewLeverage({
                          ...newLeverage,
                          leverageFactor: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={addLeverage}
                      fullWidth
                    >
                      Add Leverage
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Current Leverages */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Current Leverages
              </Typography>
              {formData?.tradingConditions.leverages &&
              formData?.tradingConditions.leverages.length === 0 ? (
                <Typography
                  color="textSecondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  No leverages configured yet
                </Typography>
              ) : (
                formData?.tradingConditions.leverages &&
                formData?.tradingConditions.leverages.map(
                  (leverage, profileIndex) => (
                    <Card key={profileIndex} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6">
                            {leverage.profile} Profile
                          </Typography>
                        </Box>
                        {leverage.instrumentLeverages.map(
                          (instrumentLeverage, instrumentIndex) => (
                            <Box
                              key={instrumentIndex}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                py: 1,
                                borderBottom:
                                  instrumentIndex <
                                  leverage.instrumentLeverages.length - 1
                                    ? "1px solid #e0e0e0"
                                    : "none",
                              }}
                            >
                              <Typography>
                                <strong>
                                  {assetOptions.length
                                    ? assetOptions?.find(
                                        (e) =>
                                          e.code ===
                                          instrumentLeverage.instrument
                                      )?.name
                                    : instrumentLeverage.instrument}
                                  :
                                </strong>{" "}
                                1:{instrumentLeverage.leverageFactor}
                              </Typography>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() =>
                                  removeLeverage(profileIndex, instrumentIndex)
                                }
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          )
                        )}
                      </CardContent>
                    </Card>
                  )
                )
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* About Firm Tab */}
        <TabPanel value={currentTab} index={3}>
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
                value={formData?.about.legalName}
                onChange={handleAboutChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Registration Number"
                name="registrationNo"
                value={formData?.about.registrationNo}
                onChange={handleAboutChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Established Date"
                name="establishedDate"
                value={formData?.about.establishedDate ?? ""}
                onChange={handleAboutChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Founded Year"
                name="foundedYear"
                value={formData?.about.foundedYear ?? ""}
                onChange={handleAboutChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Headquarters"
                name="headquarters"
                value={formData?.about.headquarters ?? ""}
                onChange={handleAboutChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Jurisdiction"
                name="jurisdiction"
                value={formData?.about.jurisdiction ?? ""}
                onChange={handleAboutChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Founders"
                name="founders"
                value={formData?.about.founders ?? ""}
                onChange={handleAboutChange}
                placeholder="Comma separated names"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="CEO Name"
                name="ceoName"
                value={formData?.about.ceoName ?? ""}
                onChange={handleAboutChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="About Description"
                name="description"
                value={formData?.about.description ?? ""}
                onChange={handleAboutChange}
                placeholder="Detailed description about the firm..."
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Extra Notes"
                name="extraNotes"
                value={formData?.about.extraNotes ?? ""}
                onChange={handleAboutChange}
                placeholder="Any additional notes..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", height: "100%" }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData?.about.firmStatus === "Active"}
                      onChange={handleFirmStatusToggle}
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">
                        Firm Status: {formData?.about.firmStatus}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formData?.about.firmStatus === "Active"
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
            <span>
              {firm && onCancel && (
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
                onClick={handleNextTab}
                sx={{ ml: 3 }}
              >
                Next
              </Button>
            </span>
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
