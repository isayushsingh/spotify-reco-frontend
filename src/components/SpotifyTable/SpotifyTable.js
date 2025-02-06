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
        backgroundColor: '#1a9e44',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'pointer',
    },
}));
  
const columns = [
    {
        id: 'index', // Serial number column
        label: '#',
        align: 'center',
        render: (row, index) => <Typography variant="body2" color="text.secondary">{index + 1}</Typography>, // Display index + 1
    },
    {
        id: 'cover',
        label: '',
        align: 'left',
        render: (row) => (
        <img
            src={row.song.album.images[0].url}
            alt={row.song.name}
            style={{ width: 50, height: 50, verticalAlign: 'middle' }}
        />
        ),
    },
    {
        id: 'song.name',
        label: 'Title',
        align: 'left',
        render: (row) => (
        <Typography variant="body2" fontWeight="medium" style={{verticalAlign: 'middle'}}>
            {row.song.name}
        </Typography>
        ),
    },
    {
        id: 'artist',
        label: 'Artist',
        align: 'left',
        render: (row) => (
        <Typography variant="body2" color="text.secondary" style={{verticalAlign: 'middle'}}>
            {row.song.artists.map((artist) => artist.name).join(', ')}
        </Typography>
        ),
    },
    {
        id: 'duration',
        label: 'Duration',
        align: 'left',
        render: (row) => {
        const durationMs = row.song.duration_ms;
        const minutes = Math.floor(durationMs / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        return <Typography variant="body2" color="text.secondary">{formattedDuration}</Typography>;
        },
    },
    {
        id: 'nicknames',
        label: 'Added By',
        align: 'left',
        render: (row) => (
        <Typography variant="body2" color="text.secondary" style={{verticalAlign: 'middle'}}>
            {row.nickname}
        </Typography>
        ),
    },
    {
        id: 'actions',
        label: '',
        align: 'center',
        render: (row) => (
            <Link href={`spotify:track:${row.song.external_urls.spotify}`}  target="_blank"><PlayArrowIcon/></Link>
        ),
    },
];


export default function SpotifyPlaylistTable(props) {
  const [rows, setRows] = React.useState(props.rows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    setRows(props.rows);
  }, [props.rows]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: 'bold' }} // Bold header text
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => ( // Add index here
                <StyledTableRow hover tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = column.render ? column.render(row, index) : row[column.id]; // Pass index to render
                    return <StyledTableCell key={column.id} align={column.align} style={{verticalAlign: 'middle'}}>{value}</StyledTableCell>; // vertical align middle
                  })}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]} // Added more options
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