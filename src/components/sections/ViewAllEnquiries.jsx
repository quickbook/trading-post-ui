import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Email,
  Business,
  Description,
  WhatsApp,
  CalendarToday,
  Visibility,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEnquiries,
  getAllEnquiriesError,
  getAllEnquiriesStatus,
  selectAllEnquiries,
} from "../../features/auth/getAllEnquiriesSlice";

// Mock enquiries data - without status field
const mockEnquiries = [
  {
    id: 1,
    name: "AKHIL GANDEPALLI",
    email: "subbuvmca@gmail.com",
    firm: "Alpha Trading Firm",
    whatsapp: "9705716171",
    services: "Prop Firm Challenge",
    aboutFirm: "Looking for trading challenges with good profit split",
    consent: true,
    createdAt: "2026-01-09T12:51:57.516056Z",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    firm: "Smith Trading Co.",
    whatsapp: "+1-555-123-4567",
    services: "Funding Program",
    aboutFirm: "Established trading firm looking for new funding opportunities",
    consent: true,
    createdAt: "2026-01-08T10:30:25.123456Z",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    firm: "MG Investments",
    whatsapp: "+34-612-345-678",
    services: "Trading Platform Integration",
    aboutFirm: "Need integration with multiple trading platforms",
    consent: true,
    createdAt: "2026-01-07T14:20:15.789012Z",
  },
  {
    id: 4,
    name: "Robert Chen",
    email: "robert.chen@example.com",
    firm: "Chen Capital",
    whatsapp: "+86-138-0013-8000",
    services: "Risk Management Solutions",
    aboutFirm: "Seeking advanced risk management tools for prop trading",
    consent: true,
    createdAt: "2026-01-06T09:15:30.456789Z",
  },
  {
    id: 5,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    firm: "Williams Trading Group",
    whatsapp: "+44-7700-900123",
    services: "Educational Resources",
    aboutFirm: "Looking for trading education materials and courses",
    consent: true,
    createdAt: "2026-01-05T16:45:10.234567Z",
  },
  {
    id: 6,
    name: "David Johnson",
    email: "david.j@example.com",
    firm: "DJ Trading Solutions",
    whatsapp: "+61-412-345-678",
    services: "API Access",
    aboutFirm: "Need API access for automated trading systems",
    consent: false,
    createdAt: "2026-01-04T11:25:40.345678Z",
  },
  {
    id: 7,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    firm: "Wilson Capital Management",
    whatsapp: "+1-415-555-7890",
    services: "Account Management",
    aboutFirm: "Looking for professional account management services",
    consent: true,
    createdAt: "2026-01-03T13:35:55.123456Z",
  },
  {
    id: 8,
    name: "Michael Brown",
    email: "michael.b@example.com",
    firm: "Brown Financial",
    whatsapp: "+49-151-12345678",
    services: "Multi-Account Setup",
    aboutFirm: "Need help setting up multiple trading accounts",
    consent: true,
    createdAt: "2026-01-02T08:50:20.987654Z",
  },
  {
    id: 9,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    firm: "Anderson Trading",
    whatsapp: "+1-212-555-1234",
    services: "Market Analysis",
    aboutFirm: "Need comprehensive market analysis reports",
    consent: true,
    createdAt: "2025-12-20T09:10:15.123456Z",
  },
  {
    id: 10,
    name: "Thomas Lee",
    email: "thomas.lee@example.com",
    firm: "Lee Capital",
    whatsapp: "+82-10-1234-5678",
    services: "Portfolio Management",
    aboutFirm: "Looking for portfolio management services",
    consent: true,
    createdAt: "2025-12-15T14:30:45.678901Z",
  },
];

