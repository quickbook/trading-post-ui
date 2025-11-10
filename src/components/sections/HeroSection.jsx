import React, { use, useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Link,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  Drawer,
  List,
  ListItemText,
  ListItem,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import CallIcon from "@mui/icons-material/Call";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { SocialLinks } from "./TradingPostBanner";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SocialMediaMenu from "./SocialMediaMenu";
import { MainContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser, selectRole } from "../../features/auth/loginSlice";

const AdminMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const {
    adminLoggedIn,
    setAdminLoggedIn,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
  } = useContext(MainContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate("/login");
    handleMenuClose();
  };
  const handleRegister = () => {
    navigate("/register");
    handleMenuClose();
  };

  const handleLogout = async () => {
    await dispatch(logout());
    setAdminLoggedIn(false);
    navigate("/login");
    handleMenuClose();
  };

  const handleAdminOption = () => {
    setSnackbarMessage("Redirecting to Admin Dashboard...");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    navigate("/admin");
    handleMenuClose();
  };

  return (
    <>
      {/* Admin Icon */}
      <IconButton
        color="inherit"
        onClick={handleMenuOpen}
        title="Admin"
        sx={{
          backgroundColor: "#f5f5f5",
          //border: "1px solid #4b0082",
          padding: adminLoggedIn ? "4px" : 1,
          "&:hover": { bgcolor: "#bb9df1ff", opacity: 0.7 },
        }}
      >
        {adminLoggedIn ? (
          <Avatar
          title={user?.name|| 'A'}
            sx={{ bgcolor: "#4b0082", fontSize: 18, width: 32, height: 32 }}
          >
            {user?.name.charAt(0).toUppercase() || 'A'}
          </Avatar>
        ) : (
          <AccountCircleIcon sx={{ color: "#4b0082", fontSize: 32 }} />
        )}
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {role === "ADMIN" ? (
          <div>
            <MenuItem
              sx={{ "&:hover": { color: "#fff", bgcolor: "#4b0082" } }}
              onClick={handleAdminOption}
            >
              Admin Dashboard
            </MenuItem>
            <Divider />
            <MenuItem
              sx={{ "&:hover": { color: "#fff", bgcolor: "#4b0082" } }}
              onClick={handleLogout}
            >
              Logout
            </MenuItem>
          </div>
        ) : role === "USER" ? (
          <MenuItem
            sx={{ "&:hover": { color: "#fff", bgcolor: "#4b0082" } }}
            onClick={handleLogout}
          >
            Logout
          </MenuItem>
        ) : (
          <div>
            <MenuItem
              sx={{ "&:hover": { color: "#fff", bgcolor: "#4b0082" } }}
              onClick={handleLogin}
            >
              Login
            </MenuItem>
            <Divider />
            <MenuItem
              sx={{ "&:hover": { color: "#fff", bgcolor: "#4b0082" } }}
              onClick={handleRegister}
            >
              Register
            </MenuItem>
          </div>
        )}
      </Menu>
    </>
  );
};

