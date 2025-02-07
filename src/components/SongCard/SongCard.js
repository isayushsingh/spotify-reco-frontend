import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { FastAverageColor } from 'fast-average-color'; // Correct import

const fac = new FastAverageColor();

function SongCard({ song, onClick }) {
    const [backgroundColor, setBackgroundColor] = useState('#282828');
    const [textColor, setTextColor] = useState('white');
    const imageUrl = song.album?.images[0]?.url || "https://via.placeholder.com/280";
    const [controller, setController] = useState(null); // AbortController for cancellation

    useEffect(() => {
        if (imageUrl) {
            const img = new Image();
            img.crossOrigin = "anonymous";

            img.onload = async () => {
                if (controller) { // Check if a controller exists
                    controller.abort(); // Abort previous request if any
                }

                const newController = new AbortController(); // Create new AbortController
                setController(newController); // Update controller state

                try {
                    const color = await fac.getColorAsync(img, { signal: newController.signal }); // Pass signal

                    if (newController.signal.aborted) { // Check if request was aborted
                        return; // Exit if aborted
                    }

                    setBackgroundColor(color.hex);
                    setTextColor(color.isDark ? 'white' : 'black');
                } catch (error) {
                    if (error.name === 'AbortError') { // Check if it's an AbortError
                        return; // It's okay, request was cancelled
                    }
                    console.error("Error getting dominant color:", error);
                }
            };
            img.src = imageUrl;
        }

        return () => {
            if (controller) { // Abort if component unmounts
                controller.abort();
            }
        };

    }, [imageUrl, controller]);


    return (
        <Card
            onClick={() => onClick(song)}
            sx={{
                width: 300,
                height: 320,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                margin: '10px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                },
                backgroundColor: backgroundColor,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '220px', paddingTop: '16px' }}>
                <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={song.name || 'Unknown Song'}
                    sx={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '10px',
                    }}
                />
            </Box>
            <CardContent sx={{ flexGrow: 1, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: textColor }}>
                <Typography variant="h6" noWrap align="center" sx={{ fontWeight: 500 }}>
                    {song.name.toLowerCase()}
                </Typography>
                <Typography variant="body2" noWrap align="center">
                    {song.artists?.map((artist) => artist.name).join(', ').toLowerCase() || 'Unknown Artist'}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default SongCard;