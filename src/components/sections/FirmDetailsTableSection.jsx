import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Tab,
  Tabs,
  TablePagination,
  Pagination,
  Typography,
  Avatar,
} from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { cardData } from "/CardsData";
import { foreignNumberSystem } from "../commonFuctions/CommonFunctions";
import FirmsFilterSection from "./FirmsFilterSection";
import { Link, useNavigate } from "react-router-dom";
import { BadgeContainer, getBadgeStyles } from "./TradingCards";

export const platformSources = {
  MT: "/platforms/mt5.webp",
  MT5: "/platforms/mt5.webp",
  MT4: "/platforms/mt5.webp",
  cTrader: "/platforms/ctrader.webp",
  "Match Trader": "/platforms/matchtrader.webp",
  "Trade Locker": "/platforms/trade-locker.webp",
  "Project-X": "/platforms/project-x.webp",
};

const tableHeaders = [
  { label: "Firm" },
  { label: "Rating" },
  { label: "Country" },
  { label: "Assets" },
  { label: "Platforms" },
  { label: "Max Allocations" },
  { label: "Actions" },
];
const StyledTable = styled(Table)(({ theme }) => ({
  border: "2px solid #4b0082",
  "& .MuiTableCell-root": {
    borderRight: "1px solid #49454f",
    padding: 0,
    fontFamily: "'Lora', Helvetica",
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableRow-root": {
    height: "91px",
    borderBottom: "none",
  },
  "& .MuiTableCell-head": {
    height: "54px",
    borderRight: "1px solid #49454f",
    fontFamily: "'Montserrat', Helvetica",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "14px",
    textAlign: "center",
    letterSpacing: "0",
    "&:last-child": {
      borderRight: "none",
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: "108px",
  border: "2px solid #4b0082",
  borderTop: "none",
  "&:last-child": {
    borderBottom: "2px solid #4b0082",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "110px",
  height: "auto",
  backgroundColor: "#acacac54",
  borderRadius: "50px",
  fontFamily: "'Lora', Helvetica",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "16px",
  color: "white",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#ffffff75",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: "17px",
  backgroundColor: "#ffffff5c",
  borderRadius: "20px",
  fontFamily: "'Lora', Helvetica",
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "12px",
  color: "white",
  "& .MuiChip-label": {
    padding: "5px 12px",
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const FirmDetailsTableSection = () => {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const [cardDetails, setCardDetails] = useState(cardData);
  const navigate = useNavigate();
  const rowsPerPage = 8;

  function filterFirmsByTab(index) {
    switch (index) {
      case 0:
        return setCardDetails(cardData); // All Firms
      case 1:
        return setCardDetails(
          cardData.filter((firm) => firm.rating === "A+" || firm.rating === "A")
        ); // Top Rated
      case 2:
        return setCardDetails(
          cardData.filter(
            (firm) =>
              firm.rating === "B" || firm.rating === "C" || firm.rating === "D"
          )
        ); // Challengers
      case 3:
        return navigate("/comparefirms/challenges");
      default:
        setCardDetails(cardData);
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    filterFirmsByTab(newValue);
    setPage(1); // Reset to first page on tab change
  };

  const paginatedUsers = useMemo(() => {
    return cardDetails.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [cardDetails, page, rowsPerPage]);

  const start = useMemo(() => {
    return (page - 1) * rowsPerPage + 1;
  }, [cardDetails, page, rowsPerPage]);

  const end = useMemo(() => {
    return Math.min(page * rowsPerPage, cardDetails.length);
  }, [cardDetails.length, page, rowsPerPage]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "start",
        position: "relative",
        bgcolor: "#000",
        padding: "8px 24px",
      }}
    >
      <FirmsFilterSection setCardDetails={setCardDetails} setPage={setPage} />
      <Box sx={{ width: "100%", mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="secondary"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#cecece", // underline color
                height: "3px", // thickness
              },
            }}
          >
            <Tab
              label="All Firms"
              {...a11yProps(0)}
              sx={{
                color: "gray",
                "&.Mui-selected": { color: "#cecece" }, // selected tab #cecece
                width: { xs: 100, md: 200 },
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Top Rated"
              {...a11yProps(1)}
              sx={{
                color: "gray",
                "&.Mui-selected": { color: "#cecece" }, // selected tab #cecece
                width: { xs: 100, md: 200 },
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Lowest Rated"
              {...a11yProps(2)}
              sx={{
                color: "gray",
                "&.Mui-selected": { color: "#cecece" }, // selected tab #cecece
                width: { xs: 100, md: 200 },
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Challenges"
              {...a11yProps(2)}
              sx={{
                color: "gray",
                "&.Mui-selected": { color: "#cecece" }, // selected tab #cecece
                width: { xs: 100, md: 200 },
                textTransform: "capitalize",
              }}
            />
          </Tabs>
        </Box>
      </Box>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "'Lora', Helvetica",
          fontWeight: 600,
          width: "100%",
          color: "#cecece",
          textAlign: "right",
          mb: 2,
          pr: 2,
        }}
      >
        Showing {start}–{end} of {cardDetails.length} results
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          backgroundColor: "transparent",
          border: "1px solid #4b0082",
        }}
      >
        <StyledTable size="small">
          <StyledTableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell
                  key={header.label}
                  //className={header.className}
                  sx={{
                    color: "#cecece",
                    borderRight:
                      index === cardDetails.length - 1
                        ? "none"
                        : "1px solid #49454f",
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedUsers?.map((firm, index) => {
              const badgeStyles = getBadgeStyles(firm.firmType);
              return (
                <StyledTableRow key={index}>
                  {/* Firm Name and Logo */}
                  <TableCell sx={{ width: "227px", height: "54px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        pl: 3,
                        pr: 0,
                        //py: 2,
                        height: "100%",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/propfirm/${firm.id}`)}
                    >
                      <img
                        style={{
                          width: "38px",
                          height: "45px",
                          objectFit: "cover",
                        }}
                        alt="Firm logo"
                        src={firm.logo}
                      />
                      <Box
                        sx={{
                          //position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          gap: "6px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'Lora', Helvetica",
                            fontWeight: 500,
                            fontSize: "16px",
                            lineHeight: "16px",
                            color: "#cecece ",
                          }}
                        >
                          {firm.title}
                        </Typography>
                        <BadgeContainer
                          sx={{
                            position: "static",
                            backgroundColor: badgeStyles.bg,
                            color: badgeStyles.color,
                            padding: "2px 8px",
                          }}
                        >
                          {badgeStyles.icon}
                          <Typography
                            sx={{
                              fontSize: "10px",
                              fontWeight: "700",
                              lineHeight: 1,
                              letterSpacing: "1px",
                            }}
                          >
                            {badgeStyles.text}
                          </Typography>
                        </BadgeContainer>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Rating and Reviews */}
                  <TableCell sx={{ width: "130px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        px: 0,
                        //py: 2,
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          fontFamily: "'Lora', Helvetica",
                          fontWeight: 700,
                          color: "white",
                          fontSize: "24px",
                          lineHeight: "24px",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {firm.rating}
                      </Box>
                      <Box
                        sx={{
                          fontFamily: "'Lora', Helvetica",
                          fontWeight: 400,
                          color: "white",
                          fontSize: "14px",
                          lineHeight: "14px",
                          textAlign: "center",
                        }}
                      >
                        {firm.allRatings} Reviews
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Country Flag and Name */}
                  <TableCell sx={{ width: "154px", height: "54px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        px: 0,
                        py: 1,
                        height: "100%",
                      }}
                    >
                      <img
                        style={{
                          width: "32px",
                          height: "18px",
                          objectFit: "cover",
                        }}
                        alt="Country flag"
                        src={firm.flag}
                      />
                      <Box
                        sx={{
                          fontFamily: "'Lora', Helvetica",
                          fontWeight: 500,
                          color: "white",
                          fontSize: "16px",
                          lineHeight: "16px",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {firm.country}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Assets Badges */}
                  <TableCell sx={{ width: "152px", height: "54px" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        {firm.assets.map((asset, assetIndex) => (
                          <StyledChip
                            key={asset}
                            label={asset}
                            //sx={{ width: assetIndex === 0 ? "44px" : "56px" }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Platforms */}
                  <TableCell sx={{ width: "150px", height: "57px" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      {firm?.platforms.map((platform, platformIndex) =>
                        platformSources[`${platform}`] ? (
                          <img
                            title={platform}
                            key={platformIndex}
                            style={{
                              objectFit: "cover",
                              width: "24px",
                              height: "24px",
                            }}
                            alt={platform}
                            src={platformSources[`${platform}`]}
                          />
                        ) : (
                          <Avatar
                            key={platformIndex}
                            title={platform}
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: 12,
                              bgcolor: "#4b0082",
                            }}
                          >
                            {platform.slice(0, 1).toUpperCase()}
                          </Avatar>
                        )
                      )}
                    </Box>
                  </TableCell>

                  {/* Max Allocation */}
                  <TableCell sx={{ width: "143px", height: "54px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        px: 0,
                        py: "18px",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          fontFamily: "'Lora', Helvetica",
                          fontWeight: 600,
                          color: "white",
                          fontSize: "16px",
                          lineHeight: "19.2px",
                          textAlign: "center",
                          whiteSpace: "pre-line",
                        }}
                      >
                        $ {foreignNumberSystem(firm.maxAllocation)}
                        <br />
                        <span style={{ color: "#ccc", fontWeight: 500 }}>
                          Maximum
                        </span>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Details Button */}
                  <TableCell sx={{ width: "125px", borderRight: "none" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "12px",
                        px: 0,
                        py: "18px",
                        height: "100%",
                      }}
                    >
                      <Link to={`/propfirm/${firm.id}`}>
                        <StyledButton variant="contained">Details</StyledButton>
                      </Link>
                      <StyledButton
                        variant="contained"
                        sx={{
                          bgcolor: "#4b0082",
                          "&:hover": { bgcolor: "#7503c7ff" },
                        }}
                      >
                        Buy Now
                      </StyledButton>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </StyledTable>
      </TableContainer>
      {/* Pagination */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          my: 2,
          gap: 2,
          padding: "8px 16px",
          bgcolor: "#ffffff20",
          borderRadius: "8px",
          border: "1px solid #4b0082",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontFamily: "'Lora', Helvetica", color: "#cecece" }}
        >
          Showing {start}–{end} of {cardDetails.length} results
        </Typography>
        <Pagination
          count={Math.ceil(cardDetails.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          size="large"
          variant="outlined"
          shape="rounded"
          sx={{
            bgcolor: "#ffffff40",
            borderRadius: "8px",
            "& .MuiPaginationItem-root": {
              color: "#cecece",
              //borderColor: "#4b0082",
              border: "none",
              borderRadius: "8px",
              fontFamily: "'Lora', Helvetica",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "16px",
              "&.Mui-selected": {
                backgroundColor: "#4b0082",
                color: "white",
                "&:hover": {
                  backgroundColor: "#4b0082",
                },
              },
              "&:hover": {
                backgroundColor: "#4b008250",
                color: "white",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FirmDetailsTableSection;
