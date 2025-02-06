import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import SpotifyLogo from '../../images/spotifylogo.png'
import { styled } from '@mui/material/styles';


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between', // Distribute space between logo/title and avatar
  }));


export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1DB954' }}> {/* Use sx prop */}
        <StyledToolbar> {/* Use the styled Toolbar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}> {/* Box for logo and title */}
            <img src={SpotifyLogo} alt="Spotify Logo" style={{ height: 40, marginRight: 10 }} />{/* Spotify Logo */}
            <Typography variant="h6" component="div">
              Ayush's Spotify
            </Typography>
          </Box>
          <IconButton>
            <Avatar alt="Your Name" src="/path/to/your/avatar.jpg" /> {/* Your Avatar */}
          </IconButton>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
}