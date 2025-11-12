import React, { useContext, useEffect, useState } from "react";
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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { cardData } from "../../../CardsData";
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
} from "../sections/Reviews";
import { MainContext } from "../../App";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/loginSlice";

export const PropFirmDetailsPage = () => {
  const user = useSelector(selectUser);
  const params = useParams();
  const [firmDetails, setFirmDetails] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const reviewData = [
    {
      id: 1,
      product_id: 1, // Alpha Trading Group
      reviewer_name: "John Doe",
      prop_name: "Alpha Trading Group",
      rating: "A",
      description:
        "Great product! The quality exceeded my expectations. Would definitely buy again.",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      is_deleted: false,
    },
    {
      id: 2,
      product_id: 1, // Alpha Trading Group
      reviewer_name: "Jane Smith",
      prop_name: "Alpha Trading Group",
      rating: "A+",
      description:
        "Excellent service and fast delivery. Highly recommended! The packaging was also very secure.",
      created_at: "2024-01-16T14:20:00Z",
      updated_at: "2024-01-16T14:20:00Z",
      is_deleted: false,
    },
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setSnackbarOpen(true);
    });
  };

  const badgeStyles = getBadgeStyles(firmDetails?.firmType);

  useEffect(() => {
    const propFirm = cardData?.find((prop) => String(prop.id) == params.id);
    if (!propFirm) {
      navigate("/");
    }
    setFirmDetails(propFirm);
    //setFirmDetails(cardData[0])
    //console.log("propfirm",propFirm)
    window.scrollTo({ top: 0, behaviour: "smooth" });
  }, []);

  return (
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
              href={firmDetails?.firmPageURL || "#"}
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

            <Box sx={{ color: "white", mb: 2 }}>
              <Typography>
                Maximum Account Size:{" "}
                {foreignNumberSystem(firmDetails?.maximumAccountSizeUsd)}
              </Typography>
              <Typography>
                Profit Split: {firmDetails?.tradingConditions.profitSplitPct}%
              </Typography>
              {/* Trading platforms */}
              <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                <Typography>Trading Platforms:</Typography>
                {firmDetails?.tradingConditions.tradingPlatforms.map((p, idx) =>
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
                <CodeValue variant="span">
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
            {firmDetails?.tradingConditions.keyFeatures.map((e,i) => (
              <Typography key={i} color="white">{e}</Typography>
            ))}
          </Box>
        </Box>

        {/* About Section */}
        <Box sx={{ pt: 6, width: "80%" }}>
          <Typography variant="h6" color="white" gutterBottom>
            About {firmDetails?.name}
          </Typography>
          {/* {Object.entries(firmDetails["about"]).map(([key, value='N/A']) => (
            <Typography key={key} variant="body2" sx={{ mb: 1 }}>
              <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
              {value}
            </Typography>
          ))} */}
          <Typography variant="body1" sx={{ mb: 1, color: 'white', fontFamily: "Lora, Helvetica",}}>
            <strong>Legal Name : </strong> {firmDetails?.about.legalName || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: 'white', fontFamily: "Lora, Helvetica",}}>
            <strong>Registration No. : </strong> {firmDetails?.about.registrationNo || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: 'white', fontFamily: "Lora, Helvetica",}}>
            <strong>Established Date : </strong> {firmDetails?.about.establishedDate || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: 'white', fontFamily: "Lora, Helvetica",}}>
            <strong>Founders : </strong> {firmDetails?.about.founders || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: 'white', fontFamily: "Lora, Helvetica",}}>
            <strong>Headquarters : </strong> {firmDetails?.about.headquarters || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: 'white', fontFamily: "Lora, Helvetica",}}>
            <strong>Jurisdiction : </strong> {firmDetails?.about.jurisdiction || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: 'white', fontFamily: "Lora, Helvetica",}}>
            <strong>Firm Status: </strong> {firmDetails?.about.firmStatus || "N/A"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "white",
              fontFamily: "Lora, Helvetica",
              textAlign: "justify",
            }}
          >
            <strong>Description :</strong>&nbsp;
            {firmDetails?.name}&nbsp;{firmDetails?.description}
          </Typography>
        </Box>

        {/* Reviews Section */}
        <Box sx={{ width: "80%", py: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" color="white">
              Customer Reviews
            </Typography>
            {/* <Button
              variant="contained"
              sx={{
                bgcolor: "#4b0082",
                "&:hover": { bgcolor: "#4b0082dd" },
                borderRadius: 2,
              }}
            >
              Write a Review
            </Button> */}
          </Box>

          <Typography variant="body2" color="white" textAlign="right" mb={2}>
            Showing {reviewData?.length} reviews
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reviewData.map((review, idx) => (
              <Card
                key={idx}
                sx={{
                  bgcolor: "rgba(255,255,255,0.25)",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography color="white" fontWeight="bold">
                      {review?.reviewer_name}
                    </Typography>
                    <Typography color="rgba(255,255,255,0.7)">
                      {formatDate(review.updated_at)}
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
                    sx={{ wordBreak: "break-word" }}
                  >
                    {review.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};
