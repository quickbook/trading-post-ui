import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../App";
import { LoadingScreen } from "./HomePage";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser, selectRole } from "../../features/auth/loginSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const {
    setAdminLoggedIn,
    setSnackbarMessage,
    setSnackbarOpen,
    setSnackbarSeverity,
    isLoading,
    setIsLoading,
  } = React.useContext(MainContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Password validation pattern
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    // email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)) {
      newErrors.email = "Email must be valid";
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8 to 12 letters, include at least one uppercase, lowercase, number & symbol";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      dispatch(login(formData))

      // Update context
      setAdminLoggedIn(true);

      // Snackbar success
      setSnackbarMessage("Login successful! Welcome back.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Redirect
      navigate("/");
    } catch (err) {
      console.error(err);
      setSnackbarMessage(err.message || "Login failed. Try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout helper (optional, can be used later)
  // const handleLogout = () => {
  //   localStorage.removeItem("adminToken");
  //   localStorage.removeItem("adminUser");
  //   setAdminLoggedIn(false);
  // };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Box
      sx={{
        minHeight: { xs: "60vh", md: "80vh" },
        //bgcolor: "linear-gradient(to bottom right, #7207beff, #9b5de5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 6 },
          borderRadius: 4,
          width: { xs: "90vw", sm: 400 },
          textAlign: "center",
          bgcolor: "rgba(235, 215, 255, 1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 6, color: "black" }}
        >
          ADMIN LOGIN
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />

          <Link
            href="#"
            underline="hover"
            sx={{
              color: "blue",
              fontSize: "0.85rem",
              alignSelf: "center",
              mt: 1,
            }}
          >
            forgot password
          </Link>

          <Button
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              bgcolor: "black",
              color: "white",
              borderRadius: "10px",
              py: 1.2,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Login
          </Button>

          <Link
            onClick={() => navigate("/register")}
            underline="hover"
            sx={{
              color: "purple",
              fontSize: "1rem",
              mt: 2,
              cursor: "pointer",
            }}
          >
            Register
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
