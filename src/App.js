import { useState, useEffect } from "react";
import axios from "axios";
import SongCard from "./components/SongCard/SongCard";
import { ThemeProvider, createTheme, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Paper, Alert } from "@mui/material";
import SpotifyPlaylistTable from "./components/SpotifyTable/SpotifyTable";
import { InputAdornment, Grid, styled } from '@mui/material';
import { CheckBoxOutlineBlank } from "@mui/icons-material";

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: 30,
      '& fieldset': {
        borderColor: theme.palette.grey[500],
      },
      '&:hover fieldset': {
        borderColor: theme.palette.grey[700],
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1DB954',
        boxShadow: `${theme.palette.primary.main} 0 0 0 0.2rem`,
      },
    },
    '& .MuiInputBase-input': {
      paddingLeft: '16px',
    },
  }));

function App() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [nickname, setNickname] = useState("");
    const [addedSongs, setAddedSongs] = useState([]);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [openModal, setOpenModal] = useState(false);  // Modal visibility
    const [selectedSong, setSelectedSong] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

     // Dark theme using Material-UI
    const theme = createTheme({
        palette: {
        mode: "dark",
        },
    });

    // Fetch added songs from the Node.js server when the component mounts
    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get("http://localhost:5001/added-songs");
                setAddedSongs(response.data); // Update state with the data fetched from the server
            } catch (error) {
                console.error("Error fetching songs from server: ", error);
            } finally {
                setLoading(false); // Stop loading after the request is finished
            }
        };
        fetchSongs();
    }, []);

    useEffect(() => {
        // when the component is mounted, the alert is displayed for 3 seconds
        setTimeout(() => {
          setAlert(false);
        }, 10000);
      }, [alert]);

    // Handle typing in the search bar and apply debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedQuery(query);
    }, 500); // Debounce time, 500ms

    // Cleanup on component unmount or when query changes
        return () => clearTimeout(timer);
    }, [query]);
    
    // Fetch songs from the API when the debounced query changes
    useEffect(() => {
    if (debouncedQuery.trim()) {
        const searchSongs = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/search?q=${debouncedQuery}`);
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
        };
        searchSongs();
        } else {
            setResults([]); // Clear results when query is empty
        }
    }, [debouncedQuery]);

    // Open the modal with the selected song
    const handleCardClick = (song) => {
        setSelectedSong(song);
        setOpenModal(true); // Open the modal when card is clicked
    };

    // Handle adding the song
    const addSong = async () => {
        // if (!nickname) {
        //     alert("Please enter a nickname!");
        // return;
        // }
        try {
            // Check if the song already exists in the addedSongs list
            const songExists = addedSongs.some((addedSong) => addedSong.song.id === selectedSong.id);  
            if (songExists) {
                setAlertMessage("great minds think alike! this song is already added. thank you!");
                setAlert(true);
            } else {
                // If the song doesn't exist, add it as a new entry
                setAddedSongs([
                    ...addedSongs,
                    { song: selectedSong, nicknames: [nickname] }
                ]);
                // Send add request to your backend
                await axios.post('http://localhost:5001/add-song', {
                    song: selectedSong,
                    nickname: nickname
                });
                setAlertMessage("your song just dropped into the playlist like a bass drop in an EDM festival");
                setAlert(true);
            }
        // Clear the search query and close the modal
        setQuery(""); // Clear the search query
        setNickname("");
        setOpenModal(false); // Close the modal
        } catch (error) {
            console.error("Error adding song:", error);
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
                            {/* <SearchIcon /> */}
                        </InputAdornment>
                    ),
                    }}
                    sx={{
                        '& .MuiTextField-root': {
                            minWidth: '550px' // Fixed width for the search bar
                        }
                    }}
                />
                {/* Show top 5 search results below the search bar */}
                <div style={{paddingTop: '50px'}}>
                {query && (
                    <Paper elevation="2" variant="outlined" style={{padding:'10px', backgroundColor: '#212121'}}>
                        <h2 style={{textAlign:'center'}}>click on a song below to add</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                        
                        {results.slice(0, 8).length === 0 ? ( <p>No results found</p>) : (
                            results.slice(0, 8).map((song) => (
                                <SongCard key={song.id} song={song} onClick={handleCardClick} />
                            ))
                        )}
                        </div>
                    </Paper>
                )}    
                </div>
                
                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <DialogContent>
                        <TextField
                        autoFocus
                        margin="dense"
                        type="text"
                        fullWidth
                        placeholder="your name, legend?"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModal(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={addSong} color="primary">
                            Add Song
                        </Button>
                    </DialogActions>
                </Dialog>
                {alert && <Alert icon={<CheckBoxOutlineBlank fontSize="inherit" />} severity="success">
                    {alertMessage}
                </Alert>}
            {/* Added Songs List */}
            <div style={{width: '100%', marginTop: '100px'}}>
            <h1>great tracks, greater contributors!</h1>
            {/* Display loading spinner while the table is populating */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                    <CircularProgress />
                </div>
            ) : (
                // Display table once data is loaded
                <div>
                    <SpotifyPlaylistTable rows={addedSongs}/>
                </div>
            )}
            </div>
            </Grid>
        </div>
        
        </ThemeProvider>
    );
}

export default App;