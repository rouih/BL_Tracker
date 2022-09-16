'use strict';
import { config } from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import UsersFileManager from './users-files-manager.js';
config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const X_RAPID_API_HOST = "call-of-duty-vanguard.p.rapidapi.com";

const API_REQUEST_DELAY_MS = 60 * 1000; // delay of one minute to allow follow up API requests to work
const delayApiRequest = ms => new Promise(res => setTimeout(res, ms));

app.post('/addUser', async (req, res) => {
    const { userName, activisionId, platform } = req.body;
    if (!userName || !activisionId || !platform)
        return res.status(400).send('missing information');


    const userData = {
        userCredentials: {
            userName,
            activisionId,
            platform,
        },
        stats: {}
    };
    try {
        await UsersFileManager.saveUserDataToAFile(userData);
        res.send(`User ${userData.userCredentials.userName} has been created successfully`);
    } catch (err) {
        console.log(err);
        res.status(400).send("Failed to create user");
    }
});

app.delete('/deleteUser/:userName', async (req, res) => {
    const userNameToDelete = req.params.userName;
    try {
        await UsersFileManager.removeUserDataFromAFile(userNameToDelete);
        res.send(`User ${userNameToDelete} has been deleted successfully`);
    } catch (err) {
        console.error(err);
        res.status(400).send('failed to delete user');
    }

});


app.get('/refreshUsersStats', async (req, res) => {
    const usersCredentials = await getAllUsersCredentials();
    if (!usersCredentials)
        return res.status(400).send("Failed to get users data");

    let isFirstRequest = true;
    for (const userCredentials of usersCredentials) {

        if (isFirstRequest) isFirstRequest = false;
        // delay the next request because the api allows only one request per minute
        else await delayApiRequest(API_REQUEST_DELAY_MS);

        const userStats = await fetchUserStats(userCredentials);
        if (!userStats)
            return res.status(400).send('failed to fetch user stats');
        try {
            await UsersFileManager.saveUserDataToAFile({ userCredentials, userStats });
        } catch (err) {
            return res.status(400).send(err.message);
        }
    }
    return res.send('Stats refreshed successfully');
});



const getAllUsersCredentials = async () => {
    const usersData = await UsersFileManager.getAllUsersData();
    if (!usersData.length) return null;
    return usersData.map(userData => userData.userCredentials);

};



const fetchUserStats = async (userCredentials) => {
    const { userName, activisionId, platform } = userCredentials;
    try {
        const { data } = await axios.get(`https://call-of-duty-vanguard.p.rapidapi.com/${platform}/user/${userName}#${activisionId}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': X_RAPID_API_HOST
            }
        });

        return data.summary;
    } catch (err) {
        console.error(err);
        return null;
    }
};


app.listen(4000, () => console.log("listening on port 4000"));
