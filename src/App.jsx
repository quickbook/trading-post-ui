import React, { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { initApp } from "./redux/initApp";
import {
  selectFirms,
  selectFirmsStatus,
  selectFirmsError,
} from "./features/firms/firmsSelectors";
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
import LoginPage from "./components/pages/LoginPage";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RegisterPage from "./components/pages/RegisterPage";
import { initializeAuth } from "./api/axiosClient";
import { selectAccessToken } from "./features/auth/authSlice";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import UserProfile from "./components/pages/UserProfile";
import { selectRole, selectUser, setUserFromStorage } from "./features/auth/loginSlice";

export const MainContext = createContext();

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);
  const firmsData = useSelector(selectFirms);
  const status = useSelector(selectFirmsStatus);
  const error = useSelector(selectFirmsError);
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const [isLoading, setIsLoading] = useState(true);
  const [firmData, setFirmData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const downRef = useRef(null);
  const upRef = useRef(null);
  const hasInitialFetch = useRef(false);
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
  //console.log(token)
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
    initializeAuth();
  }, []);

  useEffect(() => {
    // Run only once on first mount
    dispatch(initApp());
  }, [dispatch]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      dispatch(setUserFromStorage(JSON.parse(user)));
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize once
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading for 1 second

    return () => clearTimeout(timer);
  });

  const StyledContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
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
          isLoading,
          setIsLoading,
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
            <Route
              path="/comparefirms/challenges"
              element={<PropFirmsChallenges />}
            />
            <Route path="/featurefirms" element={<FeatureFirmsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/propfirm/:id" element={<PropFirmDetailsPage />} />
            <Route
              path="/login"
              element={!(user && user.id) ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route
              path="/register"
              element={
                !(user && user.id) ? <RegisterPage /> : <Navigate to="/" />
              }
            />
            <Route
              path="/profile"
              element={
                user && (role == "ADMIN" || role == "USER") ? (
                  <UserProfile />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin"
              element={
                user && role == "ADMIN" ? <AdminPage /> : <Navigate to="/" />
              }
            />

            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <FooterSection />
          <BookACallSection />
          {/* Alert Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
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
