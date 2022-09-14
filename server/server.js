import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import { writeFile, readdir, readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const X_RAPID_API_HOST = "call-of-duty-vanguard.p.rapidapi.com";

const USERS_DIR = `${__dirname}/users`;


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

        await saveUserDataToAFile(userData);
        res.send(`User ${userData.userCredentials.userName} has been created successfully`);
    } catch (err) {
        console.log(err);
        res.status(400).send("Failed to create user");
    }
});


app.get('/refreshUsersStats', async (req, res) => {

    const usersCredentials = await getAllUsersCredentials();
    if (!usersCredentials)
        return res.status(400).send("Failed to get users data");

    for (const userCredentials of usersCredentials) {
        const userStats = await fetchUserStats(userCredentials);
        if (!userStats) {
            return res.status(400).send('failed to fetch user stats');
        }
        await saveUserDataToAFile({ userCredentials, userStats});
    }


    return res.send('Stats refreshed successfully');

});



const getAllUsersCredentials = async () => {
    const usersData = await getAllUsersData();
    if (!usersData) return null;
    return usersData.map(userData => userData.userCredentials);

};

const getAllUsersData = async () => {
    const usersData = [];
    try {
        const filenames = await readdir(USERS_DIR);
        for (const fileName of filenames) {
            try {
                const fileContent = JSON.parse(await readFile(`${USERS_DIR}/${fileName}`));
                usersData.push(fileContent);
            } catch (err) {
                console.log(err);
                // not sure if to continue
            }
        }
    } catch (err) {
        console.log(err);
        return null;
    }
    return usersData;
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
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
};


const saveUserDataToAFile = async (userData) => {
    // console.log(__dirname);
    await writeFile(`${USERS_DIR}/${userData.userCredentials.userName}.json`,
        JSON.stringify(userData, null, 2),
        (err) => console.log(err));

};


app.listen(4000, () => console.log("listening on port 4000"));
