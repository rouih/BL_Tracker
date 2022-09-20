import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import ClanTableHead from './ClanTableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import classes from './ClanTable.module.css';
import axios from 'axios';
import { Toolbar } from '@mui/material';

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

export default function ClanTable() {
    const [rows, setRows] = useState([])
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('playerED');
    let playersData = [];

    useEffect(() => {
        axios.get(`http://localhost:4000/getAllUsersData`)
            .then(response => {
                playersData = response.data;
                initializeRows();
            }).catch(err => {
                console.log(err);
            });

    }, []);

    function initializeRows() {
        let currentUserDataToAdd;
        let userStatsLength;
        let tempUserRow = [];
        playersData.forEach(currentPlayerData => {
            userStatsLength = currentPlayerData.userStatsRecord.length;
            currentUserDataToAdd = {
                playerID: currentPlayerData.userCredentials.activisionId,
                playerName: currentPlayerData.userCredentials.userName,
                playerED: currentPlayerData.userStatsRecord[userStatsLength - 1].stats.kdRatio,
                playerBestMatchElim: currentPlayerData.userStatsRecord[userStatsLength - 1].stats.bestMatchKills,
                playerEPG: currentPlayerData.userStatsRecord[userStatsLength - 1].stats.killsPerMatch,
                playerWinPercentage: currentPlayerData.userStatsRecord[userStatsLength - 1].stats.winPercent,
                playerAccuracy: currentPlayerData.userStatsRecord[userStatsLength - 1].stats.accuracy.percent,
                playerHSAccuracy: currentPlayerData.userStatsRecord[userStatsLength - 1].stats.headshotAccuracy.percent,
                playerGamesPlayed: currentPlayerData.userStatsRecord[userStatsLength - 1].stats.totalMatches
            };
            tempUserRow.push(currentUserDataToAdd);
        });

        setRows(tempUserRow);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Toolbar className={classes.titleDesign}>
                    BL Clan
                </Toolbar>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        className={classes.tableDesign}
                    >
                        <ClanTableHead
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
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerWinPercentage}</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerAccuracy}</TableCell>
                                            <TableCell align="center" className={classes.cellDesign}>{row.playerHSAccuracy}</TableCell>
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