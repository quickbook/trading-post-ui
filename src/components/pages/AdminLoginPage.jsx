import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../App";
import { LoadingScreen } from "./HomePage";

const AdminLoginPage = () => {
  const {
    setAdminLoggedIn,
    setSnackbarMessage,
    setSnackbarOpen,
    setSnackbarSeverity,
    isLoading,
    setIsLoading,
  } = React.useContext(MainContext);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  // Password validation pattern
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", password: "" };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
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
      const response = await fetch("https://your-backend.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save token and admin info
      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("adminUser", JSON.stringify(data.admin));

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
            label="User Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
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

          {/* <Link
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
          </Link> */}

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
            }}
          >
            Register
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLoginPage;
