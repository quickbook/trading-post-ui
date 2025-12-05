import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Avatar,
  Box,
  Divider,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material";
import {
  fetchCountries,
  selectCountryOptions,
  selectCountryNameByCode,
  resetDomainData,
  selectDomainDataStatus,
  selectDomainDataError,
} from "../../features/domain/domainDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUser } from "../../features/auth/loginSlice";
import { MainContext } from "../../App";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUser);
  const countryOptions = useSelector(selectCountryOptions);
  const countriesStatus = useSelector(selectDomainDataStatus("countries"));
  const countriesError = useSelector(selectDomainDataError);
  const { setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity } =
    React.useContext(MainContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(userDetails);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [errors, setErrors] = useState({});

  const initCountries = React.useRef(false);

  // Country and state options

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Reset form when canceling edit
      setUserData(userDetails);
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const validateForm = () => {
    const newErrors = {};

    if (isEditing) {
      // Email validation
      if (!userData.gmail) {
        newErrors.gmail = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(userData.gmail)) {
        newErrors.gmail = "Email is invalid";
      }

      // Username validation
      if (!userData.userName) {
        newErrors.userName = "Username is required";
      }

      // Password validation (only if changing password)
      if (userData.password && userData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (userData.password !== userData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      // Required fields validation
      if (!userData.firstName) newErrors.firstName = "First name is required";
      if (!userData.lastName) newErrors.lastName = "Last name is required";
      if (!userData.contactNumber)
        newErrors.contactNumber = "Contact number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors before saving",
        severity: "error",
      });
      return;
    }

    const payload = { ...userData };
    const userName = payload.userName;
    payload.countryCode =
      countryOptions?.find((c) => c.label === userData.countryName)?.value ||
      payload.countryName;

    delete payload.confirmPassword; // backend does not need this field
    delete payload.id;
    delete payload.roleName;
    delete payload.countryName;
    delete payload.userName;

    try {
      await dispatch(updateUser({ userName, payload })).unwrap();
      setUserData(userDetails);
      // Stop editing mode
      setIsEditing(false);

      // Clear password fields
      setUserData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      setSnackbarMessage("Profile updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/login");
    } catch (error) {
      setSnackbarMessage(error?.errorDetails.errorMessage || "Profile update failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {}
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getFullName = () => {
    return `${userData.firstName} ${
      userData.middleName ? userData.middleName + " " : ""
    }${userData.lastName}`;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!initCountries.current) {
      if (!countryOptions.length) dispatch(fetchCountries());
      initCountries.current = true;
    }
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              background:
                "linear-gradient(135deg, #36015cff 30%, #590197ff 90%)",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={3}
              sx={{ width: "100%" }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "rgba(255,255,255,0.2)",
                  border: "3px solid white",
                }}
              >
                <Person sx={{ fontSize: 48 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {getFullName()}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {userData.gmail}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  @{userData.userName}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Form */}
        <Grid size={{ xs: 12 }}>
          <Card
            elevation={3}
            sx={{
              background:
                "linear-gradient(135deg, #f4e5ffff 40%, #e5c1ffff 80%)",
            }}
          >
            <CardHeader
              title={
                <Typography
                  variant="h5"
                  sx={{ color: "#4b0082", fontWeight: "bold" }}
                >
                  User Information
                </Typography>
              }
              action={
                <Box display="flex" gap={1}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        color="primary"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleToggleEdit}
                        color="error"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={handleToggleEdit}
                      sx={{ bgcolor: "#4b0082" }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              }
            />
            <Alert severity="info">
              Click on the edit profile button to update your details and save
              it
            </Alert>
            <Divider sx={{ border: "2px solid #cecece" }} />
            <CardContent sx={{ px: 6, py: 4 }}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Account Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Account Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="gmail"
                    value={userData.gmail}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                    error={!!errors.gmail}
                    helperText={errors.gmail}
                    type="email"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="userName"
                    value={userData.userName}
                    onChange={handleChange}
                    disabled
                    error={!!errors.userName}
                    helperText={errors.userName}
                  />
                </Grid>

                {isEditing && (
                  <>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={userData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                )}

                {/* Personal Details */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Personal Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Middle Name"
                    name="middleName"
                    value={userData.middleName ?? ""}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contactNumber"
                    value={userData.contactNumber}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
                    required
                  />
                </Grid>

                {/* Address Details */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Address Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="State"
                    name="stateName"
                    value={userData.stateName ?? ""}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={userData.zipCode}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Country"
                    name="countryName"
                    value={userData.countryName}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                      },
                    }}
                  >
                    {countriesStatus === "succeeded" ? (
                      countryOptions.map((c) => (
                        <MenuItem key={c.value} value={c.label}>
                          {c.label}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        {countriesStatus === "loading"
                          ? "Loading countries..."
                          : countriesError
                          ? "Error loading countries"
                          : "No countries available"}
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
