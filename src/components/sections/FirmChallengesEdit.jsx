import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Paper,
  Alert,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
  selectPhases,
  selectTiers,
} from "../../features/domain/domainDataSlice";
import { selectFirms } from "../../features/firms/firmsSelectors";

// const tierOptions = [
//   "King",
//   "Duke",
//   "1 Step",
//   "2 Step",
//   "3 Step",
//   "One-Stage",
//   "Two-Stage",
//   "Three-Stage",
//   "Knight",
// ];

// const phaseOptions = [
//   "1-Phase",
//   "2-Phase",
//   "Evaluation",
//   "1-Step Challenge",
//   "2-Step Challenge",
// ];

const initialChallengeData = {
  firmId: "",
  tier: "King",
  phase: "TWO_PHASE",
  profitTargetPct: 10.0,
  dailyLossPct: 5.0,
  maxLossPct: 10.0,
  accountSizeUsd: 50000,
  price: { amount: 299.0, currency: "USD" },
  buyUrl: "",
};

const FirmChallengesEdit = ({
  allChallenges,
  onSubmit,
  onUpdateChallenge,
  onDeleteChallenge,
}) => {
  const tierOptions = useSelector(selectTiers);
  const phaseOptions = useSelector(selectPhases);
  const firms = useSelector(selectFirms);

  const firmFilterOptions = firms.flatMap((e) => ({ id: e.id, name: e.name }));

  const [formData, setFormData] = useState(initialChallengeData);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("price.")) {
      const field = name.split(".")[1];
      setFormData((p) => ({
        ...p,
        price: {
          ...p.price,
          [field]: field === "amount" ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData((p) => ({
        ...p,
        [name]:
          name.includes("Pct") || name === "accountSizeUsd"
            ? parseFloat(value) || 0
            : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditChallenge = (challenge, firmId) => {
    const phaseName = phaseOptions?.find(
      (p) => p.code === challenge.phase
    );
    setEditingChallenge({ ...challenge, firmId });
    setFormData({
      firmId: firmId,
      tier: challenge.tier,
      phase: phaseName ? phaseName.label : challenge.phase,
      profitTargetPct: challenge.profitTargetPct,
      dailyLossPct: challenge.dailyLossPct,
      maxLossPct: challenge.maxLossPct,
      accountSizeUsd: challenge.accountSizeUsd,
      price: { ...challenge.price },
      buyUrl: challenge.buyUrl,
    });
  };

  const handleUpdateChallenge = (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Update the challenge data
    onUpdateChallenge(editingChallenge.id, formData);

    // Reset form and show success message
    setFormData(initialChallengeData);
    setEditingChallenge(null);
    setErrors({});
    setSuccess(true);
    window.scrollTo({ top: 10, behavior: "smooth" });

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDeleteClick = (challengeId, firmId) => {
    setChallengeToDelete({ challengeId, firmId });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteChallenge(challengeToDelete.challengeId, challengeToDelete.firmId);
    setDeleteDialogOpen(false);
    setChallengeToDelete(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditingChallenge(null);
    setFormData(initialChallengeData);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firmId) {
      newErrors.firmId = "Please select a firm";
    }
    if (!formData.tier) {
      newErrors.tier = "Tier is required";
    }
    if (!formData.phase) {
      newErrors.phase = "Phase is required";
    }
    if (!formData.accountSizeUsd || formData.accountSizeUsd <= 0) {
      newErrors.accountSizeUsd =
        "Account size is required and must be greater than 0";
    }
    if (!formData.price.amount || formData.price.amount <= 0) {
      newErrors.price = "Price is required and must be greater than 0";
    }
    if (!formData.profitTargetPct || formData.profitTargetPct <= 0) {
      newErrors.profitTargetPct =
        "Profit target is required and must be greater than 0";
    }
    if (!formData.dailyLossPct || formData.dailyLossPct <= 0) {
      newErrors.dailyLossPct =
        "Daily loss limit is required and must be greater than 0";
    }
    if (!formData.maxLossPct || formData.maxLossPct <= 0) {
      newErrors.maxLossPct =
        "Maximum loss limit is required and must be greater than 0";
    }
    if (!formData.buyUrl.trim()) {
      newErrors.buyUrl = "Buy URL is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Submit the challenge data
    onSubmit(formData);

    // Reset form and show success message
    setFormData(initialChallengeData);
    setErrors({});
    setSuccess(true);
    window.scrollTo({ top: 10, behavior: "smooth" });

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  const resetForm = () => {
    setFormData(initialChallengeData);
    setErrors({});
    setSuccess(false);
  };

  return (
    <Container
      sx={{
        p: 4,
        width: { xs: "100%", lg: 940, xl: "75vw" },
        mx: "auto",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight={600}
        >
          {editingChallenge ? "Edit Challenge" : "Add New Challenge"}
        </Typography>

        <Typography
          variant="body1"
          color="textSecondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Add trading challenges to existing firms
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Challenge added successfully!
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={editingChallenge ? handleUpdateChallenge : handleSubmit}
        >
          <Grid container spacing={3}>
            {/* Firm Selection */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required error={!!errors.firmId}>
                <InputLabel>Select Firm</InputLabel>
                <Select
                  name="firmId"
                  value={formData.firmId}
                  label="Select Firm"
                  onChange={handleChange}
                >
                  <MenuItem value="" disabled>
                    <em>Select a firm</em>
                  </MenuItem>
                  {firmFilterOptions.map((firm) => (
                    <MenuItem key={firm.id} value={firm.id}>
                      {firm.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.firmId && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {errors.firmId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Challenge Details */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!errors.tier}>
                <InputLabel>Tier</InputLabel>
                <Select
                  name="tier"
                  value={formData.tier}
                  label="Tier"
                  onChange={handleChange}
                >
                  {tierOptions.map((tier) => (
                    <MenuItem key={tier.name} value={tier.name}>
                      {tier.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tier && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {errors.tier}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required error={!!errors.phase}>
                <InputLabel>Phase</InputLabel>
                <Select
                  name="phase"
                  value={formData.phase ?? ""}
                  label="Phase"
                  onChange={handleChange}
                >
                  {phaseOptions.map((phase) => (
                    <MenuItem key={phase.code} value={phase.code}>
                      {phase.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.phase && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {errors.phase}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Account Size (USD)"
                name="accountSizeUsd"
                value={formData.accountSizeUsd}
                onChange={handleChange}
                error={!!errors.accountSizeUsd}
                helperText={errors.accountSizeUsd}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price (USD)"
                name="price.amount"
                value={formData.price.amount}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Profit Target (%)"
                name="profitTargetPct"
                value={formData.profitTargetPct}
                onChange={handleChange}
                error={!!errors.profitTargetPct}
                helperText={errors.profitTargetPct}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Daily Loss (%)"
                name="dailyLossPct"
                value={formData.dailyLossPct}
                onChange={handleChange}
                error={!!errors.dailyLossPct}
                helperText={errors.dailyLossPct}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Max Loss (%)"
                name="maxLossPct"
                value={formData.maxLossPct}
                onChange={handleChange}
                error={!!errors.maxLossPct}
                helperText={errors.maxLossPct}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Buy URL"
                name="buyUrl"
                value={formData.buyUrl}
                onChange={handleChange}
                error={!!errors.buyUrl}
                helperText={errors.buyUrl}
                placeholder="https://example.com/challenge"
              />
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                {/* Add Cancel button when editing else reset button */}
                {editingChallenge ? (
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    size="large"
                    sx={{ ml: 2 }}
                  >
                    Cancel Edit
                  </Button>
                ) : (
                  <Button variant="outlined" onClick={resetForm} size="large">
                    Reset
                  </Button>
                )}
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  startIcon={<Save />}
                  sx={{ bgcolor: "#4b0082" }}
                >
                  {editingChallenge ? "Update Challenge" : "Add Challenge"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* Add Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this challenge? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Current Challenges Preview */}
        {formData.firmId && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Current Challenges for Selected Firm
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              {(() => {
                const selectedFirm = firms.find(
                  (f) => f.id === formData.firmId
                );
                const challengesByFirm = allChallenges.filter(
                  (c) => c.firmId === selectedFirm.id
                );

                if (challengesByFirm.length === 0) {
                  return (
                    <Typography color="textSecondary">
                      No challenges added yet for this firm.
                    </Typography>
                  );
                }

                return challengesByFirm.map((challenge, index) => (
                  <Card key={challenge.id || index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {challenge.tier} - {challenge.phase}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                          >
                            Account: $
                            {challenge.accountSizeUsd?.toLocaleString()} |
                            Price: ${challenge.price?.amount} | Target:{" "}
                            {challenge.profitTargetPct}% | Daily Loss:{" "}
                            {challenge.dailyLossPct}% | Max Loss:{" "}
                            {challenge.maxLossPct}%
                          </Typography>
                          {challenge.buyUrl && (
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              <strong>Buy URL:</strong> {challenge.buyUrl}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              handleEditChallenge(challenge, selectedFirm.id);
                              window.scrollTo({ top: 120, behavior: "smooth" });
                            }}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDeleteClick(challenge.id, selectedFirm.id)
                            }
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ));
              })()}
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FirmChallengesEdit;
