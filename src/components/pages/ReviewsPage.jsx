import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Reviews from "../sections/Reviews";
import { LoadingScreen } from "./HomePage";

const ReviewsPage = () => {
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

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
    <Box
      sx={{
        width: "100%",
        mb: 6,
      }}
    >
      <Reviews />
    </Box>
  );
};

export default ReviewsPage;
