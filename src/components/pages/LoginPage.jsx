import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";

import { MainContext } from "../../App";
import { LoadingScreen } from "./HomePage";
import { login } from "../../features/auth/loginSlice";

// Strong password rule: 8–12 chars with upper, lower, number & symbol
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    setAdminLoggedIn,
    setSnackbarMessage,
    setSnackbarOpen,
    setSnackbarSeverity,
    isLoading,
    setIsLoading,
  } = React.useContext(MainContext);

  const [showPassword, setShowPassword] = React.useState(false);
  const [capsOn, setCapsOn] = React.useState(false);

  const savedIdentifier = React.useMemo(
    () => localStorage.getItem("tpui_saved_identifier") || "",
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      identifier: savedIdentifier,
      password: "",
      remember: Boolean(savedIdentifier),
    },
  });

  const handleKeyUp = (e) => {
    const caps =
      typeof e.getModifierState === "function" && e.getModifierState("CapsLock");
    setCapsOn(Boolean(caps));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Send identifier (email or username) + password to the backend
      const user = await dispatch(
        login({ identifier: data.identifier, password: data.password })
      ).unwrap();

      if (user && user.role) {
        setAdminLoggedIn(user.role === "ADMIN");

        if (data.remember) {
          localStorage.setItem("tpui_saved_identifier", data.identifier);
        } else {
          localStorage.removeItem("tpui_saved_identifier");
        }

        setSnackbarMessage(
          `Login successful! Welcome back${user.name ? ", " + user.name : ""}.`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/");
      } else {
        const errMsg =
          user?.errorDetails?.errorMessage ||
          user?.message ||
          "Login failed. Try again.";
        setSnackbarMessage(errMsg);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      if (err?.errorDetails?.fieldErrors) {
        const firstError = Object.values(err.errorDetails.fieldErrors)[0];
        setSnackbarMessage(firstError || "Login failed. Try again.");
      } else if (err?.errorDetails?.errorMessage) {
        const e = err.errorDetails.errorMessage;
        setSnackbarMessage(err.message ? `${err.message}: ${e}` : e);
      } else {
        setSnackbarMessage(err?.message || "Login failed. Try again.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    window.scrollTo({top: 0, behavior:'smooth'});
  },[])

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: {xs:'auto',md:"90vh"}, // full viewport height
        display: "flex",
        alignItems: "center", // vertical center
        justifyContent: "center", // horizontal center
        px: 2,
        py:3,
        // 👇 remove the pink gradient by using a solid/transparent background
        bgcolor: "transparent", // or set a solid color like '#1e1b4b'
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 4,
          p: { xs: 3, sm: 5 },
          background:
          "linear-gradient(135deg, #f4e5ffff 40%, #e5c1ffff 80%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LockOutlined fontSize="small" />
          <Typography variant="overline" color="text.secondary" letterSpacing={1}>
            SECURE LOGIN
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Welcome back
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          {/* Email or Username */}
          <Controller
            name="identifier"
            control={control}
            rules={{ required: "Email or Username is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email or Username"
                fullWidth
                margin="normal"
                autoComplete="username"
                error={!!errors.identifier}
                helperText={errors.identifier?.message}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              pattern: {
                value: PASSWORD_REGEX,
                message: "8-12 chars, upper, lower, number & symbol",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                onKeyUp={handleKeyUp}
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={
                  errors.password?.message || (capsOn ? "Caps Lock is ON" : " ")
                }
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Remember / Forgot */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}
          >
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Remember me"
                />
              )}
            />
            <MuiLink component={RouterLink} to="/forgotpassword" underline="hover" sx={{ fontSize: 14 }}>
              Forgot password?
            </MuiLink>
          </Box>

          {/* Submit */}
          <Box sx={{ position: "relative", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!isValid || isLoading}
              sx={{
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                letterSpacing: 0.3,
                bgcolor:"#4b0082",
                '&:hover':{
                  bgcolor:'#4b0082c1'
                }
              }}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
            {isLoading && (
              <CircularProgress
                size={22}
                sx={{ position: "absolute", top: "50%", left: "50%", mt: "-11px", ml: "-11px" }}
              />
            )}
          </Box>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            New here?{" "}
            <MuiLink component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 600 }}>
              Create an account
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
