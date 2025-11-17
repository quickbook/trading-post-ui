import React, { useEffect, useMemo, useState, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { foreignNumberSystem } from "../commonFuctions/CommonFunctions";
import FirmsFilterSection from "./FirmsFilterSection";
import { Link, useNavigate } from "react-router-dom";
import { BadgeContainer, getBadgeStyles } from "./TradingCards";
import { useDispatch, useSelector } from "react-redux"; // Add this import
import { fetchFirmsData } from "../../features/firms/firmsSlice"; // Add this import
import {
  selectFirms,
  selectFirmsError,
  selectFirmsStatus,
  selectPagination,
} from "../../features/firms/firmsSelectors";
import { cardData } from "../../../CardsData";
//import Flag from "react-flagkit";
import Flag from "react-world-flags";

export const platformSources = {
  "MetaTrader": "/platforms/mt5.webp",
  "MetaTrader 5": "/platforms/mt5.webp",
 "MetaTrader 4": "/platforms/mt4.webp",
  cTrader: "/platforms/ctrader.webp",
  "Match Trader": "/platforms/matchtrader.webp",
  "TradeLocker": "/platforms/trade-locker.webp",
  "Project-X": "/platforms/project-x.webp",
  DXtrade: "/platforms/DX-trade.webp",
  NinjaTrader: "/platforms/ninjatrader.webp",
  Volumetrica: "/platforms/volumetrica.webp",
  TradingView: "/platorms/tradingview.png",
  "MT5 Web Trader": "/platforms/mt5.webp",
  "MT5 Mobile": "/platforms/mt5.webp",
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allFirms = useSelector(selectFirms) ?? [];
  //const allFirms = cardData; // Replace with useSelector(selectFirms) when API is ready
  const { pageNumber, pageSize, totalElements, totalPages } =
    useSelector(selectPagination);
  const status = useSelector(selectFirmsStatus);
  const error = useSelector(selectFirmsError);
  const rowsPerPage = pageSize ?? 8;
  // Replace useGetFirmsQuery // Replace useGetFirmsQuery
  const [filteredFirms, setFilteredFirms] = useState(allFirms);
  const hasInitialFetch = useRef(false);
  useEffect(() => {
    if (status === "idle" && !hasInitialFetch.current) {
      hasInitialFetch.current = true;
      dispatch(fetchFirmsData());
    }
  }, [dispatch, status]);

  // useEffect(() => {
  //   if (allFirms) {
  //     setFilteredFirms(firms);
  //   } else {
  //     setFilteredFirms(cardData);
  //   }
  //   console.log(filteredFirms);
  // }, [firms]);

  function filterFirmsByTab(index) {
    if (!filteredFirms) return;

    switch (index) {
      case 0:
        return setFilteredFirms(allFirms); // All Firms
      case 1:
        return setFilteredFirms(
          allFirms.filter(
            (firm) => firm?.rating === "A+" || firm?.rating === "A"
          )
        ); // Top Rated
      case 2:
        return setFilteredFirms(
          allFirms.filter(
            (firm) =>
              firm?.rating === "B" ||
              firm?.rating === "C" ||
              firm?.rating === "D"
          )
        ); // Challengers
      case 3:
        return navigate("/comparefirms/challenges");
      default:
        setFilteredFirms(allFirms);
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
    return filteredFirms.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [filteredFirms, page, rowsPerPage]);

  const start = useMemo(() => {
    return (page - 1) * rowsPerPage + 1;
  }, [page, rowsPerPage]);

  const end = useMemo(() => {
    return Math.min(page * rowsPerPage, filteredFirms.length);
  }, [filteredFirms.length, page, rowsPerPage]);

  // Loading state
  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <Box sx={{ p: 3, color: "error.main" }}>Error loading firms: {error}</Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        position: "relative",
        bgcolor: "#000",
        padding: "8px 24px",
      }}
    >
      <FirmsFilterSection
        setFilteredFirms={setFilteredFirms}
        setPage={setPage}
        allFirms={allFirms}
        setValue={setValue}
      />
      <Box sx={{ width: "100%", mb: 4, maxWidth: 1640 }}>
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
          maxWidth: 1640,
        }}
      >
        Showing {start}–{end} of {filteredFirms.length} results
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          backgroundColor: "transparent",
          border: "1px solid #4b0082",
          maxWidth: 1640,
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
                      index === filteredFirms.length - 1
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
              const badgeStyles = getBadgeStyles(firm?.firmType);
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
                      onClick={() => navigate(`/propfirm/${firm?.id}`)}
                    >
                      <img
                        style={{
                          width: "38px",
                          height: "45px",
                          objectFit: "cover",
                        }}
                        alt="Firm logo"
                        src={firm?.logo}
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
                          {firm?.name}
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
                        {firm?.rating}
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
                        {firm?.allRatings} Reviews
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Country Flag and Name */}
                  <TableCell
                    sx={{
                      width: "154px",
                      overflow: "hidden",
                      wordBreak: "break-word",
                    }}
                  >
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
                      <Flag code={firm?.countryCode} height={16} />
                      <Typography
                        sx={{
                          maxWidth: "120px",
                          fontFamily: "'Lora', Helvetica",
                          fontWeight: 500,
                          color: "white",
                          fontSize: "15px",
                          lineHeight: "auto",
                          textAlign: "center",
                          wordBreak: "break-word",
                        }}
                      >
                        {firm?.country}
                      </Typography>
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
                        {firm?.tradingConditions.availableAssets.map(
                          (asset, assetIndex) => (
                            <StyledChip
                              key={asset}
                              label={asset}
                              //sx={{ width: assetIndex === 0 ? "44px" : "56px" }}
                            />
                          )
                        )}
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
                      {firm?.tradingConditions.tradingPlatforms.map(
                        (platform, platformIndex) =>
                          platformSources[`${platform}`] ? (
                            <img
                              title={platform}
                              key={platformIndex}
                              style={{
                                objectFit: "contain",
                                width: "26px",
                                height: "26px",
                              }}
                              alt={platform}
                              src={platformSources[`${platform}`]}
                            />
                          ) : (
                            <Avatar
                              key={platformIndex}
                              title={platform}
                              sx={{
                                width: 26,
                                height: 26,
                                fontSize: 12,
                                bgcolor: "#4b0082",
                              }}
                            >
                              {platform?.slice(0, 1).toUpperCase()}
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
                        ${" "}
                        {foreignNumberSystem(
                          firm?.tradingConditions.maximumAccountSizeUsd
                        )}
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
                      <Link to={`/propfirm/${firm?.id}`}>
                        <StyledButton variant="contained">Details</StyledButton>
                      </Link>
                      <StyledButton
                        href={firm?.buyUrl}
                        target="blank"
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
          maxWidth: 1640,
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontFamily: "'Lora', Helvetica", color: "#cecece" }}
        >
          Showing {start}–{end} of {filteredFirms.length} results
        </Typography>
        <Pagination
          count={Math.ceil(filteredFirms.length / rowsPerPage)}
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
