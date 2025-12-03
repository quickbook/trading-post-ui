import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Container,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import the tick icon
import { useNavigate, useParams } from "react-router-dom";
import {
  BadgeContainer,
  CodeContainer,
  CodeValue,
  CopyIcon,
  getBadgeStyles,
} from "../sections/TradingCards";
import { foreignNumberSystem } from "../commonFuctions/CommonFunctions";
import { platformSources } from "../sections/FirmDetailsTableSection";
import {
  formatDate,
  getGradeColor,
  getGradeDisplay,
  getTradingExpDisplay,
} from "../sections/Reviews";
import { MainContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/auth/loginSlice";
import {
  selectCurrentFirm,
  selectFirmsError,
} from "../../features/firms/firmsSelectors";
import { fetchFirmById } from "../../features/firms/firmsSlice";
import { LoadingScreen } from "./HomePage";
import PropFirmsChallenges from "../sections/PropFirmsChallenges";

export const PropFirmDetailsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const propFirm = useSelector(selectCurrentFirm) ?? null;
  const propFirmStatus = useSelector((st) => st.firms.status.currentFirm);
  const propFirmError = useSelector(selectFirmsError);
  const params = useParams();
  const firmId = params.id;
  const [value, setValue] = useState(0);
  const [firmDetails, setFirmDetails] = useState(propFirm);
  const [copiedCode, setCopiedCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const initPropFirmDetails = useRef(false);

  const reviewData = firmDetails?.reviews ?? [];

  // Helper function to convert rating letters to numerical values for sorting
  const getRatingValue = (rating) => {
    const ratingMap = {
      "A+": 5,
      A: 4,
      "B+": 3,
      B: 2,
      "C+": 1,
      C: 0,
    };
    return ratingMap[rating] || 0;
  };

  // Filter and sort reviews
  const filteredReviews = React.useMemo(() => {
    let filtered = reviewData.filter(
      (review) => !filterVerifiedOnly || review.isVrfdPurchase
    );

    // Sort the filtered reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "oldest":
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case "top-rated":
          return getRatingValue(b.rating) - getRatingValue(a.rating);
        case "low-rated":
          return getRatingValue(a.rating) - getRatingValue(b.rating);
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    return filtered;
  }, [reviewData, filterVerifiedOnly, sortBy]);

  const badgeStyles = getBadgeStyles(firmDetails?.firmType);
  const valueStyles = { color: "#cecece" };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setSnackbarOpen(true);
    });
  };

  useEffect(() => {
     if(propFirm && (propFirm.id != Number(firmId))){
      initPropFirmDetails.current = false;
    }
    if (!initPropFirmDetails.current) {
      if(propFirm && (propFirm.id != Number(firmId))) dispatch(fetchFirmById(firmId));
      initPropFirmDetails.current = true;
    }
    if(propFirmStatus === "loading"){
      setIsLoading(true);
    }else{
      const timer = setTimeout(()=>{
        setIsLoading(false);
      },1000);
    }
    return () => clearTimeout();
  }, []);

  useEffect(() => {
    setIsLoading(!propFirm || propFirmStatus === "loading" ? true : false);
    setFirmDetails(propFirm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [propFirm]);

  return isLoading ? (
    <LoadingScreen />
  ) : propFirmStatus === "failed" ? (
    <>{propFirmError}</>
  ) : (
    <>
      <Button
        variant="contained"
        color="secondary"
        sx={{
          display: { xs: "none", md: "block" },
          mb: 2,
          position: "fixed",
          top: 100,
          left: 40,
        }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          bgcolor: "rgba(255,255,255,0.15)", // #ffffff26
          borderRadius: "10px",
          overflow: "hidden",
          py: 4,
          px: 2,
          mt: { xs: 1, md: 1 },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          flexWrap={"wrap"}
          sx={{ width: { md: "80%" } }}
        >
          {/* Image */}
          <Avatar
            src={firmDetails?.logo || "/crown.png"}
            alt="Alpha Trading Logo"
            variant="rounded"
            sx={{ width: 69, height: 69 }}
          />

          {/* Title + Rating */}
          <Box flex={1}>
            <Typography
              sx={{
                fontFamily: "Montserrat, Helvetica",
                fontWeight: 600,
                fontSize: { xs: "24px", md: "32px" },
                color: "white",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {firmDetails?.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Montserrat, Helvetica",
                fontWeight: 600,
                fontSize: "16px",
                color: "white",
                mt: 1,
                whiteSpace: "nowrap",
              }}
            >
              Rating:&nbsp; {firmDetails?.rating || "A+"}
            </Typography>
            <BadgeContainer
              sx={{
                width: "fit-content",
                position: "static",
                backgroundColor: badgeStyles.bg,
                color: badgeStyles.color,
                padding: "6px",
                mt: 1,
              }}
            >
              {badgeStyles.icon}
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "700",
                  lineHeight: 1,
                  letterSpacing: "1px",
                }}
              >
                {badgeStyles.text}
              </Typography>
            </BadgeContainer>
          </Box>

          {/* Code Badge */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1}
          >
            <Typography
              sx={{
                fontFamily: "Montserrat, Helvetica",
                fontWeight: 600,
                fontSize: "16px",
                color: "#cecece",
              }}
            >
              Code:
            </Typography>
            <CodeContainer
              sx={{ bgcolor: "#00000060" }}
              onClick={() =>
                handleCopyCode(firmDetails?.tradingConditions.discountCode)
              }
              title="Click to copy code"
            >
              <CodeValue>
                {firmDetails?.tradingConditions.discountCode}
              </CodeValue>
              <CopyIcon />
            </CodeContainer>
          </Box>

          {/* Buttons */}
          <Box display="flex" gap={2}>
            {user && (
              <Button
                variant="outlined"
                onClick={() => navigate("/reviews")}
                sx={{
                  bgcolor: "black",
                  color: "white",
                  border: "1px solid white",
                  "&:hover": { bgcolor: "grey.900" },
                  borderRadius: "20px",
                  px: 2,
                  py: 1,
                  fontFamily: "Montserrat, Helvetica",
                  fontWeight: 600,
                  fontSize: "14px",
                  height: "auto",
                }}
              >
                Leave a Review
              </Button>
            )}

            <Button
              variant="contained"
              href={firmDetails?.website || "#"}
              target="blank"
              sx={{
                bgcolor: "#4b0082",
                color: "white",
                border: "1px solid white",
                "&:hover": { bgcolor: "#3d0066" },
                borderRadius: "20px",
                px: 2,
                py: 1,
                fontFamily: "Montserrat, Helvetica",
                fontWeight: 600,
                fontSize: "14px",
                height: "auto",
              }}
            >
              Buy Now
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Code <strong>{copiedCode}</strong> copied to clipboard!
          </Alert>
        </Snackbar>
      </Box>
      <Box sx={{ width: { xs: "75%", xl: "100%" }, mb: 1, maxWidth: 1280 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            textColor="secondary"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#cecece", // underline color
                height: "3px", // thickness
              },
            }}
          >
            <Tab
              label="Details"
              {...a11yProps(0)}
              sx={{
                color: "gray",
                "&.Mui-selected": { color: "#cecece" }, // selected tab #cecece
                width: { xs: 100, md: 200 },
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Challenges"
              {...a11yProps(1)}
              sx={{
                color: "gray",
                "&.Mui-selected": { color: "#cecece" }, // selected tab #cecece
                width: { xs: 100, md: 200 },
                textTransform: "capitalize",
              }}
            />
          </Tabs>
        </Box>
      </Box>
      {value === 1 ? (
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <PropFirmsChallenges firm={firmDetails?.name} />
        </Container>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "black",
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              pt: 4,
              width: "80%",
              bgcolor: "#ffffff25",
              p: 2.5,
              justifyContent: "space-between",
              borderRadius: "10px",
            }}
          >
            {/* Left Column */}
            <Box>
              <Typography variant="h6" color="white" gutterBottom>
                Trading Conditions
              </Typography>

              <Box
                sx={{
                  color: "white",
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Typography>
                  Maximum Account Size: &nbsp;
                  <span style={valueStyles}>
                    $
                    {foreignNumberSystem(
                      firmDetails?.tradingConditions.maximumAccountSizeUsd
                    )}
                  </span>
                </Typography>
                <Typography>
                  Profit Split:{" "}
                  <span style={valueStyles}>
                    {firmDetails?.tradingConditions.profitSplitPct}%
                  </span>
                </Typography>
                {/* Trading platforms */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography>Trading Platforms:</Typography>
                  {firmDetails?.tradingConditions.tradingPlatforms.map(
                    (p, idx) =>
                      platformSources[`${p}`] ? (
                        <img
                          key={idx}
                          title={p}
                          src={platformSources[`${p}`]}
                          alt={p}
                          style={{
                            objectFit: "cover",
                            width: "24px",
                            height: "24px",
                            padding: "2px",
                          }}
                        />
                      ) : (
                        <Avatar
                          key={idx}
                          title={p}
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: 12,
                            bgcolor: "#4b0082",
                          }}
                        >
                          {p.slice(0, 1).toUpperCase()}
                        </Avatar>
                      )
                  )}
                </Box>
                {/* Assets */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography>Available Assets:</Typography>
                  {firmDetails?.tradingConditions.availableAssets.map(
                    (asset, idx) => (
                      <Chip
                        key={idx}
                        label={asset}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.4)",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    )
                  )}
                </Box>
                <Typography>
                  Discount Code: &nbsp;
                  <CodeValue
                    variant="span"
                    sx={{
                      padding: "4px 8px",
                      bgcolor: "#4b0082",
                      color: "#ffffff",
                      borderRadius: 2,
                    }}
                  >
                    {firmDetails?.tradingConditions.discountCode}
                  </CodeValue>{" "}
                </Typography>
              </Box>
            </Box>

            {/* Right Column */}
            <Box sx={{ minWidth: { md: "350px" } }}>
              <Typography variant="h6" color="white" gutterBottom>
                Key Features
              </Typography>
              {firmDetails?.tradingConditions.keyFeatures.map((e, i) => (
                <Typography key={i} color="white" sx={{ mb: 1 }}>
                  {e}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* About Section */}
          <Box sx={{ pt: 6, width: "80%" }}>
            <Typography
              variant="h5"
              color="white"
              sx={{ mb: 3, pb: 2, borderBottom: "1px solid #808080" }}
            >
              About {firmDetails?.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{ my: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Legal Name : </strong>{" "}
              {firmDetails?.about.legalName || "N/A"}
            </Typography>
            <Typography
              sx={{ my: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Country:</strong> {firmDetails?.country || "N/A"}
            </Typography>
            <Typography
              sx={{ my: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Website:</strong>{" "}
              {firmDetails?.website ? (
                <a
                  href={firmDetails.website || "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#4b9dff" }}
                >
                  {firmDetails.website}
                </a>
              ) : (
                "N/A"
              )}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Registration No. : </strong>{" "}
              {firmDetails?.about.registrationNo || "N/A"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Established Date : </strong>{" "}
              {firmDetails?.about.establishedDate || "N/A"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Founders : </strong>{" "}
              {firmDetails?.about.founders || "N/A"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Headquarters : </strong>{" "}
              {firmDetails?.about.headquarters || "N/A"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Jurisdiction : </strong>{" "}
              {firmDetails?.about.jurisdiction || "N/A"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Firm Status: </strong>{" "}
              {firmDetails?.about.firmStatus || "N/A"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Founded Year: </strong>{" "}
              {firmDetails?.about.foundedYear || "N/A"}
            </Typography>
            {firmDetails?.about.ceoName && (
              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  color: "whitesmoke",
                  fontFamily: "Lora, Helvetica",
                }}
              >
                <strong>CEO: </strong> {firmDetails.about.ceoName}
              </Typography>
            )}
            {firmDetails?.about.extraNotes && (
              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  color: "whitesmoke",
                  fontFamily: "Lora, Helvetica",
                }}
              >
                <strong>Additional Notes: </strong>{" "}
                {firmDetails.about.extraNotes}
              </Typography>
            )}
            <Typography
              sx={{ my: 1, color: "whitesmoke", fontFamily: "Lora, Helvetica" }}
            >
              <strong>Trusted:</strong> {firmDetails?.isTrusted ? "Yes" : "No"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "whitesmoke",
                fontFamily: "Lora, Helvetica",
                textAlign: "justify",
              }}
            >
              <strong>Description :</strong>&nbsp;
              {firmDetails?.name}&nbsp;{firmDetails?.about.description}
            </Typography>
          </Box>

          <Box sx={{ pt: 6, width: "80%", color: "whitesmoke" }}>
            <Typography
              variant="h5"
              color="white"
              gutterBottom
              sx={{ mb: 3, pb: 2, borderBottom: "1px solid #808080" }}
            >
              Trading Conditions & Restrictions
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Withdrawal Speed:{" "}
              {firmDetails?.tradingConditions.withdrawalSpeed || "N/A"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Commission Per Lot: $
              {firmDetails?.tradingConditions.commissionPerLot || "N/A"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Raw Spreads:{" "}
              {firmDetails?.tradingConditions.rawSpreads ? "Yes" : "No"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Payout Frequencies:{" "}
              {firmDetails?.tradingConditions?.payoutFrequencies?.length
                ? firmDetails.tradingConditions.payoutFrequencies.join(", ")
                : "N/A"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Hedging Allowed:{" "}
              {firmDetails?.tradingConditions.hedgingAllowed ? "Yes" : "No"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Multiple Devices:{" "}
              {firmDetails?.tradingConditions.allowMultipleDevices
                ? "Yes"
                : "No"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              IP Consistency Required:{" "}
              {firmDetails?.tradingConditions.requireIpConsistency
                ? "Yes"
                : "No"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Live Chat Available:{" "}
              {firmDetails?.tradingConditions.liveChatAvailable ? "Yes" : "No"}
            </Typography>

            {/* Profit Split Details */}
            {firmDetails?.tradingConditions.profitSplitOption && (
              <Typography>
                Profit Split:{" "}
                {firmDetails.tradingConditions.profitSplitOption.initialPct}%
                initial, then{" "}
                {firmDetails.tradingConditions.profitSplitOption.subsequentPct}%
                subsequent
              </Typography>
            )}

            {/* Payout Methods */}
            {firmDetails?.tradingConditions.payoutMethods && (
              <Typography>
                Payout Methods:{" "}
                {firmDetails.tradingConditions.payoutMethods.join(", ")}
              </Typography>
            )}

            {/* Support Information */}
            {firmDetails?.tradingConditions.supportEmail && (
              <Typography>
                Support Email: {firmDetails.tradingConditions.supportEmail}
              </Typography>
            )}
            {firmDetails?.tradingConditions.supportPhone && (
              <Typography>
                Support Phone: {firmDetails.tradingConditions.supportPhone}
              </Typography>
            )}

            <Typography sx={{ mt: 1 }}>
              <strong>Prohibited Strategies:</strong>
            </Typography>
            {firmDetails?.tradingConditions?.prohibitedStrategies?.length ? (
              firmDetails.tradingConditions.prohibitedStrategies.map(
                (rule, idx) => (
                  <Typography key={idx} color="whitesmoke" sx={{ ml: 2 }}>
                    • {rule}
                  </Typography>
                )
              )
            ) : (
              <Typography color="whitesmoke" sx={{ ml: 2 }}>
                N/A
              </Typography>
            )}

            <Typography sx={{ mt: 1 }}>
              <strong>Restricted Countries:</strong>{" "}
            </Typography>
            {firmDetails?.tradingConditions?.restrictedCountries?.length ? (
              firmDetails.tradingConditions.restrictedCountries.map(
                (country, idx) => (
                  <Typography key={idx} color="whitesmoke" sx={{ ml: 2 }}>
                    • {country}
                  </Typography>
                )
              )
            ) : (
              <Typography color="whitesmoke" sx={{ ml: 2 }}>
                N/A
              </Typography>
            )}
          </Box>

          <Box sx={{ pt: 6, width: "80%" }}>
            {/* Additional Features Section */}
            <Typography
              variant="h5"
              color="white"
              gutterBottom
              sx={{ mb: 3, pb: 2, borderBottom: "1px solid #808080" }}
            >
              Trading Rules
            </Typography>
            <Typography color="whitesmoke">
              Daily Drawdown Calculation:{" "}
              {firmDetails?.tradingConditions.dailyDrawdownCalculation || "N/A"}
            </Typography>
            <Typography color="whitesmoke" sx={{ mt: 1 }}>
              Consistency Rule:{" "}
              {firmDetails?.tradingConditions.consistencyRuleApplied
                ? "Applied"
                : "Not Applied"}
            </Typography>

            {/* Scaling Information */}
            {firmDetails?.tradingConditions.scalingCriteriaDays && (
              <Typography color="whitesmoke" sx={{ mt: 1 }}>
                Scaling Criteria:{" "}
                {firmDetails.tradingConditions.scalingCriteriaDays} days
              </Typography>
            )}
            {firmDetails?.tradingConditions.maxAllocationAfterScaling && (
              <Typography color="whitesmoke" sx={{ mt: 1 }}>
                Max Allocation After Scaling:{" "}
                {foreignNumberSystem(
                  firmDetails.tradingConditions.maxAllocationAfterScaling
                )}
              </Typography>
            )}
            <Typography color="whitesmoke" sx={{ mt: 1 }}>
              Scaling Cycle Days:{" "}
              {firmDetails?.tradingConditions?.scalingCycleDays ?? "N/A"}
            </Typography>

            <Typography color="whitesmoke" sx={{ mt: 1 }}>
              Scaling Reward %:{" "}
              {firmDetails?.tradingConditions?.scalingRewardPct ?? "N/A"}%
            </Typography>
            {firmDetails?.tradingConditions?.profitSplitOption?.note && (
              <Typography sx={{ mt: 1 }} color="whitesmoke">
                <strong>Profit Split Note:</strong>{" "}
                {firmDetails.tradingConditions.profitSplitOption.note}
              </Typography>
            )}

            <Typography sx={{ mt: 2 }} color="white">
              <strong>Leverage Profiles:</strong>
            </Typography>

            {firmDetails?.tradingConditions?.leverages?.length ? (
              firmDetails.tradingConditions.leverages.map((lv, i) => (
                <Box key={i} sx={{ ml: 2, mb: 1 }}>
                  <Typography color="whitesmoke">
                    • <strong>Profile:</strong> {lv.profile}
                  </Typography>

                  {lv.instrumentLeverages?.map((ins, j) => (
                    <Typography key={j} sx={{ ml: 3 }} color="whitesmoke">
                      - {ins.instrument}: {ins.leverageFactor}x
                    </Typography>
                  ))}
                </Box>
              ))
            ) : (
              <Typography sx={{ ml: 2 }} color="whitesmoke">
                N/A
              </Typography>
            )}

            {/* News Trading Rule */}
            {firmDetails?.tradingConditions.newsTradingRule && (
              <>
                <Typography
                  variant="h6"
                  color="white"
                  gutterBottom
                  sx={{ mt: 3 }}
                >
                  News Trading
                </Typography>
                <Typography color="white" sx={{ fontStyle: "italic" }}>
                  {firmDetails.tradingConditions.newsTradingRule}
                </Typography>
              </>
            )}
          </Box>

          {/* Reviews Section */}
          <Box sx={{ width: "80%", py: 6 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h5" color="white">
                Customer Reviews
              </Typography>
              <Button
                onClick={() => navigate("/reviews")}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: "capitalize",
                  bgcolor: "#4b0082",
                  px: 2,
                  py: 1.2,
                  border: "1px solid #fff",
                  "&:hover": {
                    bgcolor: "#4b0082b2",
                    border: "1px solid #ffd700",
                  },
                }}
              >
                Write a Review
              </Button>
            </Box>

            {/* Filters and Sort Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {/* Verified Purchase Filter with Switch */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="body2"
                  color="white"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Verified Purchase Only
                </Typography>
                <Switch
                  checked={filterVerifiedOnly}
                  onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      color: "#ffffff",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#0b4d0e",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#0b4d0e",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: "#666666",
                      opacity: 1,
                    },
                    "& .MuiSwitch-switchBase:not(.Mui-checked) .MuiSwitch-thumb":
                      {
                        backgroundColor: "#ffffff",
                      },
                  }}
                />
              </Box>
              {/* Sort Dropdown */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="white">
                  Sort by:
                </Typography>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: "#000000",
                    color: "white",
                    border: "1px solid #4b0082",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontFamily: "Montserrat, Helvetica",
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="top-rated">Highest Rating</option>
                  <option value="low-rated">Lowest Rating</option>
                </select>
              </Box>
            </Box>

            <Typography variant="body2" color="white" textAlign="right" mb={2}>
              Showing {filteredReviews.length} reviews
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filteredReviews.length === 0 ? (
                <Box
                  textAlign="center"
                  py={6}
                  sx={{ bgcolor: "#ffffff50", borderRadius: 2, mt: 4 }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No reviews found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    No reviews found with the current filters
                  </Typography>
                </Box>
              ) : (
                filteredReviews.map((review, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.25)",
                      borderRadius: 2,
                      position: "relative",
                    }}
                  >
                    {/* Verified Purchase Chip - Top Right */}
                    {review.isVrfdPurchase && (
                      <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: "16px" }} />}
                          label="Verified Purchase"
                          size="small"
                          sx={{
                            bgcolor: "#0b4d0e91", // Green color
                            color: "white",
                            fontSize: "0.7rem",
                            height: "24px",
                            fontWeight: "bold",
                            "& .MuiChip-icon": {
                              color: "white",
                              fontSize: "16px",
                            },
                          }}
                        />
                      </Box>
                    )}

                    <CardContent sx={{ pt: review.isVrfdPurchase ? 5 : 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography color="white" fontWeight="bold">
                          {review?.reviewerName}
                        </Typography>
                        <Typography color="rgba(255,255,255,0.7)">
                          {formatDate(review.updatedAt)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ color: getGradeColor(review?.rating) }}
                      >
                        {getGradeDisplay(review?.rating)}
                      </Typography>
                      <Typography
                        color="white"
                        fontWeight="bold"
                        sx={{ wordBreak: "break-word", mt: 1 }}
                      >
                        {review.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
