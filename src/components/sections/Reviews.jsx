import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Modal,
  TextField,
  Grid,
  Container,
  IconButton,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl as MuiFormControl,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectRole,
  selectUserId,
} from "../../features/auth/loginSlice";
import {
  // fetchReviews,
  createReview,
  updateReview,
  deleteReview,
  // selectReviews,
  selectReviewsStatus,
  selectReviewsError,
} from "../../features/reviews/reviewsSlice";
import { cardData } from "/CardsData";
import { MainContext } from "../../App";

// Letter grade options
const GRADE_OPTIONS = [
  { value: "A+", label: "A+ (Excellent)" },
  { value: "A", label: "A (Very Good)" },
  { value: "B", label: "B (Good)" },
  { value: "C", label: "C (Average)" },
  { value: "D", label: "D (Poor)" },
];

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Demo data (as in your original)
const initialReviews = [
  { id: 1, product_id: 1, reviewer_name: "John Doe", prop_name: "Alpha Trading Group", rating: "A", description: "Great product! The quality exceeded my expectations. Would definitely buy again.", created_at: "2024-01-15T10:30:00Z", updated_at: "2024-01-15T10:30:00Z", is_deleted: false },
  { id: 2, product_id: 1, reviewer_name: "Jane Smith", prop_name: "Alpha Trading Group", rating: "A+", description: "Excellent service and fast delivery. Highly recommended!", created_at: "2024-01-16T14:20:00Z", updated_at: "2024-01-16T14:20:00Z", is_deleted: false },
  { id: 3, product_id: 2, reviewer_name: "Mike Johnson", prop_name: "Auqa Funded", rating: "C", description: "Good product but could be improved in some areas.", created_at: "2024-01-17T09:15:00Z", updated_at: "2024-01-17T09:15:00Z", is_deleted: false },
];

export const getGradeColor = (grade) => {
  switch (grade) {
    case "A+":
      return "#4caf50";
    case "A":
      return "#8bc34a";
    case "B":
      return "#c09d00ff";
    case "C":
      return "#da8405ff";
    case "D":
      return "#f44336";
    default:
      return "#9e9e9e";
  }
};

export const getGradeDisplay = (grade) => {
  switch (grade) {
    case "A+":
      return "A+ (Excellent)";
    case "A":
      return "A (Very Good)";
    case "B":
      return "B (Good)";
    case "C":
      return "C (Average)";
    case "D":
      return "D (Poor)";
    default:
      return grade;
  }
};

const Reviews = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const userId = useSelector(selectUserId);
  const status = useSelector(selectReviewsStatus);
  const error = useSelector(selectReviewsError);
  const { adminLoggedIn, setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity } = React.useContext(MainContext);

  const [reviews, setReviews] = useState(initialReviews);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeActionCard, setActiveActionCard] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [propNameFilter, setPropNameFilter] = useState("all");
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  const isLoggedIn = Boolean(user && role && role !== "guest");

  const [newReview, setNewReview] = useState({
    id: null,
    product_id: "",
    reviewer_name: "",
    prop_name: "",
    rating: "",
    description: "",
  });