const HeroSection = () => {
  const { handleOpenForm, setIsLoading } = useContext(MainContext);
  const location = window.location.pathname;
  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Our Reviews", href: "/reviews" },
    { label: "Compare Firms", href: "/comparefirms" },
    { label: "Featured Firms", href: "/featurefirms" },
  ];

  const currentLoc = navigationItems.find((loc) => loc.href === location);

  const [activeItem, setActiveItem] = useState(currentLoc?.label || "Home");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (label) => {
    setActiveItem(label);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };
  useEffect(() => {
    const currentLoc = navigationItems.find((loc) => loc.href === location);
    setActiveItem(currentLoc?.label || "Home");
  }, [location]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: { xs: "12px 8px", md: "10px 24px" },
        // background: "rgba(0, 0, 0, 1)",
        background: "#fff",
        borderTop: "1px solid #000",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1300,
      }}
    >
      {/* Logo and Text */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          //gap: 1,
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveItem("Home");
        }}
      >
        <Box
          component="img"
          src="/tp-logo2.png"
          alt="Image"
          sx={{
            height: { xs: "48px", md: "60px" },
            borderRadius: "50%",
            //padding: "2px",
            border: "2px solid #4b0082",
            objectFit: "cover",
          }}
        />
        {/* <Box
          component="img"
          src="/tp-name2.png"
          alt="Image"
          sx={{
            height: { xs: "54px", md: "72px" },
            objectFit: "cover",
          }}
        /> */}
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            ml: 1,
            fontFamily: "montserrat, Helvetica",
            fontWeight: 800,
            color: "#4b0082",
            WebkitTextStroke: "0.3px #000",
            fontSize: "24px",
            letterSpacing: "0.15px",
            //fontStyle: "italic",
            lineHeight: "24px",
            textTransform: "uppercase",
            userSelect: "none",
            cursor: "pointer",
          }}
        >
          Trading Post
          {/* <p>Trading </p><p> Post</p> */}
        </Typography>
      </Box>

      {/* Navigation Links */}
      <Box
        component="nav"
        sx={{
          position: "relative",
          display: { xs: "none", md: "flex" },
          flexWrap: "wrap",
          width: 680,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {navigationItems.map((item, index) => {
          const isActive = item.label === activeItem && location === item.href;
          return isActive ? (
            <Button
              key={index}
              component={RouterLink}
              to={item.href}
              onClick={() => handleNavClick(item.label)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                padding: 1.4,
                flexShrink: 0,
                bgcolor: "#4b0082",
                borderRadius: "8px",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <Typography
                sx={{
                  //fontFamily: "Lora, Helvetica",
                  fontWeight: "normal",
                  color: "#fff",
                  fontSize: "16px",
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                }}
              >
                {item.label}
              </Typography>
            </Button>
          ) : (
            <Button
              key={index}
              component={RouterLink}
              to={item.href}
              onClick={() => handleNavClick(item.label)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: 1.4,
                flexShrink: 0,
                borderRadius: "8px",
                height: "auto",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "#4b008220",
                },
              }}
            >
              <Typography
                sx={{
                  //fontFamily: "'Lora', Helvetica",
                  fontWeight: "normal",
                  color: "#4b0082",
                  fontSize: "16px",
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                }}
              >
                {item.label}
              </Typography>
            </Button>
          );
        })}
        <SocialMediaMenu />
      </Box>

      {/* Call Button */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          //width: 150,
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            handleOpenForm(true);
          }}
          sx={{
            p: 1.5,
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #4b0082",
            textTransform: "inherit",
            fontFamily: "'Lora', Helvetica",
            fontWeight: "bold",
            fontSize: "16px",
            lineHeight: "16px",
            whiteSpace: "nowrap",
            bgcolor: "#4b008220",
            color: "#4b0082",
            "&:hover": {
              bgcolor: "#4b008240",
              color: "#000",
            },
          }}
        >
          Book a Call
        </Button>
        <AdminMenu />
      </Box>

      {/* Menu for Mobile view */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          //width: 150,
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 3,
        }}
      >
        <IconButton
          sx={{
            border: "1px solid #cecece",
            backgroundColor: "#000",
            "&:hover": { bgcolor: "#000", opacity: 0.8 },
            p: 1,
          }}
          onClick={toggleDrawer(true)}
        >
          <Box
            component="img"
            src="/crown.png"
            alt="Menu Icon"
            sx={{
              height: "24px",
              width: "28px",
              objectFit: "cover",
            }}
          />
        </IconButton>
      </Box>
      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            top: "60px", // Adjusting to open from bottom of header
            height: "auto",
            borderTop: "4px solid #0082cf",
          },
        }}
      >
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: "#ffffff",
            padding: "20px",
            backgroundColor: "#000",
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ borderBottom: "4px solid #364253" }}>
            {navigationItems.map((page, i) => (
              <Box key={page.label} sx={{ width: "100%" }}>
                <ListItem
                  //button={true}
                  key={"list" + i}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    navigate(page.href);
                    setOpen(false);
                  }}
                  sx={{
                    color: "#fff",
                    backgroundColor: "#4b0082",
                    borderRadius: "4px",
                    marginBottom: "2px",
                  }}
                >
                  <ListItemText
                    key={page.label + "name"}
                    primary={page.label}
                  />
                </ListItem>
              </Box>
            ))}
            <Box sx={{ my: 2 }}>
              <Typography
                sx={{
                  fontFamily: "'Lora', Helvetica",
                  fontWeight: "normal",
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                  color: "#fff",
                  textAlign: "center",
                  mb: 2,
                }}
              >
                Join Us
              </Typography>
              <SocialLinks />
            </Box>
          </List>
          <Box
            sx={{
              py: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                handleOpenForm(true);
              }}
              slotprops={{}}
              sx={{
                p: 1.5,
                bgcolor: "black",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #cecece",
                textTransform: "capitalize",
                color: "#cecece",
                fontFamily: "'Lora', Helvetica",
                fontWeight: "bold",
                fontSize: "16px",
                lineHeight: "16px",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#cecece",
                  color: "#4B0082",
                },
              }}
              endIcon={<CallIcon />}
            >
              Book a Call
            </Button>
          </Box>
        </motion.div>
      </Drawer>
    </AppBar>
  );
};

export default HeroSection;
