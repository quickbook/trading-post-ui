import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Button,
  CardMedia,
} from "@mui/material";
import { cardData } from "/CardsData";
import { useNavigate } from "react-router-dom";

// Card Component
const TradingCard = ({ id, name, logo, firmPageURL = "#" }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: { xs: 140, sm: 180 },
        py: { xs: 2, md: 0 },
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <Box
        onClick={() => navigate(`/propfirm/${id}`)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: { xs: 100, md: 180 },
          height: { xs: 100, md: 140 },
          //minHeight: 100,
          //backgroundColor: "#000000b5",
          background:
            "linear-gradient(to top, #3b3b3bff 10%, #1d1d1dd7 40%, #000 80%)",
          borderRadius: "29.95px",
          p: { xs: 1, md: 3 },
          mb: { xs: 1, md: 3 },
          objectFit: "contain",
        }}
      >
        <Box
          component={"img"}
          sx={{
            height: { xs: 60, md: 90 },
            //borderRadius: "20px",
            backgroundColor: "white", // Added for better logo visibility
          }}
          src={logo}
          alt={name}
        />
      </Box>

      {/* Buy now button */}
      <Button
        href={firmPageURL}
        target={"blank"}
        variant="contained"
        sx={{
          backgroundColor: "#000000b5",
          borderRadius: "12px",
          px: { xs: 2, md: 5 },
          py: 1,
          border: "2px solid #fff",
          textTransform: "capitalize",
          fontFamily: "Lora",
          fontWeight: 600,
          fontSize: { xs: "14px", md: "16px" },
          "&:hover": {
            backgroundColor: "#4b0082",
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Buy Now
      </Button>
    </Box>
  );
};

export const TrustedFirms = () => {
  const [firmDetails, setFirmDetails] = useState([]);
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/comparefirms");
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const trustedFirms = cardData.filter(
      (e) => e.firmType == "premium" || e.firmType == "trusted"
    );

    setFirmDetails(trustedFirms);
  }, []);

  return (
    <>
      {/* Header Section */}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            textAlign: { xs: "center", md: "left" },
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
            }}
          >
            Trusted Firms
          </Typography>

          <Typography
            sx={{
              fontFamily: "Lora, Helvetica",
              fontWeight: 400,
              color: "white",
              fontSize: { xs: "14px", md: "16px" },
              lineHeight: "20px",
              maxWidth: "650px",
            }}
          >
            Verified and trusted brands our traders use. Click to buy now.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleViewAll}
          sx={{
            backgroundColor: "#4b0082",
            borderRadius: "12px",
            px: { xs: 2, md: 5 },
            py: 1,
            border: "2px solid #fff",
            textTransform: "capitalize",
            fontFamily: "Lora",
            fontWeight: 600,
            fontSize: { xs: "14px", md: "16px" },
            "&:hover": {
              backgroundColor: "#5a1a8c",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
            minWidth: { xs: "120px", md: "auto" },
          }}
        >
          View all
        </Button>
      </Box>

      {/* Cards Grid Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#00000099",
          py: { xs: 1, md: 4 },
          px: { xs: 1, md: 6 },
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent={"flex-start"}
          alignItems="center"
          //sx={{ maxWidth: "1120px", margin: "0 auto" }}
        >
          {firmDetails.map((card, index) => (
            <Grid
              size={{
                xs: 6, // 2 cards per row on mobile
                sm: 4, // 3 cards per row on small screens
                md: 3, // 4 cards per row on medium screens
                lg: 2, // 6 cards per row on large screens
                xl: 2, // 6 cards per row on extra large screens
              }}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TradingCard
                id={card.id}
                name={card.name}
                logo={card.logo}
                firmPageURL={card.firmPageURL}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default TrustedFirms;
