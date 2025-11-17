import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SocialLinks } from "./TradingPostBanner";
import { Link, useNavigate } from "react-router-dom";
import { li } from "framer-motion/client";
import { color } from "framer-motion";

const FooterSection = () => {
  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Our Reviews", href: "/reviews" },
    { label: "Compare Firms", href: "/comparefirms" },
    { label: "Featured Firms", href: "/featurefirms" },
  ];
  const resourceLinks = ["Privacy Policy", "Terms of Service", "Cookies"];

  const navigate = useNavigate();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behaviour: "smooth" });
  };

  const handleNavigation = (href) => {
    navigate(href);
    scrollToTop();
  };

  return (
    <Box
      component="footer"
      sx={{
        //position: "relative",
        width: "100%",
        bgcolor: "black",
        py: 6,
        px: 2,
      }}
    >
      <Grid container mx="auto" spacing={6} justifyContent={"space-between"} sx={{width: '100%', maxWidth:'1640'}}>
        {/* Trading Post Logo and Socials */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              alt="Image"
              src="/tp-logo.png"
              sx={{
                width: 103,
                height: 106,
                borderRadius: "25px",
                border: "1px solid #ffd700",
                objectFit: "cover",
                mb: 3,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontFamily: "montserrat, Helvetica",
                fontWeight: 800,
                color: "#4e0285ff",
                //backgroundColor: "#ffffff16",
                fontSize: { xs: "24px", md: "28px", xl: "32px" },
                letterSpacing: "0.15px",
                lineHeight: "24px",
                textTransform: "uppercase",
                userSelect: "none",
                cursor: "pointer",
                borderRadius: "12px",
                mb: 2,
                p: 2,
              }}
            >
              Trading Post
            </Typography>
            <SocialLinks />
          </Box>
        </Grid>

        {/* Explore Links */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ pb: 1 }}>
              <Typography
                component="h3"
                variant="h6"
                sx={{
                  fontFamily: "'Inter', Helvetica",
                  fontWeight: "semibold",
                  color: "#cececeb2",
                  fontSize: "16px",
                  lineHeight: "22.4px",
                }}
              >
                Explore
              </Typography>
            </Box>
            <List
              sx={{
                p: 0,
                m: 0,
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
              }}
            >
              {navigationItems.map((link, index) => (
                <ListItem
                  key={index}
                  sx={{
                    p: 0,
                    height: 22,
                    display: "block",
                    cursor: "pointer",
                    "&:hover .MuiTypography-root": {
                      color: "#ffd700",
                    },
                    transition: "color 0.3s ease-in-out",
                  }}
                  onClick={() => handleNavigation(link.href)}
                >
                  {/* <Link to={link.href} onClick={scrollToTop}> */}
                  <Typography
                    sx={{
                      fontFamily: "'Inter', Helvetica",
                      fontWeight: "normal",
                      fontSize: "14px",
                      lineHeight: "22px",
                      color: "#cecece",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Typography>
                  {/* </Link> */}
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>

        {/* Resources Links */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ pb: 1 }}>
              <Typography
                component="h3"
                variant="h6"
                sx={{
                  fontFamily: "'Inter', Helvetica",
                  fontWeight: "semibold",
                  color: "#cececeb2",
                  fontSize: "16px",
                  lineHeight: "22.4px",
                }}
              >
                Resources
              </Typography>
            </Box>
            <List
              sx={{
                p: 0,
                m: 0,
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
              }}
            >
              {resourceLinks.map((link, index) => (
                <ListItem
                  key={index}
                  sx={{
                    p: 0,
                    height: 22,
                    display: "block",
                    cursor: "pointer",
                    "&:hover .MuiTypography-root": {
                      color: "#ffd700",
                    },
                    transition: "color 0.3s ease-in-out",
                  }}
                >
                  {/* <Link
                    href="#"
                    color="inherit"
                    underline="none"
                    sx={{ color: "white" }}
                    onClick={scrollToTop}
                  > */}
                  <Typography
                    sx={{
                      fontFamily: "'Inter', Helvetica",
                      fontWeight: "normal",
                      fontSize: "14px",
                      lineHeight: "22px",
                      color: "#cecece",
                    }}
                  >
                    {link}
                  </Typography>
                  {/* </Link> */}
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>

        {/* List Your Firm */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box
              component="img"
              alt="Image"
              src="/cassel.jpg"
              sx={{ width: 200, height: 160, objectFit: "cover" }}
            />
            <Button
              variant="contained"
              sx={{
                width: 180,
                height: "auto",
                background:
                  "linear-gradient(240deg, rgba(195,166,10,1) 0%, rgba(255,215,0,1) 18%, rgba(75,0,130,1) 40%, rgba(12, 1, 29, 1) 75%, rgba(0,0,0,1) 90%)",
                color: "#fff",
                border: "1px solid #ffd700",
                borderRadius: "8px",
                p: 1.5,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  bgcolor: "#4b0082",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Lora', Helvetica",
                  fontWeight: "normal",
                  fontSize: 14,
                  lineHeight: "16px",
                }}
              >
                List Your Firm
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FooterSection;
