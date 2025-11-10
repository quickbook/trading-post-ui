import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../App";
import { LoadingScreen } from "./HomePage";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/registrationSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const {
    setSnackbarMessage,
    setSnackbarOpen,
    setSnackbarSeverity,
    isLoading,
    setIsLoading,
  } = React.useContext(MainContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    contactNumber: "",
    gmail: "",
    password: "",
    address: "",
    city: "",
    pinCode: "",
    countryCode: "",
    stateCode: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ Password validation pattern - moved outside function for reuse
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;

  // ✅ Field validation logic
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "userName":
        if (!value.trim()) error = "Username is required";
        else if (value.length < 3) error = "At least 3 characters required";
        else if (value.length > 50) error = "Must not exceed 50 characters";
        break;

      case "firstName":
        if (!value.trim()) error = "First name is required";
        break;

      case "lastName":
        if (!value.trim()) error = "Last name is required";
        break;

      case "contactNumber":
        if (!value.trim()) error = "Contact number is required";
        else if (!/^[0-9]{10}$/.test(value))
          error = "Enter a valid number (10 digits)";
        break;

      case "gmail":
        if (!value.trim()) error = "Email is required";
        else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
        )
          error = "Enter a valid email address";
        break;

      case "password":
        if (!value.trim()) error = "Password is required";
        else if (!passwordRegex.test(value))
          error =
            "Password must be 8 to 12 letters, include at least one uppercase, lowercase, number & symbol";
        break;

      case "address":
        if (!value.trim()) error = "Address is required";
        break;

      case "city":
        if (!value.trim()) error = "City is required";
        break;

      case "pinCode":
        if (!value.trim()) error = "Zip code is required";
        else if (!/^[0-9]{4,10}$/.test(value))
          error = "Enter a valid zip code (4–10 digits)";
        break;

      case "countryCode":
        if (!value.trim()) error = "Country is required";
        else if (!/^[A-Z]{2,3}$/.test(value))
          error = "Use valid code (e.g. IN, USA)";
        break;

      case "stateCode":
        if (value && !/^[A-Z]{2,3}$/.test(value))
          error = "Use valid code (e.g. KA, NY)";
        break;

      default:
        break;
    }

    return error;
  };

  // ✅ Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ✅ Common onChange handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert to uppercase for countryCode and stateCode
    const processedValue =
      name === "countryCode" || name === "stateCode"
        ? value.toUpperCase()
        : value;

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Only validate if field has been touched
    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // ✅ Validate all before submit
  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(formData).forEach((field) => {
      newTouched[field] = true;
      newErrors[field] = validateField(field, formData[field]);
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.values(newErrors).every((err) => !err);
  };

  // ✅ Submit handler with API call (register only, no auto-login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      // setSnackbarMessage("Please fix the errors before submitting");
      // setSnackbarSeverity("error");
      // setSnackbarOpen(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      dispatch(registerUser(formData))
    } catch (error) {
      setSnackbarMessage(error.message || "Registration failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) navigate("/admin");
  }, [navigate]);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Box
      sx={{
        minHeight: { xs: "60vh", md: "80vh" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 6 },
          borderRadius: 4,
          width: { xs: "90vw", sm: 600 },
          bgcolor: "rgba(235, 215, 255, 1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 4,
            textAlign: "center",
            color: "black",
          }}
        >
          USER REGISTRATION
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid size={{ xs: 12}}>
              <TextField
                required
                name="userName"
                label="Username"
                fullWidth
                value={formData.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.userName && touched.userName}
                helperText={touched.userName ? errors.userName : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* First Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="firstName"
                required
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.firstName && touched.firstName}
                helperText={touched.firstName ? errors.firstName : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* Middle Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="middleName"
                label="Middle Name (Optional)"
                fullWidth
                value={formData.middleName}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="lastName"
                required
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.lastName && touched.lastName}
                helperText={touched.lastName ? errors.lastName : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* Contact Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="contactNumber"
                required
                label="Contact Number"
                fullWidth
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.contactNumber && touched.contactNumber}
                helperText={touched.contactNumber ? errors.contactNumber : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* Gmail */}
            <Grid size={{ xs: 12}}>
              <TextField
                name="gmail"
                required
                label="Email"
                fullWidth
                value={formData.gmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.gmail && touched.gmail}
                helperText={touched.gmail ? errors.gmail : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* Password */}
            <Grid size={{ xs: 12}}>
              <TextField
                name="password"
                required
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.password && touched.password}
                helperText={touched.password ? errors.password : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12}}>
              <TextField
                name="address"
                required
                label="Address"
                fullWidth
                multiline
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.address && touched.address}
                helperText={touched.address ? errors.address : ""}
                rows={2}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* City */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="city"
                required
                label="City"
                fullWidth
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.city && touched.city}
                helperText={touched.city ? errors.city : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* Pin Code */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="pinCode"
                required
                label="Pin Code"
                fullWidth
                value={formData.pinCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.pinCode && touched.pinCode}
                helperText={touched.pinCode ? errors.pinCode : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* Country Code */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="countryCode"
                required
                label="Country Code"
                fullWidth
                value={formData.countryCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.countryCode && touched.countryCode}
                helperText={touched.countryCode ? errors.countryCode : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* State Code */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="stateCode"
                label="State Code (Optional)"
                fullWidth
                value={formData.stateCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.stateCode && touched.stateCode}
                helperText={touched.stateCode ? errors.stateCode : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              mt: 4,
              bgcolor: "black",
              color: "white",
              borderRadius: "10px",
              py: 1.2,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Register
          </Button>

          <Button
            onClick={() => navigate("/login")}
            disabled={errors.length > 0}
            fullWidth
            sx={{
              mt: 2,
              color: "purple",
              textTransform: "none",
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
