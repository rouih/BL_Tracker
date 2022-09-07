import { config } from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const X_RAPID_API_HOST = "call-of-duty-vanguard.p.rapidapi.com";




app.post('/userStats', async (req, res) => {
    const { userName, activisionId, platform } = req.body;
    if (!userName || !activisionId || !platform) return res.status(400).send('missing information');

    try {
        const { data } = await axios.get(`https://call-of-duty-vanguard.p.rapidapi.com/${platform}/user/${userName}#${activisionId}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': X_RAPID_API_HOST
            }
        });
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(200).send(err.message);
    }

});

app.listen(3000, () => console.log("listening on port 3000"));
