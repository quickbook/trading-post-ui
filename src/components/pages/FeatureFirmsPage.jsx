import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { LoadingScreen } from "./HomePage";
import { MainContext } from "../../App";
import PromotionalCardsSection from "../sections/PromotionalCardsSection";

const FeatureFirmsPage = () => {
  // Access context
  const { handleOpenForm, isLoading, setIsLoading } = useContext(MainContext);
  // Add loading state

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loading for 1 second

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Box sx={{width:'100%'}}>
      <PromotionalCardsSection />
      <Card
        sx={{
          width: "100%",
          maxWidth: 814,
          mx: "auto",
          bgcolor: "rgba(255,255,255,0.12)",
          borderRadius: "10px",
          overflow: "hidden",
          padding: { xs: 2, md: 4 },
          my: { xs: 1, md: 6 },
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid #cecece",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 6,
            gap: 4,
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontFamily: "Montserrat, Helvetica",
              fontWeight: "bold",
              color: "white",
              lineHeight: "2.25rem",
            }}
          >
            Build Your Own Prop Firm...
          </Typography>

          {/* Description */}
          <Typography
            align="center"
            sx={{
              fontFamily: "Lora , Helvetica",
              fontWeight: 400,
              fontSize: "1rem",
              lineHeight: "1.2rem",
              maxWidth: 814,
              color: "#cecece",
              mb: 4,
            }}
          >
            Learn how to turn your vision into a successful prop firm. We offer
            insights and demonstrate how Propriotec&apos;s technology solutions
            manage the complexities, letting you concentrate on business
            growth...
          </Typography>

          {/* Powered by section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Montserrat, Helvetica",
                fontWeight: "bold",
                color: "#cac4d0",
                fontSize: "0.875rem",
              }}
            >
              Powered by
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 1,
                borderRadius: "50px",
                backgroundColor: "#ffffff90",
                "&:hover": { backgroundColor: "#ffffffd4" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
                pr: 3,
              }}
            >
              <Box
                component="img"
                src="/tp-logo2.png"
                alt="Image"
                sx={{
                  height: { xs: "36px", md: "40px", lg: "52px" },
                  borderRadius: "50%",
                  padding: "2px",
                  border: "0.5px solid #4b0082",
                  objectFit: "cover",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "montserrat, Helvetica",
                  //fontFamily: "sans-serif",
                  fontWeight: 800,
                  color: "#4B0082",
                  //WebkitTextStroke: "0.3px #FFD700",
                  fontSize: { xs: "20px", md: "24px" },
                  letterSpacing: "0.15px",
                  lineHeight: "24px",
                  textTransform: "uppercase",
                  userSelect: "none",
                  cursor: "pointer",
                }}
              >
                Trading Post
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Box
        component="section"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 8,
        }}
      >
        {/* Text */}
        <Typography
          sx={{
            maxWidth: 748,
            textAlign: "center",
            fontFamily: "Lora, Helvetica",
            fontWeight: 400,
            fontSize: "1rem",
            color: "#cecece",
            lineHeight: "1.5rem",
            letterSpacing: "0.15px",
            mb: 4,
          }}
        >
          Trusted by founders, Trading Post&apos;s solutions have powered the
          launch and growth of various trading firms.
        </Typography>

        {/* CTA Button */}
        <Button
          variant="outlined"
          onClick={() => {
            handleOpenForm(true);
          }}
          sx={{
            backgroundColor: "#cac4d0",
            "&:hover": { backgroundColor: "#b8b2be" },
            color: "#4b0082",
            border: "2px solid #ffd700",
            borderRadius: "20px",
            height: "51px",
            px: 6,
            fontFamily: "Montserrat, Helvetica",
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: "1.5rem",
            letterSpacing: "0.15px",
            textTransform: "none",
          }}
        >
          Book a Call
        </Button>
      </Box>
    </Box>
  );
};

export default FeatureFirmsPage;
