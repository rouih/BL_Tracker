import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import classes from './ClanTable.module.css';

function createData(playerID, playerName, playerED, playerBestMatchElim, playerEPG, playerWinPercentage, playerAccuracy, playerHSAccuracy, playerGamesPlayed) {
    return {
        playerID,
        playerName,
        playerED,
        playerBestMatchElim,
        playerEPG,
        playerWinPercentage,
        playerAccuracy,
        playerHSAccuracy,
        playerGamesPlayed
    };
}

const rows = [
    createData('5732522', 'Viktor', 1.43, 51, 14.59, 42.20, 16.90, 20.40, 173),
    createData('8694763', 'JarringStream43', 1.40, 38, 13.11, 45.30, 18.80, 13.60, 190),
    createData('3729397', 'shlomile', 1.29, 67, 15.66, 43.30, 15.70, 15.60, 282),
    createData('9612709', 'vAKN1N', 1.22, 41, 11.08, 48.40, 18.40, 35.80, 155),
    createData('5632400', 'harel62', 1.23, 30, 8.45, 33.70, 13.80, 17.40, 92),
    createData('8094996', 'Hatch97', 1.11, 39, 10.42, 43.90, 17.00, 8.70, 114),
    createData('7300902', 'iNo Eliran2508', 0.99, 26, 5.80, 28.70, 26.20, 21.60, 94),
    createData('21965', 'MOSHE', 0.88, 36, 10.28, 50.0, 10.20, 6.80, 102),
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'playerID',
        numeric: false,
        disablePadding: true,
        label: 'ID',
    },
    {
        id: 'playerName',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'playerED',
        numeric: true,
        disablePadding: false,
        label: 'E/D',
    },
    {
        id: 'playerBestMatchElim',
        numeric: true,
        disablePadding: false,
        label: 'Best Match Eliminations',
    },
    {
        id: 'playerEPG',
        numeric: true,
        disablePadding: false,
        label: 'EPG',
    },
    {
        id: 'playerWinPercentage',
        numeric: true,
        disablePadding: false,
        label: 'Win Percentage',
    },
    {
        id: 'playerAccuracy',
        numeric: true,
        disablePadding: false,
        label: 'Accuracy',
    },
    {
        id: 'playerHSAccuracy',
        numeric: true,
        disablePadding: false,
        label: 'HS Accuracy',
    },
    {
        id: 'playerGamesPlayed',
        numeric: true,
        disablePadding: false,
        label: 'Games Played',
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        classes={{ root: classes.sortDesign, active: classes.activeSortDesign, hover: classes.activeSortDesign }}
                    >
                        <TableSortLabel sx={
                            {
                                '& .MuiTableSortLabel-icon': {
                                    color: 'red !important',
                                },
                            }
                        }
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            classes={{ root: classes.sortDesign, active: classes.activeSortDesign, hover: classes.activeSortDesign }}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
    return (
        <Toolbar className={classes.titleDesign}
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
                align='center'
                className={classes.titleDesign}
            >
                BL Clan Table
            </Typography>
        </Toolbar>
    );
};

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('playerED');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        className={classes.tableDesign}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.name}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                align='center'
                                                padding="none"
                                                className={classes.cellDesign}
                                            >
                                                {row.playerID}
                                            </TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerName}</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerED}</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerBestMatchElim}</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerEPG}</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerWinPercentage} %</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerAccuracy} %</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerHSAccuracy} %</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerGamesPlayed}</TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}