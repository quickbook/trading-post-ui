import React, { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import HomePage from "./components/pages/HomePage";
import HeroSection from "./components/sections/HeroSection";
import FooterSection from "./components/sections/FooterSection";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import CompareFirmsPage from "./components/pages/CompareFirmsPage";
import { styled } from "@mui/material/styles";
import { Alert, Box, Fab, Snackbar, Zoom } from "@mui/material";
import FeatureFirmsPage from "./components/pages/FeatureFirmsPage";
import BookACallSection from "./components/sections/BookACallSection";
import ReviewsPage from "./components/pages/ReviewsPage";
import { PropFirmDetailsPage } from "./components/pages/PropFirmDetailsPage";
import ErrorPage from "./components/pages/ErrorPage";
import PropFirmsChallenges from "./components/sections/PropFirmsChallenges";
import AdminPage from "./components/pages/AdminPage";
import AdminLoginPage from "./components/pages/AdminLoginPage";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdminRegisterPage from "./components/pages/AdminRegisterPage";

export const MainContext = createContext();

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const downRef = useRef(null);
  const upRef = useRef(null);
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenForm = (action) => {
    setOpenForm(action);
  };

  // Handle scroll behavior
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (downRef.current && upRef.current) {
      if (scrollTop < 300) {
        downRef.current.style.display = "flex";
        upRef.current.style.display = "none";
      } else if (windowHeight + scrollTop >= fullHeight - 150) {
        downRef.current.style.display = "none";
        upRef.current.style.display = "flex";
      } else {
        downRef.current.style.display = "none";
        upRef.current.style.display = "none";
      }
    }
  };

  // Scroll actions
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize once
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const StyledContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    paddingTop: "90px",
    background:
      "linear-gradient(270deg, rgba(0,0,0,0.9) 0%, rgba(75,0,130,0.9) 50%, rgba(0,0,0,0.9) 100%)",
  }));

  return (
    <BrowserRouter>
      <MainContext.Provider
        value={{
          openForm,
          setOpenForm,
          handleOpenForm,
          adminLoggedIn,
          setAdminLoggedIn,
          setSnackbarOpen,
          setSnackbarMessage,
          setSnackbarSeverity,
        }}
      >
        <StyledContainer>
          <HeroSection />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/comparefirms" element={<CompareFirmsPage />} />
            {/* <Route path="/comparefirms/challenges" element={<ChallengesTab />} /> */}
            <Route
              path="/comparefirms/challenges"
              element={<PropFirmsChallenges />}
            />
            <Route path="/featurefirms" element={<FeatureFirmsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/propfirm/:id" element={<PropFirmDetailsPage />} />
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/register" element={<AdminRegisterPage />} />
            <Route
              path="/admin"
              element={adminLoggedIn ? <AdminPage /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <FooterSection />
          <BookACallSection />
          {/* Login Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity} // 'success' or 'error'
              variant="filled"
              sx={{ width: "50vw" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
          {/* Scroll Button */}
          <Zoom in>
            <Fab
              color="secondary"
              size="medium"
              ref={downRef}
              onClick={scrollToBottom}
              sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 1000,
                display: "none",
              }}
            >
              <KeyboardArrowDownIcon sx={{ fontSize: "32px" }} />
            </Fab>
          </Zoom>

          <Zoom in>
            <Fab
              color="secondary"
              size="medium"
              ref={upRef}
              onClick={scrollToTop}
              sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 1000,
                display: "none",
              }}
            >
              <KeyboardArrowUpIcon sx={{ fontSize: "32px" }} />
            </Fab>
          </Zoom>
        </StyledContainer>
      </MainContext.Provider>
    </BrowserRouter>
  );
}

export default App;
