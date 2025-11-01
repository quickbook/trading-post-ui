import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Edit,
  Delete,
  Star,
  Handshake,
  VerifiedUser,
} from "@mui/icons-material";
import { cardData } from "../../../CardsData";

const ViewAllFirms = ({ firms, onEdit, onDelete }) => {
  const getBadgeIcon = (firmType) => {
    switch (firmType) {
      case "premium":
        return <Star sx={{ fontSize: 16 }} />;
      case "trusted":
        return <VerifiedUser sx={{ fontSize: 16 }} />;
      case "partner":
      default:
        return <Handshake sx={{ fontSize: 16 }} />;
    }
  };

  const getBadgeColor = (firmType) => {
    switch (firmType) {
      case "premium":
        return "#ffd700";
      case "trusted":
        return "#4b0082";
      case "partner":
      default:
        return "#2e7d32";
    }
  };

  if (firms.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No firms added yet. Click "Add New Firm" to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Firms ({firms.length})
      </Typography>

      <Grid container spacing={3} sx={{ placeItems: "center" }}>
        {firms.map((firm) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={firm.id}>
            <Card
              sx={{
                position: "relative",
                border: firm.updated
                  ? "2px solid #4caf50"
                  : "1px solid #e0e0e0",
                overflow: "visible",
                "&:hover": {
                  //boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  transform: "scale(1.02)",
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              {/* Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  right: 12,
                  backgroundColor: getBadgeColor(firm.firmType),
                  color: firm.firmType === "premium" ? "#000" : "#fff",
                  borderRadius: "12px",
                  padding: "4px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: "700",
                  fontSize: "12px",
                  zIndex: 1,
                }}
              >
                {getBadgeIcon(firm.firmType)}
                <Typography
                  sx={{ fontSize: "12px", fontWeight: "700", lineHeight: 1 }}
                >
                  {firm.firmType?.toUpperCase()}
                </Typography>
              </Box>

              {firm.updated && (
                <Chip
                  label="Recently Updated"
                  color="success"
                  size="small"
                  sx={{ position: "absolute", top: -8, left: 12 }}
                />
              )}

              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {firm.logo && (
                    <img
                      src={firm.logo}
                      alt={firm.title}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "40%",
                        objectFit: "cover",
                        marginRight: 12,
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  )}
                  <Typography variant="h6" component="div">
                    {firm.title}
                  </Typography>
                </Box>

                <Typography color="textSecondary" gutterBottom>
                  {firm.profitSplit}% Profit Split | $
                  {firm.account.toLocaleString()} Account
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Code:</strong> {firm.code}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Rating:</strong> {firm.rating} ({firm.allRatings}{" "}
                  ratings)
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Country:</strong> {firm.country}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Assets:</strong>
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {firm.assets?.map((asset) => (
                      <Chip
                        key={asset}
                        label={asset}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(firm)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => onDelete(firm.id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>

                  <Chip
                    label={firm.isActive ? "Active" : "Inactive"}
                    color={firm.isActive ? "success" : "default"}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ViewAllFirms;
