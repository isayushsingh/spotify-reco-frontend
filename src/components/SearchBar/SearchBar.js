import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 350, // Fixed width for better layout
  "& .MuiOutlinedInput-root": {
    borderRadius: 30, // Rounded corners
    paddingRight: 8, // Ensure padding around icons
    "& fieldset": {
      borderColor: theme.palette.grey[500], // Subtle border color
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[700], // Darker border on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1DB954", // Spotify green on focus
      boxShadow: "0 0 0 3px rgba(29, 185, 84, 0.4)", // Soft glow effect
    },
  },
  "& .MuiInputBase-input": {
    paddingLeft: "14px", // Adjust padding for search icon
    paddingRight: "14px", // Adjust padding for clear icon
  },
}));

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery(""); // Clear search input
  };

  return (
    <StyledTextField
      fullWidth
      placeholder="Search for a song..."
      variant="outlined"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      InputAdornment={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: query && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} edge="end" size="small">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;