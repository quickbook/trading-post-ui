import React from "react";
import { Card, Button, Typography, Box, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import { useNavigate } from "react-router-dom";

// ✅ Social Media Links Component
export const SocialLinks = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
        pl: { xs: 0, md: 1 },
      }}
    >
      <IconButton
        sx={{
          backgroundColor: "#ffdc00",
          "&:hover": { bgcolor: "#fff", opacity: 0.8 },
        }}
      >
        <InstagramIcon sx={{ color: "#000" }} />
      </IconButton>
      <IconButton
        sx={{
          backgroundColor: "#ffdc00",
          "&:hover": { bgcolor: "#fff", opacity: 0.8 },
        }}
      >
        <FacebookIcon sx={{ color: "#000" }} />
      </IconButton>
      <IconButton
        sx={{
          backgroundColor: "#ffdc00",
          "&:hover": { bgcolor: "#fff", opacity: 0.8 },
          p: 1,
        }}
      >
        <Box
          component="img"
          src="/discord-logo.png" // <-- Replace with your Discord logo path
          alt="Discord"
          sx={{ height: 24, width: 24 }}
        />
      </IconButton>
      <IconButton
        sx={{
          backgroundColor: "#ffdc00",
          "&:hover": { bgcolor: "#fff", opacity: 0.8 },
        }}
      >
        <XIcon sx={{ color: "#000" }} />
      </IconButton>
    </Box>
  );
};

// ✅ Trading Post Banner Component
const TradingPostBanner = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "98%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#000",
        //mt: '4px',
        mb: 1,
        borderRadius: "14px",
        p: { xs: 0, md: 2 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "20px",
          textAlign: "center",
          overflow: "hidden",
          position: "relative",
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Heading */}
        <Typography
          variant="h3"
          fontFamily={"montserrat"}
          fontWeight="bold"
          sx={{
            textTransform: "uppercase",
            mb: 3,
            fontStyle: "italic",
            fontSize: { xs: "1.6rem", md: "2.5rem", lg: "3rem" },
            lineHeight: 1.2,
          }}
        >
          Gateway to Kingdom Riches <br /> with Every Challenge.
        </Typography>

        {/* CTA Button */}
        <Button
          variant="contained"
          onClick={()=>navigate('/comparefirms')}
          sx={{
            backgroundColor: "#4b0082",
            borderRadius: "12px",
            px: { xs: 2, md: 5 },
            //py: 1,
            mb: { xs: 3, md: 4 },
            mt: { xs: 1, md: 11 },
            border: "2px solid #fff",
            textTransform: "capitalize",
            fontFamily: "Lora",
            fontWeight: 600,
            fontSize: { xs: "14px", md: "18px" },
            "&:hover": {
              backgroundColor: "#5a1a8c",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease-in-out",
            minWidth: { xs: "120px", md: "auto" },
          }}
        >
          Trade Now
        </Button>

        {/* Characters (Responsive King & Queen images) */}
        <Box
          sx={{
            display: { xs: "flex", md: "flex" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 0, md: 0 },
            mt: { xs: -3, md: -20, xl: -28 },
          }}
        >
          <Box
            component="img"
            src="/king.png"
            alt="King"
            sx={{
              height: { xs: 130, md: 280, lg: 320, xl: 380 },
              maxWidth: "100%",
            }}
          />
          <Box
            component="img"
            src="/queen.png"
            alt="Queen"
            sx={{
              height: { xs: 130, md: 280, lg: 320, xl: 380 },
              maxWidth: "100%",
            }}
          />
        </Box>

        {/* Social Media Icons */}
        <Box sx={{ mt: { xs: 2, md: -6 }, mb: { xs: 2, md: 3 } }}>
          <SocialLinks />
        </Box>
      </Card>
    </Box>
  );
};

export default TradingPostBanner;
