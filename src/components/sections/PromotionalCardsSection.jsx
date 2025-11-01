import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styled from "@emotion/styled";
import { cardData } from "/CardsData";
import { foreignNumberSystem } from "../commonFuctions/CommonFunctions";
import StarIcon from "@mui/icons-material/Star";
import HandshakeIcon from "@mui/icons-material/Handshake";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  BadgeContainer,
  CodeContainer,
  CodeLabel,
  CodeSection,
  CodeValue,
  CopyIcon,
  getBadgeStyles,
} from "./TradingCards";

// Card Component
const TradingCard = ({
  title,
  profitSplit,
  logo,
  account,
  code,
  rating,
  onCopyCode,
  firmType = "partner",
}) => {
  const badgeStyles = getBadgeStyles(firmType);
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: { xs: "90vw", sm: 380 },
        py: { xs: 2, md: 0 },
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: 380 },
          height: "auto",
          minHeight: 200,
          background:
            "linear-gradient(to top, #dab3f7b7 10%, #723699cb 30%, #deb3fdc7)",
          borderRadius: "29.95px",
          p: 2,
          "&:hover": {
            boxShadow: "0 0 2px 3px #ffd700",
          },
        }}
      >
        <CardContent
          sx={{
            p: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            {/* Icon Badge */}
            <BadgeContainer
              sx={{
                backgroundColor: badgeStyles.bg,
                color: badgeStyles.color,
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

            <Box
              component="img"
              src={logo}
              alt="Trading card"
              sx={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                flex: 1,
                height: 45,
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Lora', Helvetica",
                  fontWeight: 600,
                  color: "black",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>

          {/* Info Section */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontFamily: "Lora",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#49454f",
                }}
              >
                Profit Split:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lora",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "black",
                }}
              >
                {profitSplit}%
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontFamily: "Lora",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#49454f",
                }}
              >
                Account Size:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lora",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "black",
                }}
              >
                Upto $&nbsp;{foreignNumberSystem(account)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontFamily: "Lora",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#49454f",
                }}
              >
                Rating:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lora",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "black",
                }}
              >
                {rating}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Code Badge */}
      <CodeSection
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: 380 },
          mt: 1,
          border: "1.5px solid #ffd700",
        }}
      >
        <CodeLabel>Discount:</CodeLabel>
        <CodeContainer
          onClick={() => onCopyCode(code)}
          title="Click to copy code"
        >
          <CodeValue>{code}</CodeValue>
          <CopyIcon />
        </CodeContainer>
      </CodeSection>
    </Box>
  );
};

export const PromotionalCardsSection = ({ length }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const premiumCards = cardData?.filter((e) => e.firmType === "premium");
  const displayedCards = length ? premiumCards.slice(0, length) : premiumCards;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setSnackbarOpen(true);
    });
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "space-between" },
          gap: 2,
          padding: { xs: "24px 8px", md: "28px 24px" },
          bgcolor: "#e9e7e71a",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Montserrat, Helvetica",
            fontWeight: 600,
            color: "white",
            fontSize: { xs: "24px", md: "32px" },
            lineHeight: { xs: "28px", md: "32px" },
            whiteSpace: { xs: "normal", md: "nowrap" },
          }}
        >
          Premium Firms to Watch
        </Typography>

        <Typography
          sx={{
            fontFamily: "Lora, Helvetica",
            fontWeight: 400,
            color: "white",
            fontSize: { xs: "14px", md: "16px" },
            lineHeight: "20px",
            textAlign: { xs: "center", md: "right" },
            maxWidth: "650px",
          }}
        >
          These sponsored picks are worth a look — offering strong funding
          options, generous profit splits. Choose from our exclusive selection
          of funded account options.
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#00000099",
          py: { xs: 1, md: 4 },
          px: { xs: 1, md: 3 },
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent={{ xs: "center", md: "flex-start" }}
          wrap="wrap"
        >
          {displayedCards.map((card, index) => (
            <Grid
              size={{ xs: "auto", lg: 4, xl: 3 }}
              key={index}
              wrap="wrap"
              sx={{ placeItems: "center" }}
            >
              <TradingCard {...card} onCopyCode={handleCopyCode} />
            </Grid>
          ))}
        </Grid>

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
    </>
  );
};

export default PromotionalCardsSection;
