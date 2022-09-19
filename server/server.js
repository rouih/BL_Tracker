import { config } from 'dotenv';
import express, { request } from 'express';
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


app.get('/userData/:userName', async (req, res) => {
    const userName = req.params.userName;
    if (!userName)
        return res.status(400).send('invalid userName');

    try {
        const isUserExists = await UsersFileManager.isUserAlreadyExistSync(userName);
        if (!isUserExists) res.status(400).send('no such user');
    } catch (err) {
        return errorHandler(err, 'something went wrong', res);
    }

    try {
        const userData = await UsersFileManager.getUserData(userName);
        res.send(userData);
    } catch (err) {
        return errorHandler(err, 'failed to fetch user data', res);
    }
});


app.get('/allUsersData', async (req, res) => {
    try {
        const allUsersData = await UsersFileManager.getAllUsersData();
        return res.send(allUsersData);
    } catch (err) {
        return errorHandler(err, 'failed to fetch all users data', res);
    }
});


app.post('/addUser', async (req, res) => {
    const { userName, activisionId, platform } = req.body;
    if (!userName || !activisionId || !platform)
        return res.status(400).send('missing information');

    try {
        const isUserAlreadyExist = await UsersFileManager.isUserAlreadyExistSync(userName);
        if (isUserAlreadyExist) res.status(400).send('user already exists');
    } catch (err) {
        return errorHandler(err, 'something went wrong', res);
    }
    try {
        await UsersFileManager.createNewUserFile(userName, activisionId, platform);
        res.send(`User ${userName} has been created successfully`);
    } catch (err) {
        return errorHandler(err, 'failed to create user', res);
    }
});

app.delete('/deleteUser/:userName', async (req, res) => {
    const userNameToDelete = req.params.userName;
    try {
        await UsersFileManager.removeUserDataFromAFile(userNameToDelete);
        res.send(`User ${userNameToDelete} has been deleted successfully`);
    } catch (err) {
        return errorHandler(err, 'failed to delete user', res);
    }

});

app.post('/updateUserImage', async (req, res) => {
    const { img, userName } = req.body;
    if (!img)
        return res.status(400).send('invalid user image');
    try {
        await UsersFileManager.updateUserImg(userName, img);
    } catch (err) {
        return errorHandler(err, 'failed to update user image', res);
    }
});


app.get('/refreshUsersStats', async (req, res) => {
    let usersCredentials = [];
    try {
        usersCredentials = await getAllUsersCredentials();
    } catch (err) {
        return errorHandler(err, 'Failed to get users data', res);
    }

    let isFirstRequest = true;
    for (const userCredentials of usersCredentials) {

        if (isFirstRequest) isFirstRequest = false;
        // delay the next request because the api allows only one request per minute
        else await delayApiRequest(API_REQUEST_DELAY_MS);

        const data = await fetchUserData(userCredentials);
        if (!data)
            return res.status(400).send('failed to fetch user stats');
        try {
            await UsersFileManager.updateUserData(userCredentials.userName, data);
        } catch (err) {
            return errorHandler(err, 'failed to update user data', res);
        }
    }
    return res.send('Stats refreshed successfully');
});


app.get('/getAllUsersData', async (req, res) => {
    const usersData = await getAllUsersData();
    if (!usersData) {
        return res.status(400).send("Failed to get users data");
    }

    return res.send(usersData);
});



const getAllUsersCredentials = async () => {
    const usersData = await UsersFileManager.getAllUsersData();
    if (!usersData.length)
        throw new Error("users list is empty");
    return usersData.map(userData => userData.userCredentials);
};



const fetchUserData = async (userCredentials) => {
    const { userName, activisionId, platform } = userCredentials;
    console.log(userName, activisionId, platform);
    try {
        const { data } = await axios.get(`https://call-of-duty-vanguard.p.rapidapi.com/${platform}/user/${userName}#${activisionId}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': X_RAPID_API_HOST
            }
        });
        return data;
    } catch (err) {
        console.error(err);
        return null;
    };
};

const errorHandler = (err, message, response) => {
    console.error(err);
    return response.status(400).send(message);
};


app.listen(4000, () => console.log("listening on port 4000"));
