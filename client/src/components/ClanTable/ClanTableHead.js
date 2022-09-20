import React from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import classes from './ClanTable.module.css';

// All the categories (epg, e/d etc.. )
const headCells = [
    {
        id: 'playerID',
        numeric: true,
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

ClanTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

export default function ClanTableHead(props) {
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