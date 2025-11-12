import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  InputAdornment,
} from "@mui/material";
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  LockOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../features/auth/loginSlice";

// Styled components for better customization
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  color: "white",
  fontSize: 32,
  fontWeight: "bold",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  backgroundColor: "#4b0082",
  "&:hover": {
    //transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#4b0082e1",
  },
  transition: "all 0.3s ease",
}));

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real application, you would make an API call here
      // await authAPI.forgotPassword(email);
      //   if(forgotPassword(email)){

      //   };

      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isSubmitted) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            //backgroundColor: 'transparent',
            padding: 2,
          }}
        >
          <StyledPaper>
            <LogoContainer sx={{ width: "50px", height: "50px" }}>
              ✓
            </LogoContainer>

            <Typography
              component="h2"
              variant="h4"
              gutterBottom
              align="center"
              fontWeight="bold"
            >
              Check Your Email
            </Typography>

            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              We've sent a password reset link to
              <br />
              <strong>{email}</strong>
            </Typography>

            <Alert
              severity="success"
              sx={{
                width: "100%",
                mb: 3,
                borderRadius: 2,
              }}
            >
              Password reset email sent successfully!
            </Alert>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Didn't receive the email? Check your spam folder or{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => setIsSubmitted(false)}
                sx={{ fontWeight: 600 }}
              >
                try again
              </Link>
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/login")}
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Back to Login
            </Button>
          </StyledPaper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          //background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 2,
        }}
      >
        <StyledPaper>
          <LockOutlined
            fontSize="large"
            sx={{
              mb: 2,
              p: 1,
              color: "#ffffff",
              bgcolor: "#4b0082",
              borderRadius: "50%",
            }}
          />

          <Typography
            component="h2"
            variant="h4"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            Forgot Password?
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            No worries! Enter your email and we'll send you a reset link.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  borderColor: "#4b0082",
                  "&:hover fieldset": {
                    borderColor: "#4b0082e1",
                  },
                },
              }}
            />

            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Reset Link"
              )}
            </SubmitButton>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Link
                onClick={() => navigate("/login")}
                variant="body2"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Back to Login
              </Link>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
