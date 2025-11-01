import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../App";

const AdminRegisterPage = () => {
  const { setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity } =
    React.useContext(MainContext);

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

  // ✅ Field validation logic
  const validateField = (name, value) => {
    let error = "";
    // Password validation pattern
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;

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
        else if (!/^[0-9]{10,15}$/.test(value))
          error = "Enter a valid number (10–15 digits)";
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
        else if (!passwordRegex.test(formData.password)) error = "Password must be 8 to 12 letters, include at least one uppercase, lowercase, number & symbol";
        break;

      case "address":
        if (!value.trim()) error = "Address is required";
        break;

      case "city":
        if (!value.trim()) error = "City is required";
        break;

      case "pinCode":
        if (!value.trim()) error = "Pin code is required";
        else if (!/^[0-9]{4,10}$/.test(value))
          error = "Enter a valid pin code (4–10 digits)";
        break;

      case "countryCode":
        if (!value.trim()) error = "Country code is required";
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

  // ✅ Common onChange handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // ✅ Validate all before submit
  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      setSnackbarMessage("Registration successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/login");
    }
  };

  return (
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
          ADMIN REGISTRATION
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                name="userName"
                label="Username"
                fullWidth
                value={formData.userName}
                onChange={handleChange}
                error={!!errors.userName}
                helperText={errors.userName}
              />
            </Grid>

            {/* First Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="firstName"
                required
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>

            {/* Middle Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="middleName"
                label="Middle Name (Optional)"
                fullWidth
                value={formData.middleName}
                onChange={handleChange}
                error={!!errors.middleName}
                helperText={errors.middleName}
              />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="lastName"
                required
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            {/* Contact Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="contactNumber"
                required
                label="Contact Number"
                fullWidth
                value={formData.contactNumber}
                onChange={handleChange}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
              />
            </Grid>

            {/* Gmail */}
            <Grid size={{ xs: 12 }}>
              <TextField
                name="gmail"
                required
                label="Email"
                fullWidth
                value={formData.gmail}
                onChange={handleChange}
                error={!!errors.gmail}
                helperText={errors.gmail}
              />
            </Grid>

            {/* Password */}
            <Grid size={{ xs: 12 }}>
              <TextField
                name="password"
                required
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12 }}>
              <TextField
                name="address"
                required
                label="Address"
                fullWidth
                multiline
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                rows={2}
              />
            </Grid>

            {/* City */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="city"
                required
                label="City"
                fullWidth
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>

            {/* Pin Code */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="pinCode"
                required
                label="Pin Code"
                fullWidth
                value={formData.pinCode}
                onChange={handleChange}
                error={!!errors.pinCode}
                helperText={errors.pinCode}
              />
            </Grid>

            {/* Country Code */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="countryCode"
                required
                label="Country Code"
                fullWidth
                value={formData.countryCode}
                onChange={handleChange}
                error={!!errors.countryCode}
                helperText={errors.countryCode}
              />
            </Grid>

            {/* State Code */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="stateCode"
                label="State Code (Optional)"
                fullWidth
                value={formData.stateCode}
                onChange={handleChange}
                error={!!errors.stateCode}
                helperText={errors.stateCode}
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

export default AdminRegisterPage;