const ViewAllEnquiries = () => {
  const dispatch = useDispatch();
  //const enquiries = mockEnquiries;
  const allEnquiries = useSelector(selectAllEnquiries) ?? [];
  const [enquiries, setEnquiries] = useState(allEnquiries);
  const [status, setStatus] = useState(useSelector(getAllEnquiriesStatus));
  const [error, setError] = useState(useSelector(getAllEnquiriesError));

  const [searchTerm, setSearchTerm] = useState("");
  const [firmFilter, setFirmFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("most_recent");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const initEnquiriesRef = useRef(false);

  // Fetch enquiries only once
  useEffect(() => {
    if (!initEnquiriesRef.current) {
      if (!allEnquiries.length) {
        dispatch(getAllEnquiries())
          .unwrap()
          .then((e) => {
            setEnquiries(e);
            setStatus("succeeded");
          })
          .catch((e) => {
            setStatus("failed");
            setError(e);
          });
      }
      initEnquiriesRef.current = true;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">
          Failed to load users: {error?.message || "Unknown error"}
        </Typography>
      </Paper>
    );
  }

  // Get unique firms for filter
  const firms = useMemo(() => {
    return [...new Set(enquiries.map((enquiry) => enquiry.firm))].sort();
  }, [enquiries]);

  // Date filter options
  const dateOptions = [
    { value: "most_recent", label: "Most Recent" },
    { value: "today", label: "Today" },
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "last_30_days", label: "Last 30 Days" },
    { value: "old", label: "Old Enquiries" },
    { value: "all", label: "All Enquiries" },
  ];

  // Filter enquiries based on search and filter criteria
  const filteredEnquiries = useMemo(() => {
    let filtered = [...enquiries];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enquiry) =>
          enquiry.name.toLowerCase().includes(term) ||
          enquiry.email.toLowerCase().includes(term) ||
          enquiry.firm.toLowerCase().includes(term) ||
          enquiry.services.toLowerCase().includes(term) ||
          enquiry.aboutFirm.toLowerCase().includes(term)
      );
    }

    // Apply firm filter
    if (firmFilter) {
      filtered = filtered.filter((enquiry) => enquiry.firm === firmFilter);
    }

    // Apply date filter
    const now = new Date();
    switch (dateFilter) {
      case "today":
        filtered = filtered.filter((enquiry) => {
          const enquiryDate = new Date(enquiry.createdAt);
          return enquiryDate.toDateString() === now.toDateString();
        });
        break;

      case "last_7_days":
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter((enquiry) => {
          const enquiryDate = new Date(enquiry.createdAt);
          return enquiryDate >= sevenDaysAgo;
        });
        break;

      case "last_30_days":
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        filtered = filtered.filter((enquiry) => {
          const enquiryDate = new Date(enquiry.createdAt);
          return enquiryDate >= thirtyDaysAgo;
        });
        break;

      case "old":
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
        filtered = filtered.filter((enquiry) => {
          const enquiryDate = new Date(enquiry.createdAt);
          return enquiryDate < ninetyDaysAgo;
        });
        break;

      case "most_recent":
      default:
        // Most recent first (already sorted by date in mock data)
        break;
    }

    return filtered;
  }, [enquiries, searchTerm, firmFilter, dateFilter]);

  const getConsentStatus = (consent) => {
    return consent ? (
      <Chip
        label="Consent Given"
        size="small"
        color="success"
        variant="outlined"
      />
    ) : (
      <Chip label="No Consent" size="small" color="error" variant="outlined" />
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFirmFilter("");
    setDateFilter("most_recent");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} week${
        Math.floor(diffInDays / 7) !== 1 ? "s" : ""
      } ago`;
    } else {
      return `${Math.floor(diffInDays / 30)} month${
        Math.floor(diffInDays / 30) !== 1 ? "s" : ""
      } ago`;
    }
  };

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedEnquiry(null);
  };

  const initiateWhatsApp = (number) => {
    const cleanedNumber = number.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanedNumber}`, "_blank");
  };

  const sendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  // Sort enquiries by date (most recent first)
  const sortedEnquiries = useMemo(() => {
    return [...filteredEnquiries].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filteredEnquiries]);

  return (
    <Box sx={{ width: { xs: "100%", md: 960, xl: "75vw" } }}>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          All Enquiries
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Showing {sortedEnquiries.length} of {enquiries.length} enquiries
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          View and manage all customer enquiries and contact requests
        </Typography>

        {/* Filter Section */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Enquiries
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="flex-end"
          >
            {/* Search Input */}
            <TextField
              label="Search Enquiries"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200, flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by name, email, firm, or services..."
            />

            {/* Firm Filter */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Firm</InputLabel>
              <Select
                value={firmFilter}
                label="Firm"
                onChange={(e) => setFirmFilter(e.target.value)}
              >
                <MenuItem value="">All Firms</MenuItem>
                {firms.map((firm) => (
                  <MenuItem key={firm} value={firm}>
                    {firm}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Filter */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Date Filter</InputLabel>
              <Select
                value={dateFilter}
                label="Date Filter"
                onChange={(e) => setDateFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarToday />
                  </InputAdornment>
                }
              >
                {dateOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear Filters Button */}
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{ minWidth: 120, padding: "14px" }}
            >
              Clear Filters
            </Button>
          </Stack>

          {/* Active Filters Display */}
          {(searchTerm || firmFilter || dateFilter !== "most_recent") && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm("")}
                  size="small"
                  sx={{ bgcolor: "#4b008226" }}
                />
              )}
              {firmFilter && (
                <Chip
                  label={`Firm: ${firmFilter}`}
                  onDelete={() => setFirmFilter("")}
                  size="small"
                  sx={{ bgcolor: "#4b008226" }}
                />
              )}
              {dateFilter !== "most_recent" && (
                <Chip
                  label={`Date: ${
                    dateOptions.find((o) => o.value === dateFilter)?.label
                  }`}
                  onDelete={() => setDateFilter("most_recent")}
                  size="small"
                  sx={{ bgcolor: "#4b008226" }}
                />
              )}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Enquiries Grid */}
      {sortedEnquiries.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No enquiries match your search criteria.
          </Typography>
          <Button onClick={clearFilters} sx={{ mt: 2 }}>
            Clear all filters
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3} sx={{ placeItems: "center" }}>
          {sortedEnquiries.map((enquiry) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={enquiry.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease-in-out",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Enquiry Header */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {enquiry.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {enquiry.firm}
                    </Typography>

                    {/* Time ago indicator */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <CalendarToday
                        sx={{ fontSize: 14, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {getTimeAgo(enquiry.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Contact Information */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Email
                        sx={{
                          fontSize: 16,
                          mr: 1,
                          color: "text.secondary",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" noWrap>
                        {enquiry.email}
                      </Typography>
                    </Box>

                    {enquiry.whatsapp && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <WhatsApp
                          sx={{
                            fontSize: 16,
                            mr: 1,
                            color: "text.secondary",
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2">
                          {enquiry.whatsapp}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Business
                        sx={{
                          fontSize: 16,
                          mr: 1,
                          color: "text.secondary",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2">
                        <strong>Service:</strong> {enquiry.services}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                    >
                      <Description
                        sx={{
                          fontSize: 16,
                          mr: 1,
                          color: "text.secondary",
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        <strong>About Firm:</strong>{" "}
                        {enquiry.aboutFirm.length > 50
                          ? `${enquiry.aboutFirm.substring(0, 50)}...`
                          : enquiry.aboutFirm}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Actions and Consent Status */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    {getConsentStatus(enquiry.consent)}

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(enquiry)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Email">
                        <IconButton
                          size="small"
                          onClick={() => sendEmail(enquiry.email)}
                        >
                          <Email fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {enquiry.whatsapp && (
                        <Tooltip title="WhatsApp">
                          <IconButton
                            size="small"
                            onClick={() => initiateWhatsApp(enquiry.whatsapp)}
                          >
                            <WhatsApp fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Enquiry Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedEnquiry && (
          <>
            <DialogTitle>
              Enquiry Details
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Personal Information
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong> {selectedEnquiry.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong> {selectedEnquiry.email}
                    </Typography>
                    {selectedEnquiry.whatsapp && (
                      <Typography variant="body2" gutterBottom>
                        <strong>WhatsApp:</strong> {selectedEnquiry.whatsapp}
                      </Typography>
                    )}
                    <Typography variant="body2" gutterBottom>
                      <strong>Consent:</strong>{" "}
                      {selectedEnquiry.consent ? "Given" : "Not Given"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Firm Information
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Firm Name:</strong> {selectedEnquiry.firm}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Services Required:</strong>{" "}
                      {selectedEnquiry.services}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Submitted:</strong>{" "}
                      {formatDate(selectedEnquiry.createdAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    About Firm
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, bgcolor: "background.default" }}
                  >
                    <Typography variant="body2">
                      {selectedEnquiry.aboutFirm}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                onClick={() => sendEmail(selectedEnquiry.email)}
                startIcon={<Email />}
              >
                Reply via Email
              </Button>
              {selectedEnquiry.whatsapp && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => initiateWhatsApp(selectedEnquiry.whatsapp)}
                  startIcon={<WhatsApp />}
                >
                  WhatsApp
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Enquiries Statistics */}
      {sortedEnquiries.length > 0 && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Enquiries Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" color="primary">
                  {enquiries.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Enquiries
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" color="success.main">
                  {enquiries.filter((e) => e.consent).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Consent Given
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" color="info.main">
                  {firms.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Unique Firms
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" color="warning.main">
                  {new Set(enquiries.map((e) => e.services)).size}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Service Types
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ViewAllEnquiries;
