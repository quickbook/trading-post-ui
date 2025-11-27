import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { MainContext } from "../../App";

export default function BookACallSection() {
  const {openForm, handleOpenForm} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClose = () => {
    handleOpenForm(false);
    reset();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const textFieldStyle = {
    bgcolor: "#ffffff",
    borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#ffd700", // Change outline color when focused
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "#4b0082", // Change label color when focused
      },
    },
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    setTimeout(() => {
      handleClose();
    }, 1000); // Simulate form submission delay
    setSnackbarOpen(true); // Show success snackbar
  };

  return (
    <>
      <Dialog open={openForm} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#260242ff",
            color: "white",
            px: 3,
            py: 2,
          }}
        >
          Contact Form
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: "white",
              "&:hover": { bgcolor: "#cecece" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ bgcolor: "#ecddf8", color: "white" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Name is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    required
                    variant="outlined"
                    sx={textFieldStyle}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    required
                    variant="outlined"
                    sx={textFieldStyle}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <Controller
                name="firm"
                control={control}
                defaultValue=""
                rules={{
                  required: "Firm is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Firm"
                    fullWidth
                    required
                    variant="outlined"
                    sx={textFieldStyle}
                    error={!!errors.firm}
                    helperText={errors.firm?.message}
                  />
                )}
              />
              <Controller
                name="whatsapp"
                control={control}
                defaultValue=""
                rules={{
                  required: "Whatsapp Number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid Whatsapp number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Whatsapp Number"
                    fullWidth
                    required
                    variant="outlined"
                    sx={textFieldStyle}
                    error={!!errors.whatsapp}
                    helperText={errors.whatsapp?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="services"
              control={control}
              defaultValue=""
              rules={{
                required: "Services is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="What services are you interested in"
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ mb: 2, ...textFieldStyle }}
                />
              )}
            />

            <Controller
              name="aboutFirm"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tell us about your firm:"
                  fullWidth
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{ mb: 2, ...textFieldStyle }}
                />
              )}
            />

            <Controller
              name="consent"
              control={control}
              defaultValue={false}
              rules={{
                required: "Consent is required",
              }}
              render={({ field, fieldState: { error } }) => (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControlLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      m: 0,
                      gap: 2,
                      "& .MuiFormControlLabel-label": {
                        color: "#000",
                      },
                    }}
                    control={
                      <Checkbox
                        sx={{
                          bgcolor: "white",
                          "&:hover": { bgcolor: "#cecece" },
                          color: error ? "error.main" : "primary.main",
                          "&.Mui-checked": {
                            color: error ? "error.main" : "primary.main",
                          },
                        }}
                        {...field}
                        checked={field.value}
                      />
                    }
                    label="By checking this box, I consent to receive marketing and promotional messages, including special offers, new product updates among others."
                  />
                  {error && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{
                        textAlign: "center",
                        mt: 0.5,
                      }}
                    >
                      {error.message}
                    </Typography>
                  )}
                </Box>
              )}
            />

            <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#260242ff",
                  "&:hover": { backgroundColor: "#6b03bbff" },
                  color: "#ffffff",
                  border: "2px solid #ffd700",
                  borderRadius: "20px",
                  height: "51px",
                  px: 6,
                  fontFamily: "Montserrat, Helvetica",
                  fontWeight: 600,
                  fontSize: "1rem",
                  lineHeight: "1.5rem",
                  letterSpacing: "0.15px",
                  textTransform: "none",
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Form submitted successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </>
  );
}