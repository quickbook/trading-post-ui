import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../App";
import { LoadingScreen } from "./HomePage";
import { useDispatch, useSelector } from "react-redux";
import { login, selectIsLoginSuccess, selectUser, selectRole } from "../../features/auth/loginSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const isLoginSuccess = useSelector(selectIsLoginSuccess)
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
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email.trim())) {
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

      const user = await dispatch(login(formData)).unwrap();

      // ✅ Check if login succeeded (status set in slice)
      if (user && user.role) {
        // ✅ Role-based context logic
        if (user.role === "ADMIN") {
          setAdminLoggedIn(true);
        } else {
          setAdminLoggedIn(false);
        }

        // ✅ Success UI feedback
        setSnackbarMessage(`Login successful! Welcome back, ${user.name || "User"}.`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/");

      } else {
        if (user?.errorDetails?.errorMessage) {
          const errMsg = user.errorDetails.errorMessage;
          setSnackbarMessage(user.message + ":" + errMsg || "Login failed. Try again.");
        } else {
          setSnackbarMessage(user.message || "Login failed. Try again.");
        }

        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      // Update context


      // Snackbar success

      // Redirect

    } catch (err) {
      console.error("error", err);
      if (err?.errorDetails?.fieldErrors) {
        const fieldErrors = err.errorDetails.fieldErrors;       
        const firstError = Object.values(fieldErrors)[0];
        setSnackbarMessage(firstError || "Login failed. Try again.");
      } else if (err?.errorDetails?.errorMessage) {
        const errMsg = err.errorDetails.errorMessage;
        setSnackbarMessage(err.message + ":" + errMsg || "Login failed. Try again.");
      } else {
        // fallback
        setSnackbarMessage(err?.message || "Login failed. Try again.");
      }

      setSnackbarSeverity("error");
      setSnackbarOpen(true);        
    } finally {
      setIsLoading(false);
    }
  };

 

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
          LOGIN
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
