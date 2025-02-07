import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

function SongCard({ song, onClick }) {
  return (
    <Card
      onClick={() => onClick(song)}
      sx={{
        maxWidth: 300,
        width: "100%", // Makes it responsive
        display: "flex",
        flexDirection: "column",
        minWidth: 300,
        cursor: "pointer",
        margin: "10px",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0px 4px 15px #1DB954",
        },
      }}
    >
      {/* Album Cover */}
      <CardMedia
        component="img"
        height="280"
        image={song.album?.images[0]?.url || "https://via.placeholder.com/280"}
        alt={song.name || "Unknown Song"}
        sx={{ objectFit: "cover" }}
      />

      {/* Song Info */}
      <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
        <Typography variant="h6" noWrap>
          {song.name}
        </Typography>
        <Typography variant="body3" color="text.secondary" noWrap>
          {song.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SongCard;