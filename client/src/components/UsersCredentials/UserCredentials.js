import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Modal from '@mui/material/Modal';
import classes from './UserCredentials.module.css';

export default function UserCredentials() {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [activisionId, setActivisionId] = useState('');
    const [platform, setPlatform] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return <>
        <button onClick={handleOpen}>Add Player</button>
        <Modal
            open={open}
            onClose={handleClose}>
            <Box className={classes.modal}>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player Name" margin='dense'/>
                <Input value={activisionId} onChange={(e) => setActivisionId(e.target.value)} placeholder="Activision Id"/>
                <Input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Platform"/>
                <button className={classes.submitButton}>Submit</button>
            </Box>
        </Modal>
    </>
}
