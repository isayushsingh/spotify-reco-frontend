import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 30, // Rounded corners
    '& fieldset': {
      borderColor: theme.palette.grey[500], // Subtle border color
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey[700], // Darker border on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1DB954', // Spotify green on focus
      boxShadow: `${theme.palette.primary.main} 0 0 0 0.2rem`, // Subtle shadow
    },
  },
  '& .MuiInputBase-input': {
    paddingLeft: '16px', // Adjust padding for icon
  },
}));


const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleClear = () => {
    setQuery('');
  };

  return (
    <StyledTextField
      fullWidth // Take full width available
      placeholder="Search for a song..."
      variant="outlined" // Outlined input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: query && ( // Only show clear icon if there's input
          <InputAdornment position="end">
            <IconButton onClick={handleClear} edge="end">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ // Styling the search bar container
        '& .MuiTextField-root': {
            width: '350px' // Fixed width for the search bar
        }
      }}
    />
  );
};

export default SearchBar;