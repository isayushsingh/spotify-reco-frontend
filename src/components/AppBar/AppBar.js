import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import SpotifyLogo from '../../images/spotifylogo.png';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#1DB954' }}>
            <StyledToolbar>
                {/* Left Section: Logo + Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={SpotifyLogo} alt="Spotify Logo" style={{ height: 40 }} />
                <Typography variant="h6" component="div">
                    Ayush's Spotify
                </Typography>
                </Box>

                {/* Right Section: Avatar */}
                <Box>
                <IconButton aria-label="Profile">
                    <Avatar alt="Your Name" src={} />
                </IconButton>
                </Box>
            </StyledToolbar>
        </AppBar>
    </Box>
  );
}