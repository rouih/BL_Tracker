import { writeFile, readdir, readFile, unlink } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERS_DIR = `${__dirname}/users`;

const API_REQUEST_DELAY_MS = 60 * 1000; // delay of one minute to allow follow up API requests to work


export default class UsersFileManager {
    static async saveUserDataToAFile(userData) {
        await writeFile(`${USERS_DIR}/${userData.userCredentials.userName}.json`,
            JSON.stringify(userData, null, 2),
            (err) => {
                console.error(err);
                throw new Error('failed to save user data');
            });
    }

    static async getAllUsersData() {
        const usersData = [];
        let isFirstRequest = true;
        const filenames = await readdir(USERS_DIR);
        for (const fileName of filenames) {

            if (isFirstRequest) isFirstRequest = false;
            // delay the next request because the api allows only one request per minute
            else setTimeout(() => { }, API_REQUEST_DELAY_MS);

            try {
                const fileContent = JSON.parse(await readFile(`${USERS_DIR}/${fileName}`));
                usersData.push(fileContent);
            } catch (err) {
                console.log(err);
                // not sure if to continue
            }
        }
        return usersData;
    };


    static async removeUserDataFromAFile(userName) {
        await unlink(`${USERS_DIR}/${userName}.json`);
    };

}
