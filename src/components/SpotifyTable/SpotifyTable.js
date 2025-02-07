import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Link, IconButton, TablePagination } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    background: 'linear-gradient(to bottom, rgba(46, 44, 44, 0.8), rgba(36, 33, 33, 0.5))', // More matte gradient
    backdropFilter: 'blur(5px)',
    '&:hover': {
        background: 'linear-gradient(to bottom, rgba(24, 24, 24, 0.3), rgba(17, 17, 17, 0.3))', // Hover effect
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: 'none',
    // padding: '12px 16px',
}));

const SongTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: '1.1rem',
    color: 'white',
}));

const ArtistName = styled(Typography)(({ theme }) => ({
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({ // Style for header cells
    // backgroundColor: 'rgba(0, 179, 63, 0.7)', // Original green color
    background: 'linear-gradient(to bottom, rgba(0, 179, 63, 1), rgba(0, 171, 85, 0.8))', // More matte gradient
    color: 'white',
    fontWeight: 600,
    fontSize: '14px',
    padding: '8px 16px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    letterSpacing: '0.5px',
}));


const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const calculateYearsAgo = (releaseDate) => {
    if (!releaseDate) return "Unknown"; // Handle missing date

    const releaseYear = new Date(releaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const yearsAgo = currentYear - releaseYear;

    return `${yearsAgo} years ago`;
};

function SpotifyPlaylistTable(props) {
    const [rows, setRows] = useState(props.rows);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const sortedRows = [...props.rows].sort((a, b) => b.timestamp - a.timestamp);
        setRows(sortedRows);
    }, [props.rows]);

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const columns = [
        {
            id: 'index',
            label: '#',
            align: 'center',
            render: (row, index) => (
                <Typography variant="body2" color="white">
                    {index + 1 + page * rowsPerPage} {/* Calculate index with pagination */}
                </Typography>
            ),
        },
        {
            id: 'cover',
            label: 'cover',
            align: 'left',
            render: (row) => (
                <img
                    src={row.song.album?.images[0]?.url || "https://via.placeholder.com/50"}
                    alt={row.song.name || "Unknown Song"}
                    style={{ width: 60, height: 60, borderRadius: '4px' }}
                />
            ),
        },
        {
            id: 'title',
            label: 'title',
            align: 'left',
            render: (row) => (
                <div>
                    <SongTitle>{row.song.name || 'Unknown Title'}</SongTitle>
                    <ArtistName>{row.song.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}</ArtistName>
                </div>
            ),
        },
        {
            id: 'album',
            label: 'album',
            align: 'left',
            render: (row) => (
                <div>
                    <ArtistName>{row.song.album?.name || ''}</ArtistName>
                </div>
            ),
        },
        {
            id: 'duration',
            label: 'duration',
            align: 'left',
            render: (row) => (
                <Typography variant="body2" color="white">
                    {formatDuration(row.song.duration_ms)}
                </Typography>
            ),
        },
        {
            id: 'nicknames',
            label: 'added by', // More descriptive label
            align: 'left',
            render: (row) => (
                <Typography variant="body2" color="white">
                    {row.nickname || 'anonymous'}
                </Typography>
            ),
        },
        {
            id: 'release_date',
            label: 'released (feel old yet?)',
            align: 'left',
            render: (row) => (
                <Typography variant="body2" color="white">
                    {calculateYearsAgo(row.song.album?.release_date)}
                </Typography>
            ),
        },
        {
            id: 'actions',
            label: 'play',
            align: 'center',
            render: (row) => (
                <Link href={row.song?.uri || '#'} target="_blank" rel="noopener noreferrer">
                    <IconButton sx={{ color: 'rgba(0, 179, 63)' }}>
                        <PlayArrowIcon />
                    </IconButton>
                </Link>
            ),
        },
    ];

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', background: 'transparent' }}>
            <TableContainer sx={{ backdropFilter: 'blur(5px)' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map(({ id, label, align }) => (
                                <StyledTableHeadCell key={id} align={align}> {/* Use StyledTableHeadCell */}
                                    {label}
                                </StyledTableHeadCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <StyledTableRow key={row.id || index}>
                                    {columns.map(({ id, align, render }) => (
                                        <StyledTableCell key={id} align={align}>
                                            {render(row, index)}
                                        </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ color: 'white' }}
            />
        </Paper>
    );
}

export default SpotifyPlaylistTable;