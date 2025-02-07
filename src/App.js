import { useState, useEffect } from "react";
import axios from "axios";
import SongCard from "./components/SongCard/SongCard";
import { ThemeProvider, createTheme, CssBaseline, Dialog, DialogActions, DialogContent, TextField, Button, CircularProgress, Paper, Alert } from "@mui/material";
import SpotifyPlaylistTable from "./components/SpotifyTable/SpotifyTable";
import { InputAdornment, Grid, styled } from '@mui/material';
import { CheckBoxOutlineBlank } from "@mui/icons-material";
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
            const timer = setTimeout(() => setAlert({ show: false, message: "" }), 10000);
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
                setAlert({ show: true, message: "great minds think alike! this song is already added." });
            } else {
                const newSong = { song: selectedSong, nicknames: [nickname] };
                setAddedSongs((prev) => [...prev, newSong]);
                await axios.post(`${backendUrl}/add-song`, { song: selectedSong, nickname });
                setAlert({ show: true, message: "your song just dropped like a bass in an edm night!" });

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
            <div style={{padding: '100px'}}>
                <Grid
                    container
                    direction="column"
                    sx={{
                        justifyContent: "flex-start",
                        alignItems: "left",
                    }}
                    md
                >
                {/* <ButtonAppBar/> */}
                    
                {/* <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a song..."
                /> */}
                <h1>got a tune that slaps? share it with <span style={{ color: "#1a9e44" }}>ayush!</span></h1>

                <StyledTextField
                    fullWidth
                    placeholder="Search for a song..."
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
                {/* Search Results */}
                {query && (
                        <div style={{ paddingTop: '75px' }}>
                            <Paper elevation={2} variant="outlined" style={{ padding: '10px', backgroundColor: '#212121' }}>
                                <h2 style={{ textAlign: 'center' }}>
                                    Click on a song below to <span style={{ color: "#1a9e44" }}>add</span>
                                </h2>
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                                    {results.length === 0 ? (
                                        <p>No results found</p>
                                    ) : (
                                        results.slice(0, 8).map((song) => (
                                            <SongCard key={song.id} song={song} onClick={handleCardClick} />
                                        ))
                                    )}
                                </div>
                            </Paper>
                        </div>
                    )}
                
                {/* Add Song Modal */}
                <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{
                        sx: {
                            backgroundColor: 'rgba(3, 3, 3, 0.9)', // Semi-transparent black background
                            backdropFilter: 'blur(5px)', // Apply blur to the backdrop
                            width: '400px', // Fixed width
                            maxWidth: '400px', // Prevent width from exceeding fixed value
                            margin: 'auto', // Center the modal
                            borderRadius: '10px'
                        },
                    }}
                    BackdropProps={{
                        sx: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed backdrop
                        },
                    }}>
                        {loading && <CircularProgress />}
                        <DialogContent sx={{padding: '20px'}}> {/* Add padding to content */}
                        <div style={{ marginBottom: '10px' }}> {/* Add margin for spacing */}
                            Interesting, let the world know who recommended it (or stay anonymous)
                        </div>
                        <TextField
                            autoFocus
                            margin="dense"
                            type="text"
                            fullWidth
                            placeholder="Your name, legend?"
                            value={nickname}
                            onChange={handleNicknameChange}
                        />
                    </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenModal(false)} color="">Cancel</Button>
                            <Button onClick={addSong} style={{ color: "#1a9e44" }}>Add Song</Button>
                        </DialogActions>
                    </Dialog>

                {/* Alert Notification */}
                    {alert.show && (
                        <Alert style={{marginTop: '50px'}} icon={<CheckBoxOutlineBlank fontSize="inherit" />} severity="success">
                            {alert.message}
                        </Alert>
                )}
            {/* Playlist Table */}
            <div style={{ width: '100%', marginTop: '100px' }}>
                        <h1>great tracks, greater contributors!</h1>
                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <SpotifyPlaylistTable rows={addedSongs} />
                        )}
            </div>
            </Grid>
        </div>
        
        </ThemeProvider>
    );
}

export default App;