const TRADING_FIRMS = React.useMemo(() => {
  const items = (cardData || [])
    .filter((c) => c && (c.title || c.name))               // keep valid
    .map((c) => ({
      id: c?.id ?? String(c?.title ?? c?.name),
      name: String(c?.title ?? c?.name ?? "").trim(),
    }))
    .filter((f) => f.name.length > 0);

  // dedupe by name
  const byName = new Map();
  for (const f of items) {
    if (!byName.has(f.name)) byName.set(f.name, f);
  }
  const arr = Array.from(byName.values());

  // safe sort
  arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return arr;
}, []);

  const canModify = (review) => {
    if (role === "admin") return true;
    if (role === "user" && userId) return review.reviewer_id === userId;
    return false;
  };

  const handleActionMenuOpen = (reviewId) => setActiveActionCard(reviewId);
  const handleActionMenuClose = () => { setActiveActionCard(null); setSelectedReview(null); };

  const handleOpenModal = () => {
    setOpenModal(true);
    setIsEditing(false);
    setNewReview({ id: null, product_id: "", reviewer_name: "", prop_name: "", rating: "", description: "" });
  };
  const handleCloseModal = () => { setOpenModal(false); setIsEditing(false); setNewReview({ id: null, product_id: "", reviewer_name: "", prop_name: "", rating: "", description: "" }); };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setNewReview({ id: review.id, product_id: review.product_id, reviewer_name: review.reviewer_name, prop_name: review.prop_name, rating: review.rating, description: review.description });
    setIsEditing(true);
    setOpenModal(true);
    setActiveActionCard(null);
  };

  const handleDeleteClick = (review) => { setSelectedReview(review); setDeleteDialogOpen(true); setActiveActionCard(null); };
  const handleDeleteConfirm = () => { if (selectedReview) { setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id)); setDeleteDialogOpen(false); setSelectedReview(null);} };
  const handleDeleteCancel = () => { setDeleteDialogOpen(false); setSelectedReview(null); };

  const handleInputChange = (field, value) => {
    setNewReview((prev) => ({ ...prev, [field]: value }));
    if (field === "prop_name" && value) {
      const selected = TRADING_FIRMS.find((f) => f.name === value);
      if (selected) setNewReview((prev) => ({ ...prev, product_id: selected.id }));
    }
  };

  const handleToggleExpand = (reviewId) => setExpandedReviewId(expandedReviewId === reviewId ? null : reviewId);

  const filteredReviews = useMemo(() => {
    return (reviews || []).filter((r) => {
      const matchRating = ratingFilter === "all" || r.rating === ratingFilter;
      const matchFirm = propNameFilter === "all" || r.prop_name === propNameFilter;
      return matchRating && matchFirm;
    });
  }, [reviews, ratingFilter, propNameFilter]);

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 9);
  const hasMoreReviews = filteredReviews.length > 9;

  const handleViewAllReviews = () => setShowAllReviews(true);
  const handleRatingFilterChange = (e) => { setRatingFilter(e.target.value); setShowAllReviews(false); };
  const handlePropNameFilterChange = (e) => { setPropNameFilter(e.target.value); setShowAllReviews(false); };

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      setSnackbarMessage("Please log in to write a review. Don't have an account? Create one.");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    handleOpenModal();
  };

  const handleSubmitReview = () => {
    if (newReview.reviewer_name && newReview.description && newReview.rating && newReview.prop_name) {
      const currentTime = new Date().toISOString();
      if (isEditing && newReview.id) {
        setReviews((prev) => prev.map((r) => r.id === newReview.id ? { ...r, reviewer_name: newReview.reviewer_name, product_id: newReview.product_id, prop_name: newReview.prop_name, rating: newReview.rating, description: newReview.description, updated_at: currentTime } : r));
      } else {
        const review = { id: Date.now(), product_id: newReview.product_id, reviewer_name: newReview.reviewer_name, prop_name: newReview.prop_name, rating: newReview.rating, description: newReview.description, created_at: currentTime, updated_at: currentTime, is_deleted: false };
        setReviews((prev) => [...prev, review]);
      }
      handleCloseModal();
    }
  };

  const ReviewCard = ({ review }) => {
    const isActive = activeActionCard === review.id;
    const isExpanded = expandedReviewId === review.id;
    const needsReadMore = (review.description || "").length > 90;

    return (
      <>
        <Card sx={{ width: "100%", height: "100%", minHeight: 150, display: "flex", flexDirection: "column", boxShadow: 2, transition: "all 0.3s ease-in-out", position: "relative", overflow: "hidden", background: "linear-gradient(to bottom, #ffffff 10%, #e6ccfa 60%, #cd8cfc 90%)", "&:hover": { transform: "translateY(-2px)", boxShadow: 4, cursor: "pointer" } }}>
          <CardContent sx={{ flexGrow: 1, pb: 1, position: "relative" }}>
            <Typography variant="caption" color="text.secondary" sx={{ position: "absolute", top: 8, right: 16, fontSize: "0.8rem" }}>
              {formatDate(review.updated_at)}
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} mt={2}>
              <Box display="flex" flexGrow={1}>
                <Avatar sx={{ bgcolor: "#4b0082", mr: 2, mt: 0.5, width: 40, height: 40 }}>
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="h6" component="div" fontWeight="medium">{review.reviewer_name}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>Firm: <strong>{review.prop_name}</strong></Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: getGradeColor(review.rating) }}>{getGradeDisplay(review.rating)}</Typography>
                </Box>
              </Box>
              {adminLoggedIn && (
                <IconButton size="small" onClick={() => setActiveActionCard(review.id)} sx={{ ml: 1, alignSelf: "flex-start", visibility: isActive ? "hidden" : "visible", "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" }, zIndex: 5 }}>
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: isExpanded ? "unset" : 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5, maxHeight: isExpanded ? "none" : "4.5em" }}>
              {review.description}
            </Typography>
            {needsReadMore && !isExpanded && (
              <Button size="small" onClick={() => setExpandedReviewId(review.id)} sx={{ mt: 1, textTransform: "capitalize", color: "#4b0082", fontWeight: "bold", p: 0, minWidth: "auto", "&:hover": { backgroundColor: "transparent", color: "#8f7900" } }}>Read More</Button>
            )}
          </CardContent>

          {isActive && (
            <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.20)", backdropFilter: "blur(4px)", zIndex: 10, gap: 2, p: 2 }}>
              <IconButton size="small" onClick={() => setActiveActionCard(null)} sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.1)", "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" } }}>
                <CloseIcon />
              </IconButton>
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => handleEdit(review)} sx={{ minWidth: 110, borderRadius: 2, textTransform: "capitalize", border: "1px solid #fff", "&:hover": { border: "1px solid #ffd700" } }}>Edit</Button>
              <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(review)} sx={{ minWidth: 110, borderRadius: 2, textTransform: "capitalize", border: "1px solid #fff", "&:hover": { border: "1px solid #ffd700" } }}>Delete</Button>
            </Box>
          )}
        </Card>

        <Dialog open={isExpanded} onClose={() => setExpandedReviewId(review.id)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="h2">Review Details</Typography>
              <IconButton onClick={() => setExpandedReviewId(review.id)} size="small"><CloseIcon /></IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: "#4b0082", mr: 2, width: 48, height: 48 }}>
                {review.reviewer_name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" component="div" fontWeight="medium">{review.reviewer_name}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>Firm: <strong>{review.prop_name}</strong></Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: getGradeColor(review.rating) }}>{getGradeDisplay(review.rating)}</Typography>
                <Typography variant="body2" color="text.secondary">Updated: {formatDate(review.updated_at)}</Typography>
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {review.description}
            </Typography>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, flexDirection: { xs: "column", md: "row" }, bgcolor: "rgba(255,255,255,0.12)", borderRadius: 2, overflow: "hidden", p: { xs: 2, md: 4 }, my: { md: 6 }, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #cecece" }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "white", lineHeight: "2.25rem", mb: 2 }}>Our Reviews</Typography>
          <Typography variant="body2" sx={{ color: "#cecece" }}>Read what our critics have to say about their experience with trading firms.</Typography>
        </Box>

        {/* Keep admin button in header if you want */}
        {adminLoggedIn && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal} sx={{ borderRadius: 2, textTransform: "capitalize", bgcolor: "#4b0082", px: 2, py: 1.5, border: "1px solid #fff", "&:hover": { bgcolor: "#4b0082b2", border: "1px solid #ffd700" } }}>
            Write a Review
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <MuiFormControl size="small" sx={{ minWidth: 200, borderRadius: 1, "& .MuiInputLabel-root": { color: "white" }, "& .MuiSelect-select": { color: "white" }, "& .MuiSvgIcon-root": { color: "white" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bbb" } }}>
          <InputLabel id="rating-filter-label">
            <Box display="flex" alignItems="center">
              <FilterListIcon sx={{ fontSize: 18, mr: 0.5, color: "white" }} />
              Filter by Rating
            </Box>
          </InputLabel>
          <Select labelId="rating-filter-label" value={ratingFilter} label="Filter by Rating" onChange={handleRatingFilterChange} sx={{ color: "white" }}>
            <MenuItem value="all">All Ratings</MenuItem>
            {GRADE_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        </MuiFormControl>

        <MuiFormControl size="small" sx={{ minWidth: 220, borderRadius: 1, "& .MuiInputLabel-root": { color: "white" }, "& .MuiSelect-select": { color: "white" }, "& .MuiSvgIcon-root": { color: "white" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bbb" } }}>
          <InputLabel id="prop-name-filter-label">
            <Box display="flex" alignItems="center">
              <FilterListIcon sx={{ fontSize: 18, mr: 0.5, color: "white" }} />
              Filter by Firm
            </Box>
          </InputLabel>
          <Select labelId="prop-name-filter-label" value={propNameFilter} label="Filter by Firm" onChange={handlePropNameFilterChange} sx={{ color: "white" }}>
            <MenuItem value="all">All Trading Firms</MenuItem>
            {TRADING_FIRMS.map((f) => (
              <MenuItem key={f.id} value={f.name}>{f.name}</MenuItem>
            ))}
          </Select>
        </MuiFormControl>

        {/* CTA right after filters, same theme */}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleWriteClick} variant="contained" sx={{ borderRadius: 2, textTransform: "capitalize", bgcolor: "#4b0082", px: 2, py: 1.2, border: "1px solid #fff", "&:hover": { bgcolor: "#4b0082b2", border: "1px solid #ffd700" } }}>
          Write a Review
        </Button>
      </Box>

      {/* Auth hint row (only when not logged in) */}
      {!isLoggedIn && (
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", bgcolor: "rgba(255,255,255,0.12)", border: "1px solid #cecece", borderRadius: 2, p: 2 }}>
          <Typography sx={{ color: "#cecece" }}>Please log in to write a review.</Typography>
          <Button size="small" variant="outlined" onClick={() => window.location.assign("/login")} sx={{ textTransform: "none", borderColor: "#fff", color: "#fff" }}>Login</Button>
          <Typography sx={{ color: "#cecece" }}>|</Typography>
          <Typography sx={{ color: "#cecece" }}>Don't have an account?</Typography>
          <Button size="small" variant="contained" onClick={() => window.location.assign("/register")} sx={{ textTransform: "none", bgcolor: "#4b0082", border: "1px solid #fff", "&:hover": { bgcolor: "#4b0082b2", border: "1px solid #ffd700" } }}>Create account</Button>
        </Box>
      )}

      {/* Results count */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <Typography variant="body2" sx={{ color: "#cecece" }}>
          Showing {Math.min(displayedReviews.length, filteredReviews.length)} of {filteredReviews.length} reviews
          {ratingFilter !== "all" && ` (filtered by ${getGradeDisplay(ratingFilter)})`}
          {propNameFilter !== "all" && ` (${propNameFilter})`}
        </Typography>
      </Box>

      {/* Reviews Grid (fixed to stable Grid API) */}
      <Grid container spacing={3} wrap="wrap">
        {displayedReviews.map((review) => (
          <Grid item xs={12} sm={6} lg={4} key={review.id}>
            <ReviewCard review={review} />
          </Grid>
        ))}
      </Grid>

      {filteredReviews.length > 9 && !showAllReviews && (
        <Box textAlign="center" mt={4}>
          <Button variant="contained" onClick={handleViewAllReviews} size="large" sx={{ borderRadius: 2, textTransform: "capitalize", bgcolor: "#000", px: 2, py: 1.5, border: "1px solid #fff", "&:hover": { bgcolor: "#4b0082b2", border: "1px solid #ffd700" } }}>
            View All Reviews ({filteredReviews.length})
          </Button>
        </Box>
      )}

      {filteredReviews.length === 0 && (
        <Box textAlign="center" py={6} sx={{ bgcolor: "#ffffff50", borderRadius: 2, mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No reviews found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {ratingFilter === "all" && propNameFilter === "all" ? "Be the first to share your experience!" : `No reviews found with the current filters`}
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedReview?.reviewer_name}'s review for {selectedReview?.prop_name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ textTransform: "capitalize" }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ borderRadius: 2, textTransform: "capitalize", border: "1px solid #fff", "&:hover": { border: "1px solid #ffd700" } }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Write/Edit Review Modal */}
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="write-review-modal">
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, maxWidth: "90vw", bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2, outline: "none", maxHeight: "90vh", overflowY: "auto" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" component="h2">{isEditing ? "Edit Review" : "Write a Review"}</Typography>
            <IconButton onClick={handleCloseModal} size="small"><CloseIcon /></IconButton>
          </Box>

          <Stack spacing={3}>
            <TextField fullWidth label="Your Name" value={newReview.reviewer_name} onChange={(e) => handleInputChange("reviewer_name", e.target.value)} variant="outlined" required />

            <FormControl fullWidth required>
              <InputLabel id="prop-name-label">Trading Firm</InputLabel>
              <Select labelId="prop-name-label" value={newReview.prop_name} label="Trading Firm" onChange={(e) => handleInputChange("prop_name", e.target.value)}>
                {TRADING_FIRMS.map((firm) => (
                  <MenuItem key={firm.id} value={firm.name}>{firm.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset" required>
              <FormLabel component="legend">Your Rating</FormLabel>
              <RadioGroup value={newReview.rating} onChange={(e) => handleInputChange("rating", e.target.value)} sx={{ mt: 1 }}>
                {GRADE_OPTIONS.map((option) => (
                  <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.9rem" } }} />
                ))}
              </RadioGroup>
            </FormControl>

            <TextField fullWidth label="Your Review" value={newReview.description} onChange={(e) => handleInputChange("description", e.target.value)} variant="outlined" multiline rows={4} placeholder="Share your experience with this trading firm..." required />

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmitReview} disabled={!newReview.reviewer_name || !newReview.description || !newReview.rating || !newReview.prop_name}>{isEditing ? "Update Review" : "Submit Review"}</Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
};

export default Reviews;
