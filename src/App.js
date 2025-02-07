import { useState, useEffect } from "react";
import axios from "axios";
import SongCard from "./components/SongCard/SongCard";
import { ThemeProvider, createTheme, CssBaseline, Dialog, DialogActions, DialogContent, TextField, Button, CircularProgress, Paper, Alert, Box, Typography } from "@mui/material";
import SpotifyPlaylistTable from "./components/SpotifyTable/SpotifyTable";
import { InputAdornment, Grid, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Filter } from 'bad-words'
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 30,
        '& fieldset': { borderColor: theme.palette.grey[500] },
        '&:hover fieldset': { borderColor: theme.palette.grey[700] },
        '&.Mui-focused fieldset': { borderColor: '#1DB954', boxShadow: `${theme.palette.primary.main} 0 0 0 0.2rem` },
    },
    '& .MuiInputBase-input': { paddingLeft: '16px' },
}));

// Dark theme using Material-UI
const theme = createTheme({ palette: { mode: "dark" } });
const filter = new Filter();
function App() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [nickname, setNickname] = useState("");
    const [addedSongs, setAddedSongs] = useState([]);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [openModal, setOpenModal] = useState(false);  // Modal visibility
    const [selectedSong, setSelectedSong] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "" });

    // Fetch added songs
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${backendUrl}/added-songs`);
                setAddedSongs(data);
            } catch (error) {
                console.error("Error fetching songs:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Show alert for a limited time
    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => setAlert({ show: false, message: "" }), 8000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timer);
    }, [query]);

    const handleClearSearch = () => {
        setQuery("");
        setResults([]); // Clear search results as well
    };
    
    // Fetch search results
    useEffect(() => {
        if (!debouncedQuery.trim()) return setResults([]);
        (async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/search?q=${debouncedQuery}`);
                setResults(data);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        })();
    }, [debouncedQuery]);

    // Handle song selection
    const handleCardClick = (song) => {
        setSelectedSong(song);
        setOpenModal(true);
    };

    const handleNicknameChange = (e) => {
        let input = e.target.value;
        // Character limit of 15
        if (input.length > 15) return;
        // Check for profanity
        if (filter.isProfane(input)) {
            
            return;
        }
        setNickname(input);
    };

    // Handle adding a song
    const addSong = async () => {
        try {
            setLoading(true); // Set loading to true *before* the API call
            const songExists = addedSongs.some((item) => item.song.id === selectedSong.id);
            if (songExists) {
                setAlert({ show: true, message: "great minds think alike! this song is already added. thank you" });
            } else {
                const newSong = { song: selectedSong, nicknames: [nickname] };
                setAddedSongs((prev) => [...prev, newSong]);
                await axios.post(`${backendUrl}/add-song`, { song: selectedSong, nickname });
                setAlert({ show: true, message: "your song just dropped like a bass in an edm night! thank you" });

                //Refetch after successful update
                const { data } = await axios.get(`${backendUrl}/added-songs`);
                setAddedSongs(data);
            }
        } catch (error) {
            console.error("Error adding song:", error);
            setAlert({ show: true, message: "Oops! Something went wrong while adding the song." });
        } finally {
            setQuery("");
            setNickname("");
            setOpenModal(false);
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
                <Grid container spacing={5} direction="column" alignItems="stretch">
                <Grid item xs={12} md={10} lg={8} sx={{ mx: 10, mt: 10 }}> 
                    <h1>got a tune that slaps? share it with <span style={{ color: "#1a9e44" }}>ayush!</span></h1>
                    <StyledTextField
                        fullWidth
                        placeholder="search for a song..."
                        variant="outlined"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                            ),
                            endAdornment: query &&(
                                <InputAdornment position="start">
                                    <ClearIcon onClick={handleClearSearch}/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiTextField-root': {
                                minWidth: '550px' // Fixed width for the search bar
                            }
                        }}
                    />
                </Grid>
                {/* Search Results */}
                <Grid item xs={12} md={10} lg={8} sx={{ mx: 10 }}> {/* Add margin top */}
                {query && (
                    <Paper elevation={3} variant="outlined" style={{ padding: '10px', backgroundColor: 'rgba(0, 24, 9, 0.4)' }}>
                        <h2 style={{ textAlign: 'center' }}>
                            click on a song below to <span style={{ color: "#1a9e44" }}>add</span>
                        </h2>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                            {results.length === 0 ? (
                                <p>no results found</p>
                            ) : (
                                results.slice(0, 8).map((song) => (
                                    <SongCard key={song.id} song={song} onClick={handleCardClick} />
                                ))
                            )}
                        </div>
                    </Paper>
                    )}
                    </Grid>
                
                {/* Add Song Modal */}
                <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: '#121212',
                        backdropFilter: 'blur(8px)',
                        width: { xs: '90%', sm: '400px' },
                        maxWidth: '450px',
                        margin: 'auto',
                        borderRadius: '16px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', 
                        overflow: 'hidden', 
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                    },
                }}
            >
                
                <DialogContent sx={{ padding: '24px'  }}> {/* Increased padding */}
                    {
                        loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <CircularProgress color="success" /></div> : 
                        <div><Typography variant="body2" color="text.secondary" gutterBottom>
                        let the world know who recommended it (or stay anonymous xD)
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        type="text"
                        fullWidth
                        placeholder="your name, legend?"
                        value={nickname}
                        onChange={handleNicknameChange}
                        InputProps={{
                            sx: {
                                backgroundColor: '#282828', // Darker input background
                                borderRadius: '8px', // Rounded input corners
                                color: 'white', // White text
                                '&:before': { borderBottomColor: '#1DB954' }, // Green underline on focus
                                '&:focus-within': {
                                    '& .MuiInputLabel-root': {
                                        color: '#1DB954'
                                    }
                                }
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                color: 'grey', // Grey label text
                            }
                        }}
                    /></div>
                    }
                    
                    </DialogContent>
                    {!loading && <DialogActions sx={{ padding: '16px', backgroundColor: '#121212' }}> {/* Action button styling */}
                        <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
                        <Button onClick={addSong} sx={{ color: '#1DB954', fontWeight: 'bold' }}>Add Song</Button>
                    </DialogActions>}
                 </Dialog>

                {/* Alert Notification */}
                {alert.show && (
                    <Grid item xs={12} md={8} sx={{ mx: 10 }}> {/* Add margin top */}
                        <Alert sx={{ fontSize: 'larger' }} icon={false} variant="filled" severity="success" onClose={() => {setAlert({ show: false, message: "" })}} style={{color: '#fff'}}>
                            {alert.message}
                        </Alert>
                    </Grid>
                )}
                {/* Playlist Table */}
                <Grid item xs={12} md={10} lg={8} sx={{ mx: 10, mt: 10 }}> {/* Add larger margin top */}
                    <h2>great tracks, greater contributors!</h2>
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                            <CircularProgress color="success" />
                        </div>
                    ) : (
                        <SpotifyPlaylistTable rows={addedSongs} />
                    )}
                </Grid>
            </Grid>
        </Box>
        
        </ThemeProvider>
    );
}

export default App;