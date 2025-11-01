import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ContentInfoSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        p: {xs: 1, md:3},
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          //maxWidth: 1167,
          height: { xs: 350, md: 471 },
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #cecece",
          background:
            "linear-gradient(240deg, rgba(0,0,0,1) 21%, rgba(195,166,10,1) 36%, rgba(255,215,0,1) 48%, rgba(75,0,130,1) 64%, rgba(12, 1, 29, 1) 75%, rgba(0,0,0,1) 80%)",
        }}
      >
        {/* Character with treasure chest */}
        <Box
          component="img"
          src="/chest.png"
          alt="Character with treasure chest"
          sx={{
            width: { xs: 120, md: 150 },
            height: { xs: 104, md: 150 },
            position: "absolute",
            bottom: 0,
            left: 0,
            objectFit: "cover",
          }}
        />

        {/* Character with sword */}
        <Box
          component="img"
          src="/soldier.png"
          alt="Character with sword"
          sx={{
            width: { xs: 71, md: 119 },
            height: { xs: 152, md: 255 },
            position: "absolute",
            top: 0,
            right: 0,
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 770,
            px: 2,
          }}
        >
          <Card
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.45)",
              border: "none",
              backdropFilter: "blur(4px)",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 3, md: 4 },
                textAlign: "center",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Montserrat', Helvetica, Arial, sans-serif",
                  fontWeight: "bold",
                  color: "black",
                  fontSize: { xs: 24, md: 32 },
                  lineHeight: 1,
                  mb: 3,
                  textShadow: "0px 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                The Hub for all things Trading
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Lora', Helvetica, serif",
                  fontWeight: "normal",
                  color: "#2c2c2c",
                  fontSize: { xs: 14, md: 16 },
                  lineHeight: 1.4,
                  mb: 3,
                  maxWidth: 629,
                  mx: "auto",
                  textShadow: "0px 1px 1px rgba(255,255,255,0.3)",
                }}
              >
                Get the best deals from all of your favourite prop firms, win
                giveaways and prizes playing games in our community, journal
                your trades with our journaling software.
              </Typography>

              <Button
                variant="contained"
                onClick={()=>navigate('/comparefirms')}
                sx={{
                  backgroundColor: "black",
                  color: "#cecece",
                  border: "1px solid",
                  borderColor: "neutral.100",
                  borderRadius: "7.58px",
                  px: 3,
                  py: 1.5,
                  fontFamily: "'Lora', Helvetica, serif",
                  fontWeight: "normal",
                  fontSize: { xs: 14, md: 15.2 },
                  lineHeight: 1,
                  "&:hover": {
                    backgroundColor: "grey.800",
                  },
                }}
              >
                Trade Now
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ContentInfoSection;
