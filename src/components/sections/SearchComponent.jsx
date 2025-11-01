import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useContext, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router";
import { cardData } from "../../../CardsData";

const SearchComponent = ({ setCardDetails }) => {
  const [query, setQuery] = useState("");

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 1) {
      const results = cardData?.filter((item) => item?.title.toLowerCase().includes(value.toLowerCase()));
      setCardDetails(results);
    } 
  });

  const handleClear = useCallback(() => {
    setQuery("");
    setCardDetails(cardData);
  });

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
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
    </Box>
  );
};

export default SearchComponent;
