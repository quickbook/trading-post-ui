import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { cardData } from "../../../CardsData";
import { set } from "react-hook-form";

const FirmsFilterSection = ({ setCardDetails, setPage }) => {
  const [rating, setRating] = useState("all");
  const [query, setQuery] = useState("");

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 1) {
      const results = cardData?.filter((item) =>
        item?.title.toLowerCase().includes(value.toLowerCase())
      );
      setCardDetails(results);
      setRating("");
    }else{
      setCardDetails(cardData);
    }
    setPage(1);
  });

  const handleRatingSelect = (e) => {
    const value = e.target.value;
    setRating(value);
    const results = cardData?.filter((item) => item?.rating === value);
    setCardDetails(value === "all" ? cardData : results);
    setQuery("");
    setPage(1);
  };

  const handleClear = useCallback(() => {
    setQuery("");
    setCardDetails(cardData);
  });

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        //height: "99px",
        bgcolor: "#000000e6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 1, md: 2 },
        //px: { xs: 1, md: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 2,
          width: "100%",
          //maxWidth: 800,
        }}
      >
        {/* Search Input with Search Icon Button */}
        <TextField
          placeholder="Search"
          value={query}
          variant="outlined"
          fullWidth
          onChange={handleSearchChange}
          size="small"
          sx={{
            //maxWidth: 480,
            "& .MuiOutlinedInput-root": {
              //height: "48px",
              borderRadius: "50px",
              bgcolor: "#cecece",
              fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              "& fieldset": { border: "none" },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      handleClear();
                    }}
                    size="small"
                    sx={{ visibility: "visible" }}
                  >
                    <ClearIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </InputAdornment>
              ) : (
                <></>
              ),
            },
          }}
        />

        {/* Trusted Only Button */}
        <Button
          variant="contained"
          sx={{
            width: 280,
            height: "42px",
            px: 3,
            bgcolor: "#4b0082",
            borderRadius: "50px",
            border: "1px solid #cecece",
            fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": { bgcolor: "#4b0082cc" },
          }}
        >
          Trusted Only
        </Button>

        {/* Rating Select Field */}
        <FormControl
          sx={{
            minWidth: 220,
            "& .MuiOutlinedInput-root": {
              height: "48px",
              borderRadius: "10px",
              color: "white",
              borderColor: "white",
              fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              "& fieldset": { borderColor: "white" },
              "& .MuiSvgIcon-root": { color: "white" }, // dropdown arrow white
            },
          }}
        >
          <InputLabel
            id="rating-select-label"
            sx={{
              color: "#cecece",
              "&.Mui-focused": {
                color: "#4b0082",
              },
              fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
              fontWeight: 600,
              mt: "-2px",
            }}
          >
            Rating
          </InputLabel>
          <Select
            labelId="rating-select-label"
            value={rating}
            label={rating ? "Rating" : "A"}
            fullWidth
            onChange={handleRatingSelect}
            displayEmpty
            sx={{
              bgcolor: "transparent",
              color: "#4b0082",
              px: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4b0082",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4b0082",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4b0082",
              },
            }}
          >
            {/* <MenuItem value="">
              <em>Rating</em>
            </MenuItem> */}
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default FirmsFilterSection;
