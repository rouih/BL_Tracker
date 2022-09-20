import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import classes from './ClanTable.module.css';

export default function ClanTableToolbar(props){
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