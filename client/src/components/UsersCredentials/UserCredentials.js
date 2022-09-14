import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import classes from './UserCredentials.module.css';

export default function UserCredentials() {

    const platforms = ["battle", "pls", "xbl"]

    const [open, setOpen] = useState(false);
    const [userName, setName] = useState('');
    const [activisionId, setActivisionId] = useState('');
    const [platformIndex, setPlatformIndex] = useState(0);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    async function clickHandler() {
        let platform = platforms[platformIndex]
        await axios.post('http://localHost:4000/addUser', { userName, activisionId, platform });
    }


    return <>
        <button className={classes.addPlayerButton} onClick={handleOpen}>Add Player</button>
        <Modal
            open={open}
            onClose={handleClose}>
            <Box className={classes.modal}>
                <InputLabel>User Name: </InputLabel>
                <Input value={userName} onChange={(e) => setName(e.target.value)} placeholder="example: Viktor" required />
                <InputLabel>Activision Id: </InputLabel>
                <Input value={activisionId} onChange={(e) => setActivisionId(e.target.value)} placeholder="example: 5732522" required />
                <InputLabel>Platform: </InputLabel>
                <Select value={platformIndex} onChange={(e) => setPlatformIndex(e.target.value)} placeholder="Platform" required >
                    {platforms.map((platform, index) => {
                        return <MenuItem key={index} value={index}>{platform}</MenuItem>
                    })}
                </Select>
                <button className={classes.submitButton} onClick={clickHandler}>Submit</button>
            </Box>
        </Modal>
    </>
}
