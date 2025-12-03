import React, { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { initApp } from "./redux/initApp";
import { selectFirms } from "./features/firms/firmsSelectors";
import HomePage from "./components/pages/HomePage";
import HeroSection from "./components/sections/HeroSection";
import FooterSection from "./components/sections/FooterSection";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CompareFirmsPage from "./components/pages/CompareFirmsPage";
import { styled } from "@mui/material/styles";
import { Alert, Box, Fab, Snackbar, Zoom } from "@mui/material";
import FeatureFirmsPage from "./components/pages/FeatureFirmsPage";
import BookACallSection from "./components/sections/BookACallSection";
import ReviewsPage from "./components/pages/ReviewsPage";
import { PropFirmDetailsPage } from "./components/pages/PropFirmDetailsPage";
import ErrorPage from "./components/pages/ErrorPage";
import AdminPage from "./components/pages/AdminPage";
import LoginPage from "./components/pages/LoginPage";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RegisterPage from "./components/pages/RegisterPage";
import { initializeAuth } from "./api/axiosClient";
import { selectAccessToken } from "./features/auth/authSlice";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import UserProfile from "./components/pages/UserProfile";
import {
  selectRole,
  selectUser,
  setUserFromStorage,
} from "./features/auth/loginSlice";
import ChallengesPage from "./components/pages/ChallengesPage";
import { fetchFirmsData } from "./features/firms/firmsSlice";

export const MainContext = createContext();

const StyledContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "100vh",
  alignItems: "center",
  paddingTop: "90px",
  background:
    "linear-gradient(270deg, rgba(0,0,0,0.9) 0%, rgba(75,0,130,0.9) 50%, rgba(0,0,0,0.9) 100%)",
}));

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);
  const firmsData = useSelector(selectFirms);
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const [openForm, handleOpenForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const initCalled = useRef(false);
  const initToken = useRef(false);

  const downRef = useRef(null);
  const upRef = useRef(null);

  // Snackbar close
  const handleSnackbarClose = (_, reason) => {
    if (reason !== "clickaway") setSnackbarOpen(false);
  };

  // STEP 1 → Initialize auth (run once)
  useEffect(() => {
    if (!initCalled.current) {
      initializeAuth();
      initCalled.current = true;
    }

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      dispatch(setUserFromStorage(JSON.parse(storedUser)));
    }
  }, []);

  useEffect(() => {
    if (!initToken.current) {
      initToken.current = true;
      dispatch(initApp());
    }
  }, []);

  // Scroll logic
  useEffect(() => {
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

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToBottom = () =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });

  return (
    <BrowserRouter>
      <MainContext.Provider
        value={{
          isLoading,
          setIsLoading,
          setSnackbarOpen,
          setSnackbarMessage,
          setSnackbarSeverity,
          openForm,
          handleOpenForm,
        }}
      >
        <StyledContainer>
          <HeroSection />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/comparefirms" element={<CompareFirmsPage />} />
            <Route
              path="/comparefirms/challenges"
              element={<ChallengesPage />}
            />
            <Route path="/featurefirms" element={<FeatureFirmsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/propfirm/:id" element={<PropFirmDetailsPage />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={!user?.id ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route
              path="/register"
              element={!user?.id ? <RegisterPage /> : <Navigate to="/" />}
            />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                user && (role === "ADMIN" || role === "USER" || role === "ROOT") ? (
                  <UserProfile />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/admin"
              element={
                user && (role === "ADMIN" || role === "ROOT" )? <AdminPage /> : <Navigate to="/" />
                //<AdminPage />
              }
            />

            <Route path="*" element={<ErrorPage />} />
          </Routes>

          <FooterSection />
          <BookACallSection />

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity={snackbarSeverity}
              onClose={handleSnackbarClose}
              variant="filled"
              sx={{ width: "50vw" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Scroll Down Button */}
          <Zoom in>
            <Fab
              color="secondary"
              ref={downRef}
              onClick={scrollToBottom}
              size="medium"
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

          {/* Scroll Up Button */}
          <Zoom in>
            <Fab
              color="secondary"
              ref={upRef}
              onClick={scrollToTop}
              size="medium"
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
