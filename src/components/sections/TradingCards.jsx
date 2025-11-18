import React, { useState } from "react";
import Slider from "react-slick";
import {
  Card,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StarIcon from "@mui/icons-material/Star";
import HandshakeIcon from "@mui/icons-material/Handshake";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { styled, useTheme } from "@mui/material/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { foreignNumberSystem } from "../commonFuctions/CommonFunctions";
import { useSelector } from "react-redux";

// Styled components for custom styling
const StyledCard = styled(Card)(({ theme }) => ({
  width: { xs: "100%", md: 340 },
  borderRadius: "15px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(to top, #d4a4f8ff 30%, #edd6fcff, #ffffff)",
  color: "#333333",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  fontFamily: '"Arial", sans-serif',
  position: "relative",
  overflow: "visible",
  border: "1px solid #e0e0e0",
  "&:hover": {
    boxShadow: "0 0 2px 3px #ffd700",
  },
}));

export const BadgeContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "-8px",
  right: "12px",
  borderRadius: "12px",
  padding: "4px 10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "4px",
  fontWeight: "700",
  fontSize: "12px",
  zIndex: 1,
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
}));

const CardLogo = styled("img")(({ theme }) => ({
  width: 45,
  height: 45,
  borderRadius: "40%",
  objectFit: "cover",
  border: "2px solid #e0e0e0",
  [theme.breakpoints.down("md")]: {
    width: 35,
    height: 35,
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  padding: "12px",
  textAlign: "center",
  borderBottom: "1px solid #f0f0f0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "24px",
  position: "relative",
}));

const CardBody = styled(Box)(({ theme }) => ({
  padding: "12px 20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  userSelect: "text",
}));

const CardFooter = styled(Box)(({ theme }) => ({
  padding: "0 20px 16px 20px",
  textAlign: "center",
}));

const ProfitSplit = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "12px",
  flexWrap: "wrap",
  gap: "8px",
}));

const ProfitText = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: "700",
  color: "#2e7d32",
}));

const UptoText = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: "500",
  color: "#666666",
}));

const AccountValue = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "700",
  textAlign: "center",
  marginBottom: "20px",
  color: "#333333",
  [theme.breakpoints.down("xs")]: {
    fontSize: "16px",
  },
}));

export const CodeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  cursor: "pointer",
  padding: "4px 12px",
  borderRadius: "4px",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "#000",
  },
  [theme.breakpoints.down("md")]: {
    padding: "4px",
  },
}));

export const CopyIcon = styled(ContentCopyIcon)(({ theme }) => ({
  fontSize: "18px",
  color: "#999999",
  transition: "color 0.2s",
  "&:hover": {
    color: "#ff9800",
  },
}));

export const CodeSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#4b0082",
  borderRadius: "15px",
  padding: "8px 0px",
}));

export const CodeLabel = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: "500",
  color: "#fff",
}));

export const CodeValue = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: "800",
  color: "#fff",
  letterSpacing: "1px",
}));

const FundButton = styled(Button)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#000",
  color: "white",
  fontWeight: "700",
  fontSize: "16px",
  padding: "10px 30px",
  borderRadius: "4px",
  border: "2px solid #000",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#4b0082b2",
    border: "2px solid #ff9800",
  },
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  padding: { md: "4px 16px" },
  width: "100%",
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#000000",
}));

// Function to get badge styles based on firm type
export const getBadgeStyles = (firmType) => {
  switch (firmType) {
    case "premium":
      return {
        bg: "#ffd700",
        color: "#000000",
        icon: <StarIcon sx={{ fontSize: "14px" }} />,
        text: "PREMIUM",
      };
    case "trusted":
      return {
        bg: "#4b0082",
        color: "#ffffff",
        icon: <VerifiedUserIcon sx={{ fontSize: "14px" }} />,
        text: "TRUSTED",
      };
    case "partner":
    default:
      return {
        bg: "#2e7d32",
        color: "#ffffff",
        icon: <HandshakeIcon sx={{ fontSize: "14px" }} />,
        text: "PARTNER",
      };
  }
};

// Trading Card Component
const TradingCard = ({
  name,
  profitSplit,
  account,
  code,
  onCopyCode,
  logo,
  firmType = "partner",
  buyUrl = "#",
  //badgeLabel,
}) => {
  const badgeStyles = getBadgeStyles(firmType);

  return (
    <StyledCard>
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

      <CardHeader>
        <CardLogo src={logo} alt={`${name} logo`} />
        <Typography
          variant="h5"
          sx={{ fontSize: "20px", fontWeight: "700", color: "#333333" }}
        >
          {name}
        </Typography>
      </CardHeader>

      <CardBody>
        <ProfitSplit>
          <ProfitText>{profitSplit}% Profit Split</ProfitText>
          <UptoText>| Upto</UptoText>
        </ProfitSplit>

        <AccountValue>${account} Account</AccountValue>

        <CodeSection>
          <CodeLabel>Discount:</CodeLabel>
          <CodeContainer
            onClick={() => onCopyCode(code)}
            title="Click to copy code"
          >
            <CodeValue>{code}</CodeValue>
            <CopyIcon />
          </CodeContainer>
        </CodeSection>
      </CardBody>

      <CardFooter>
        <FundButton component='a' href={buyUrl} target="blank" variant="contained" size="large">
          Get Funded
        </FundButton>
      </CardFooter>
    </StyledCard>
  );
};

// Main Component - Rest of the code remains the same...
const TradingCards = () => {
  const allFirms = useSelector((st)=>st.firms.content);
  const [firmDetails, setFirmDetails] = useState(allFirms);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.down("xl"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("xl"));

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: isMobile
      ? 1
      : isTablet
      ? 2
      : isDesktop
      ? 3
      : isLargeDesktop
      ? 4
      : 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    pauseOnHover: true,
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
          Partner Firms
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
          Hand-Picked offers updated daily, compare, click and get funded.
          Choose from our exclusive selection of funded account options.
        </Typography>
      </Box>
      <CarouselContainer>
        <SliderContainer>
          <Slider {...settings}>
            {firmDetails?.map((card, index) => (
              <Box key={index} sx={{ padding: "10px" }}>
                <TradingCard
                  name={card?.name}
                  profitSplit={card?.tradingConditions.profitSplitPct}
                  account={foreignNumberSystem(card?.tradingConditions.maximumAccountSizeUsd)}
                  code={card?.tradingConditions.discountCode}
                  logo={card?.logo}
                  firmType={card?.firmType}
                  buyUrl={card?.buyUrl}
                  onCopyCode={handleCopyCode}
                />
              </Box>
            ))}
          </Slider>
        </SliderContainer>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Code <strong>{copiedCode}</strong> copied to clipboard!
          </Alert>
        </Snackbar>
      </CarouselContainer>
    </>
  );
};

export default TradingCards;
