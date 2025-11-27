import React, { useContext, useEffect, useState } from "react";
import TradingCards from "../sections/TradingCards";
import PromotionalCardsSection from "../sections/PromotionalCardsSection";
import ContentInfoSection from "../sections/ContentInfoSection";
import TradingPostBanner from "../sections/TradingPostBanner";
import TrustedFirms from "../sections/TrustedFirms";
import { Box, Typography } from "@mui/material";
import { MainContext } from "../../App";
import { useSelector } from "react-redux";
import {
  selectFirms,
  selectFirmsStatus,
} from "../../features/firms/firmsSelectors";

export const LoadingScreen = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
      gap: 3,
    }}
  >
    <Box
      sx={{
        width: 60,
        height: 60,
        border: "4px solid #4b0082",
        borderTop: "4px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        "@keyframes spin": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      }}
    />
    <Typography
      variant="h6"
      sx={{
        color: "white",
        fontFamily: "Montserrat, Helvetica",
        fontWeight: "medium",
      }}
    >
      Loading ...
    </Typography>
  </Box>
);

const HomePage = () => {
  const firmsStatus = useSelector(selectFirmsStatus);
  const firmsData = useSelector(selectFirms);
  // Add loading state
  const { isLoading, setIsLoading } = useContext(MainContext);

  // Simulate loading effect
  useEffect(() => {
    if (firmsStatus === "loading") {
      setIsLoading(true);
    } else if (firmsStatus === "succeeded" && firmsData.length) {
      setIsLoading(false);
    } else if (firmsStatus === "failed") {
      setIsLoading(true);
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Show loading for 1 second

    return () => clearTimeout(timer);
  }, [firmsStatus]);

  return isLoading ? (
    <LoadingScreen />
  ) : firmsStatus === "failed" ? (
    <Box
      component={"h2"}
      sx={{
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#ff3737ff",
      }}
    >
      {" "}
      Unable to fetch firms data
    </Box>
  ) : (
    <>
      <TradingPostBanner />
      <TradingCards />
      <PromotionalCardsSection length={6} />
      <TrustedFirms />
      <ContentInfoSection />
    </>
  );
};

export default HomePage;
