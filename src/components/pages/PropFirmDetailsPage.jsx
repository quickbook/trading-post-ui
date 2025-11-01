import React, { useEffect, useState } from "react";
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
import { CodeContainer, CodeValue, CopyIcon } from "../sections/TradingCards";
import { foreignNumberSystem } from "../commonFuctions/CommonFunctions";
import { platformSources } from "../sections/FirmDetailsTableSection";

export const PropFirmDetailsPage = () => {
  const params = useParams();
  const [firmDetails, setFirmDetails] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const reviewData = [
    { name: "M Johnson", date: "August 1, 2025", content: "Write a Review" },
    { name: "M Johnson", date: "August 1, 2025", content: "Write a Review" },
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setSnackbarOpen(true);
    });
  };

  useEffect(() => {
    const propFirm = cardData?.find((prop) => String(prop.id) === params.id);
    if (!propFirm) {
      navigate("/");
    }
    setFirmDetails(propFirm);
    window.scrollTo({ top: 0, behaviour: "smooth" });
  });

  return (
    <>
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
              {firmDetails?.title}
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
              onClick={() => handleCopyCode(firmDetails?.code)}
              title="Click to copy code"
            >
              <CodeValue>{firmDetails?.code}</CodeValue>
              <CopyIcon />
            </CodeContainer>
          </Box>

          {/* Buttons */}
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
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

            <Button
              variant="contained"
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
                {foreignNumberSystem(firmDetails?.maxAllocation)}
              </Typography>
              <Typography>Profit Split: 90%</Typography>
              {/* Trading platforms */}
              <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                <Typography>Trading Platforms:</Typography>
                {firmDetails?.platforms.map((p, idx) =>
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
                {firmDetails?.assets.map((asset, idx) => (
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
                ))}
              </Box>
              <Typography>
                Discount Code: &nbsp;
                <CodeValue variant="span">{firmDetails?.code}</CodeValue>{" "}
              </Typography>
            </Box>
          </Box>

          {/* Right Column */}
          <Box sx={{ minWidth: { md: "350px" } }}>
            <Typography variant="h6" color="white" gutterBottom>
              Key Features
            </Typography>
            <Typography color="white">Multiple Account Sizes</Typography>
            <Typography color="white">Fast Withdrawals</Typography>
          </Box>
        </Box>

        {/* About Section */}
        <Box sx={{ pt: 6, width: "80%" }}>
          <Typography variant="h6" color="white" gutterBottom>
            About {firmDetails?.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "white",
              fontFamily: "Lora, Helvetica",
              textAlign: "justify",
            }}
          >
            {firmDetails?.title} is a proprietary trading firm that started in
            2022 and offers a variety of funding challenges for traders:
            Simulated evaluation challenges (one-step, two-step) Instant funding
            accounts High-tier "Funded King" challenge up to $1M accounts Profit
            share up to 90%, with daily to bi-weekly payouts via Rise Pay They
            integrate their own TradeLocker platform alongside MT5 and
            MatchTrader for trading.
          </Typography>
        </Box>

        {/* Reviews Section */}
        <Box sx={{ width: "80%", py: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" color="white">
              Customer Reviews
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#4b0082",
                "&:hover": { bgcolor: "#4b0082dd" },
                borderRadius: 2,
              }}
            >
              Write a Review
            </Button>
          </Box>

          <Typography variant="body2" color="white" textAlign="right" mb={2}>
            Showing 10 reviews
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
                      {review.name}
                    </Typography>
                    <Typography color="rgba(255,255,255,0.7)">
                      {review.date}
                    </Typography>
                  </Box>
                  <Typography color="white" fontWeight="bold">
                    {review.content}
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
