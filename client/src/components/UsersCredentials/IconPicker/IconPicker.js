import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import classes from './IconPicker.module.css';
import { PlayerIcons } from '../../../assets/playerIcons/PlayerIcon';

export default function IconPicker(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIconUrl, setSelectedIconUrl] = useState(PlayerIcons[0]);

    function iconSelectedHandler(icon) {
        setSelectedIconUrl(icon);
        setAnchorEl(null);
        props.iconSelectedHandker(icon)
    }

    return <>
        <img src={selectedIconUrl} className={classes.iconBtn} onClick={e => setAnchorEl(e.currentTarget)} />
        
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <div>
                {PlayerIcons.map((icon, index) => {
                    return <img key={index} src={icon} className={classes.iconBtn} onClick={() => iconSelectedHandler(icon)} />
                })}
            </div>
        </Popover>
    </>
}