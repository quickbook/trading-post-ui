import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import { Search, Email, Person, Phone, LocationOn } from "@mui/icons-material";

// Mock users data - in real app, this would come from props or API
const mockUsers = [
  {
    id: 1,
    gmail: "john.doe@example.com",
    userName: "johndoe",
    firstName: "John",
    middleName: "Michael",
    lastName: "Doe",
    contactNumber: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    stateName: "NY",
    zipCode: "10001",
    countryName: "United States",
    active: true,
    joinedDate: "2024-01-15",
  },
  {
    id: 2,
    gmail: "jane.smith@example.com",
    userName: "janesmith",
    firstName: "Jane",
    middleName: "Elizabeth",
    lastName: "Smith",
    contactNumber: "+1 (555) 987-6543",
    address: "456 Oak Avenue",
    city: "Los Angeles",
    stateName: "CA",
    zipCode: "90001",
    countryName: "United States",
    active: true,
    joinedDate: "2024-02-20",
  },
  {
    id: 3,
    gmail: "robert.wilson@example.com",
    userName: "robwilson",
    firstName: "Robert",
    middleName: "",
    lastName: "Wilson",
    contactNumber: "+44 20 1234 5678",
    address: "789 High Street",
    city: "London",
    stateName: "",
    zipCode: "SW1A 1AA",
    countryName: "United Kingdom",
    active: true,
    joinedDate: "2024-03-10",
  },
  {
    id: 4,
    gmail: "maria.garcia@example.com",
    userName: "mariag",
    firstName: "Maria",
    middleName: "Isabel",
    lastName: "Garcia",
    contactNumber: "+34 91 123 4567",
    address: "101 Gran Via",
    city: "Madrid",
    stateName: "Madrid",
    zipCode: "28013",
    countryName: "Spain",
    active: false,
    joinedDate: "2024-01-05",
  },
  {
    id: 5,
    gmail: "alex.chen@example.com",
    userName: "alexchen",
    firstName: "Alex",
    middleName: "",
    lastName: "Chen",
    contactNumber: "+86 10 1234 5678",
    address: "789 Nanjing Road",
    city: "Shanghai",
    stateName: "Shanghai",
    zipCode: "200000",
    countryName: "China",
    active: true,
    joinedDate: "2024-02-28",
  },
  {
    id: 6,
    gmail: "sarah.miller@example.com",
    userName: "sarahm",
    firstName: "Sarah",
    middleName: "Anne",
    lastName: "Miller",
    contactNumber: "+1 (555) 456-7890",
    address: "321 Pine Street",
    city: "Chicago",
    stateName: "IL",
    zipCode: "60601",
    countryName: "United States",
    active: true,
    joinedDate: "2024-03-25",
  },
];

const ViewAllUsers = () => {
  const [users] = useState(mockUsers); // In real app, users would come from props or API
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Get unique countries for filter
  const countries = useMemo(() => {
    return [...new Set(users.map((user) => user.countryName))].sort();
  }, [users]);

  // Get unique user statuses (active/inactive) for filter
  const userStatuses = useMemo(() => {
    return ["Active", "Inactive"]; // Simplified status
  }, []);

  // Filter users based on search and filter criteria
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.gmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        countryFilter === "" || user.countryName === countryFilter;
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "Active" ? user.active : !user.active);

      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [users, searchTerm, countryFilter, statusFilter]);

  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCountryFilter("");
    setStatusFilter("");
  };

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
      {filteredUsers.length === 0 ? (
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
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
                      {getUserInitials(user.firstName, user.lastName)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        @{user.userName}
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
                        <strong>Email:</strong> {user.gmail}
                      </Typography>
                    </Box>

                    {user.contactNumber && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Phone
                          sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          <strong>Phone:</strong> {user.contactNumber}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Person
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        <strong>Full Name:</strong> {user.firstName}{" "}
                        {user.middleName} {user.lastName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOn
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        <strong>Location:</strong> {user.city}, {user.stateName}{" "}
                        {user.zipCode}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Address Section */}
                  {user.address && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Address:</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.address}
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
                      label={user.countryName}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />

                    <Chip
                      label={getStatusText(user.active)}
                      color={getStatusColor(user.active)}
                      size="small"
                    />
                  </Box>

                  {/* Joined Date */}
                  {user.joinedDate && (
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
                      Joined: {new Date(user.joinedDate).toLocaleDateString()}
                    </Typography>
                  )}
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
