import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'rgba(0, 179, 63, 0.7)', // Subtle hover effect
        color: theme.palette.common.white,
        fontWeight: 600, // Slightly less bold
        fontSize: '15px',
        borderBottom: `1px solid ${theme.palette.divider}`, // Add border
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: theme.palette.text.secondary, // Slightly lighter text
        borderBottom: `1px solid ${theme.palette.divider}`, // Add border
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: 'rgba(0, 98, 34, 0.1)', // Subtle hover effect
        transition: 'background-color 0.2s ease-in-out',
    },
}));

// Format song duration (MM:SS)
const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
  
const columns = [
    {
        id: "index",
        label: "#",
        align: "center",
        render: (_, index) => (
          <Typography variant="body2" color="text.secondary">
            {index + 1}
          </Typography>
        ),
    },
    {
        id: "cover",
        label: "cover",
        align: "left",
        render: (row) => (
            <img
                src={row.song.album?.images[0]?.url || "https://via.placeholder.com/50"}
                alt={row.song.name || "Unknown Song"}
                style={{ width: 50, height: 50}}
            />
        ),
      },
      {
        id: 'title',
        label: 'title',
        align: 'left',
        render: (row) => (
            <Typography variant="body2" fontWeight={500} color="white"> {/* White title */}
                {row.song.name || 'Unknown Title'}
            </Typography>
        ),
    },
    {
        id: 'artist',
        label: 'artists',
        align: 'left',
        render: (row) => (
            <Typography variant="body2" color="text.secondary">
                {row.song.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist'}
            </Typography>
        ),
    },
    {
        id: 'duration',
        label: 'duration',
        align: 'left',
        render: (row) => (
            <Typography variant="body2" color="text.secondary">
                {formatDuration(row.song.duration_ms)}
            </Typography>
        ),
    },
    {
        id: 'nicknames',
        label: 'added by',
        align: 'left',
        render: (row) => (
            <Typography variant="body2" color="text.secondary">
                {row.nickname || 'anonymous'}
            </Typography>
        ),
    },
    {
        id: 'actions',
        label: '',
        align: 'center',
        render: (row) => (
            <Link
                href={row.song?.uri || '#'}
                target="_blank"
                sx={{ color: '#1DB954', '&:hover': { color: '#1976D2' } }}
            >
                <PlayArrowIcon />
            </Link>
        ),
    },
];


export default function SpotifyPlaylistTable(props) {
  const [rows, setRows] = React.useState(props.rows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(() => {
    const sortedRows = [...props.rows].sort((a, b) => {
        // Sort by timestamp in descending order (newest first)
        return b.timestamp - a.timestamp;  // Direct numeric comparison is faster
    });
    setRows(sortedRows);
    }, [props.rows]);

    const handleChangePage = (_, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    };

    return (
    <Paper 
        sx={{ 
            width: '100%', 
            overflow: 'hidden',
        }}>
        <TableContainer>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                <TableRow>
                    {columns.map(({ id, label, align }) => (
                    <StyledTableCell key={id} align={align}>
                        {label}
                    </StyledTableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                    <StyledTableRow key={row.id || index}>
                        {columns.map(({ id, align, render }) => (
                        <StyledTableCell key={id} align={align} sx={{ verticalAlign: "middle" }}>
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
        />
    </Paper>
    );
}