import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../../App";
import { LoadingScreen } from "./HomePage";
import { registerUser } from "../../features/auth/registrationSlice";
import {
  fetchCountries,
  selectCountryOptions,
  selectCountryNameByCode,
  resetDomainData,
  selectDomainDataStatus,
  selectDomainDataError,
} from "../../features/domain/domainDataSlice";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;

const initialData = {
    gmail: "",
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    contactNumber: "",
    address: "",
    city: "",
    stateCode: "",
    zipCode: "",
    countryCode: "",
    acceptTerms: false,
  }

const RegisterPage = () => {
  const dispatch = useDispatch();
  const countryOptions = useSelector(selectCountryOptions);
  const countriesStatus = useSelector(selectDomainDataStatus('countries'));
  const countriesError = useSelector(selectDomainDataError);
  const navigate = useNavigate();
  const { setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity } =
    React.useContext(MainContext);

  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState(initialData);

  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [showPwd, setShowPwd] = React.useState(false);
  const [showPwd2, setShowPwd2] = React.useState(false);
  const initCountries = React.useRef(false);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "gmail":
        if (!value.trim()) error = "Email is required";
        else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        )
          error = "Enter a valid email";
        break;
      case "userName":
        if (!value.trim()) error = "Username is required";
        else if (value.length < 3) error = "At least 3 characters";
        else if (value.length > 50) error = "Max 50 characters";
        break;
      case "password":
        if (!value.trim()) error = "Password is required";
        else if (!PASSWORD_REGEX.test(value))
          error = "8–12 chars with upper, lower, number & symbol";
        break;
      case "confirmPassword":
        if (!value.trim()) error = "Confirm your password";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
      case "firstName":
        if (!value.trim()) error = "First name is required";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        break;
      case "contactNumber":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^[0-9]{10}$/.test(value))
          error = "Enter a valid 10-digit number";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "stateCode":
        if (value && !/^[A-Za-z0-9\- ]{2,8}$/.test(value))
          error = "Invalid state/region";
        break;
      case "zipCode":
        if (!value.trim()) error = "Pin/Zip is required";
        else if (!/^[0-9]{4,10}$/.test(value)) error = "Enter 4–10 digits";
        break;
      case "countryCode":
        if (!value.trim()) error = "Country is required";
        break;
      case "acceptTerms":
        if (!value) error = "You must accept Terms";
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: v }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, v) }));
    }
  };

  const validateAll = () => {
    const nextErrors = {};
    const nextTouched = {};
    Object.keys(formData).forEach((field) => {
      nextTouched[field] = true;
      nextErrors[field] = validateField(field, formData[field]);
    });
    setTouched(nextTouched);
    setErrors(nextErrors);
    return Object.values(nextErrors).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const payload = { ...formData };
    payload.countryCode = countryOptions?.find((c) => c.value === formData.countryCode)?.value || payload.countryCode;
    delete payload.confirmPassword;
    delete payload.acceptTerms;

    setIsLoading(true);
    try {
      await dispatch(registerUser(payload)).unwrap?.();
      setSnackbarMessage("Registration successful. Please log in.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/login");
    } catch (error) {
      setSnackbarMessage(error?.message || "Registration failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      setFormData(initialData);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if(!initCountries.current){
      if(!countryOptions.length) dispatch(fetchCountries());
      initCountries.current = true;
    }
  },[]);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        transform: { xs: "translateY(-2vh)", md: "translateY(-4vh)" },
        bgcolor: "transparent",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 960, // ⬅️ wider form
          borderRadius: 4,
          p: { xs: 3, sm: 4 }, // compact padding -> shorter height
          background: "linear-gradient(135deg, #f4e5ffff 40%, #e5c1ffff 80%)",
        }}
      >
        <Typography variant="h5" fontWeight={700} align="center" sx={{ mb: 3 }}>
          Create your account
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          {/* Account */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Account details
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                name="gmail"
                label="Email"
                fullWidth
                value={formData.gmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.gmail && touched.gmail}
                helperText={touched.gmail ? errors.gmail : " "}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                name="userName"
                label="Username"
                fullWidth
                value={formData.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.userName && touched.userName}
                helperText={touched.userName ? errors.userName : " "}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                name="password"
                label="Password"
                type={showPwd ? "text" : "password"}
                fullWidth
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.password && touched.password}
                helperText={
                  touched.password
                    ? errors.password
                    : "8–12 chars, upper/lower/number/symbol"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPwd((s) => !s)}
                      >
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                name="confirmPassword"
                label="Confirm Password"
                type={showPwd2 ? "text" : "password"}
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.confirmPassword && touched.confirmPassword}
                helperText={
                  touched.confirmPassword ? errors.confirmPassword : " "
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPwd2((s) => !s)}
                      >
                        {showPwd2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Row: First / Middle / Last */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Personal information
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.firstName && touched.firstName}
                helperText={touched.firstName ? errors.firstName : " "}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                name="middleName"
                label="Middle Name (Optional)"
                fullWidth
                value={formData.middleName}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText=" "
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.lastName && touched.lastName}
                helperText={touched.lastName ? errors.lastName : " "}
              />
            </Grid>
          </Grid>

          {/* Row: Mobile / City / Address */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                name="contactNumber"
                label="Mobile Number"
                fullWidth
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.contactNumber && touched.contactNumber}
                helperText={touched.contactNumber ? errors.contactNumber : " "}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                name="city"
                label="City"
                fullWidth
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.city && touched.city}
                helperText={touched.city ? errors.city : " "}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                name="address"
                label="Street Address"
                fullWidth
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.address && touched.address}
                helperText={touched.address ? errors.address : " "}
              />
            </Grid>
          </Grid>

          {/* Row: Country / State / City (as requested)… but to avoid duplicate City, we keep Pin here instead */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                required
                name="countryCode"
                label="Country"
                fullWidth
                SelectProps={{
                  MenuProps: {
                    PaperProps: { style: { maxHeight: 260, width: 320 } },
                  },
                }}
                value={formData.countryCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.countryCode && touched.countryCode}
                helperText={
                  touched.countryCode
                    ? errors.countryCode
                    : "Select your country"
                }
              >
                {countriesStatus === "succeeded" ? (
                  countryOptions.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                name="stateCode"
                label="State / Region"
                fullWidth
                value={formData.stateCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.stateCode && touched.stateCode}
                helperText={touched.stateCode ? errors.stateCode : " "}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                name="zipCode"
                label="Pin / ZIP"
                fullWidth
                value={formData.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.zipCode && touched.zipCode}
                helperText={touched.zipCode ? errors.zipCode : " "}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            }
            label="I agree to the Terms and Privacy Policy"
          />
          {touched.acceptTerms && errors.acceptTerms && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", mt: 0.5 }}
            >
              {errors.acceptTerms}
            </Typography>
          )}

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#4b0082",
              "&:hover": { bgcolor: "#4c0082e1" },
            }}
          >
            Create account
          </Button>

          <Button
            onClick={() => navigate("/login")}
            fullWidth
            sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
          >
            <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} />
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
