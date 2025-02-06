// SongCard.js
import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

function SongCard({ song, onClick }) {
  return (
    <Card onClick={() => onClick(song)} sx={{ maxWidth: 300, display: 'flex', flexDirection: 'column', minWidth: 300, ':hover': {
      boxShadow: '0 0px 10px', cursor: 'pointer' }, margin: '10px' }}>
      {/* Album Cover */}
      <CardMedia
        component="img"
        height="300"
        image={song.album.images[0]?.url || "https://via.placeholder.com/150"}
        alt={song.name}
      />
      {/* Song Info */}
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="div" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {song.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {song.artists[0]?.name || "Unknown Artist"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SongCard;