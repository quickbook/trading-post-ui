import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import PropFirmsChallenges from "../sections/PropFirmsChallenges";

const ChallengesPage = () => {
    const navigate = useNavigate();

  return <Container maxWidth="lg" sx={{ py: 2 }}>
    <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {/* Header */}
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          mb: 4,
          bgcolor: "rgba(255,255,255,0.12)",
          p: 3,
          borderRadius: 2,
          border: "1px solid #cecece",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 2,
            color: "#ffffff",
          }}
        >
          Trading Post Challenges
        </Typography>

        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            mb: 2,
            maxWidth: "600px",
            mx: "auto",
            color: "#cecece",
          }}
        >
          Find the perfect prop firm challenge that matches your trading style
          and goals
        </Typography>
      </Box>
      <PropFirmsChallenges />
  </Container>;
};

export default ChallengesPage;
