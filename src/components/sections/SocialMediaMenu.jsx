import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
} from "@mui/material";
import {
  ExpandMore,
  Instagram,
  Facebook,
  X,
  LinkedIn,
  YouTube,
  Reddit,
} from "@mui/icons-material";

const SocialMediaMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Social media data with colors and icons
  const socialPlatforms = [
    {
      name: "Instagram",
      icon: <Instagram />,
      color: "#E4405F",
      bgColor: "linear-gradient(45deg, #E4405F 0%, #405DE6 100%)",
      url: "https://www.instagram.com/", // Official site[citation:4]
    },
    {
      name: "Facebook",
      icon: <Facebook />,
      color: "#1877F2",
      bgColor: "#1877F2",
      url: "https://www.facebook.com/", // Official site[citation:2]
    },
    {
      name: "X (Twitter)",
      icon: <X />,
      color: "#000000",
      bgColor: "#000000",
      url: "https://x.com/", // Formerly twitter.com[citation:10]
    },
    {
      name: "Discord",
      icon: <X />, // You can keep a placeholder or find a Discord icon
      color: "#5865F2",
      bgColor: "#a0c4f3ff",
      url: "https://discord.com/", // Official site[citation:1]
    },
    {
      name: "LinkedIn",
      icon: <LinkedIn />,
      color: "#0A66C2",
      bgColor: "#0A66C2",
      url: "https://www.linkedin.com/", // Official site[citation:3]
    },
    {
      name: "YouTube",
      icon: <YouTube />,
      color: "#FF0000",
      bgColor: "#FF0000",
      url: "https://www.youtube.com/", // Official site[citation:7]
    },
    {
      name: "Reddit",
      icon: <Reddit />,
      color: "#FF5700",
      bgColor: "#FF5700",
      url: "https://www.reddit.com/", // Official site[citation:8]
    },
  ];

  const handleSocialMediaClick = (platform) => {
    handleClose(); // Closes the menu
    if (platform.url) {
      window.open(platform.url, "_blank", "noopener,noreferrer"); // Opens the URL in a new tab
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="contained"
        onClick={handleClick}
        endIcon={<ExpandMore />}
        sx={{
          background: open ? "#4b008220" : "#fff",
          color: "#4b0082",
          borderRadius: "10px",
          //fontWeight: 500,
          //fontFamily: "Lora, serif",
          fontSize: { xs: "14px", xl: "16px" },
          textTransform: "none",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            //transform: "translateY(-2px)",
            boxShadow: "none",
            background: "#4b008220",
          },
        }}
      >
        Join Us
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              borderRadius: "16px",
              marginTop: "8px",
              minWidth: "200px",
              overflow: "visible",
              filter: "drop-shadow(0px 8px 24px rgba(0,0,0,0.15))",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {socialPlatforms.map((platform, index) => (
          <MenuItem
            key={platform.name}
            onClick={() => handleSocialMediaClick(platform)}
            sx={{
              padding: "12px 16px",
              margin: "0 8px",
              borderRadius: "12px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: `${platform.color}15`,
                transform: "translateX(4px)",
              },
              "&:not(:last-child)": {
                borderBottom: "1px solid #f0f0f0",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: platform.bgColor,
                  color: "white",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {platform.name === "Discord" ? (
                  <Box
                    component={"img"}
                    src="discord-logo.png"
                    width={35}
                    sx={{ color: "#fff" }}
                  />
                ) : (
                  platform.icon
                )}
              </Paper>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "600",
                  color: "#333",
                  flexGrow: 1,
                }}
              >
                {platform.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}

        {/* Footer section */}
        <Box
          sx={{
            padding: "12px 16px",
            borderTop: "1px solid #f0f0f0",
            backgroundColor: "#fafafa",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              textAlign: "center",
              display: "block",
              fontWeight: "500",
            }}
          >
            Stay connected with us!
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
};

export default SocialMediaMenu;
