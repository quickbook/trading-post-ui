import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import { Search, Email, Person, Phone, LocationOn } from "@mui/icons-material";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import {
  getAllUsers,
  selectAllUsers,
  getUsersStatus,
  getUsersError,
} from "../../features/auth/getAllUsersSlice";

import { useDispatch, useSelector } from "react-redux";

const ViewAllUsers = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers) ?? [];
  const [users, setUsers] = useState(allUsers);
  const [status, setStatus] = useState(useSelector(getUsersStatus));
  const [error, setError] = useState(useSelector(getUsersError));

  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const initUsersRef = useRef(false);

  useEffect(() => {
    if (!initUsersRef.current) {
      if (!allUsers.length) {
        dispatch(getAllUsers())
          .unwrap()
          .then((e) => {
            setUsers(e.data);
            setStatus("succeeded");
          })
          .catch((e) => {
            setStatus("failed");
            setError(e);
          });
      }
      initUsersRef.current = true;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const countries = useMemo(
    () => [...new Set(users.map((u) => u?.countryName).filter(Boolean))],
    [users]
  );
  const userStatuses = ["Active", "Inactive"];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user?.gmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user?.firstName} ${user?.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCountry =
        !countryFilter || user?.countryName === countryFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "Active"
          ? user?.active !== false
          : user?.active === false);

      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [users, searchTerm, countryFilter, statusFilter]);

  const getUserInitials = (f, l) => `${f?.[0] || ""}${l?.[0] || ""}`;

  const clearFilters = () => {
    setSearchTerm("");
    setCountryFilter("");
    setStatusFilter("");
  };

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

  const getStatusColor = (status) => {
    return status ? "success" : "error";
  };

  const getStatusText = (status) => {
    return status ? "Active" : "Inactive";
  };

  return (
    <Box sx={{ width: { xs: "100%", md: 960, xl: "75vw" } }}>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          All Users
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Showing {filteredUsers.length} of {users.length} users
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          View and manage all registered users
        </Typography>

        {/* Filter Section */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Users
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="flex-end"
          >
            {/* Search Input */}
            <TextField
              label="Search Users"
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
              placeholder="Search by email, username, or name..."
            />

            {/* Country Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={countryFilter}
                label="Country"
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <MenuItem value="">All Countries</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {userStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
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
          {(searchTerm || countryFilter || statusFilter) && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm("")}
                  size="small"
                  sx={{ bgcolor: "#4b008226" }}
                />
              )}
              {countryFilter && (
                <Chip
                  label={`Country: ${countryFilter}`}
                  onDelete={() => setCountryFilter("")}
                  size="small"
                  sx={{ bgcolor: "#4b008226" }}
                />
              )}
              {statusFilter && (
                <Chip
                  label={`Status: ${statusFilter}`}
                  onDelete={() => setStatusFilter("")}
                  size="small"
                  sx={{ bgcolor: "#4b008226" }}
                />
              )}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Users Grid */}
      {status !== "succeeded" ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No users match your search criteria.
          </Typography>
          <Button onClick={clearFilters} sx={{ mt: 2 }}>
            Clear all filters
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user?.id}>
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
                  {/* User Header with Avatar */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: "#4b0082",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        mr: 2,
                      }}
                    >
                      {getUserInitials(user?.firstName, user?.lastName)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {user?.firstName} {user?.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        @{user?.userName}
                      </Typography>
                    </Box>
                  </Box>

                  {/* User Details */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Email
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        <strong>Email:</strong> {user?.gmail}
                      </Typography>
                    </Box>

                    {user?.contactNumber && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Phone
                          sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          <strong>Phone:</strong> {user?.contactNumber}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Person
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        <strong>Full Name:</strong> {user?.firstName}{" "}
                        {user?.middleName} {user?.lastName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <AccessibilityIcon
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        <strong>Role:</strong> {user?.roleName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOn
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        <strong>Location:</strong> {user?.city},{" "}
                        {user?.stateName} {user?.zipCode}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Address Section */}
                  {user?.address && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Address:</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user?.address}
                      </Typography>
                    </Box>
                  )}

                  {/* Country and Status */}
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
                    <Chip
                      label={user?.countryName}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />

                    <Chip
                      label={getStatusText(user?.active ?? true)}
                      color={getStatusColor(user?.active ?? true)}
                      size="small"
                    />
                  </Box>

                  {/* Joined Date */}
                  {/* {user?.joinedDate && (
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        display: "block",
                        mt: 2,
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                    >
                      Joined: {new Date(user?.joinedDate).toLocaleDateString()}
                    </Typography>
                  )} */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Users Statistics */}
      {filteredUsers.length > 0 && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Users Statistics
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
                  {users.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Users
                </Typography>
              </Box>
            </Grid>
            {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" color="success.main">
                  {users.filter((u) => u.active).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Users
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
                <Typography variant="h4" color="error.main">
                  {users.filter((u) => !u.active).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Inactive Users
                </Typography>
              </Box>
            </Grid> */}
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
                  {countries.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Countries
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ViewAllUsers;
