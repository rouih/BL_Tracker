import { writeFile, readdir, readFile, unlink, } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERS_DIR = `${__dirname}/users`;

export default class UsersFileManager {

    static async createNewUserFile(userName, activisionId, platform) {
        const userData = {
            userCredentials: { userName, activisionId, platform },
            userImg: '',
            userStatsRecord: []
        };
        await this.writeUserData(userName, userData);
    }

    static async updateUserData(userName, data) {
        const [ time, stats ] = [ data.time.endTime, data.summary ];

        const storedUserData = await this.getUserData(userName);

        // append the updated user data
        storedUserData.userStatsRecord.push({ time, stats });
        await this.writeUserData(userName, storedUserData);
    }

    static async getAllUsersData() {
        let fileNames = await readdir(USERS_DIR);
        if (!fileNames || fileNames.length === 0)
            throw new Error('No users found');
        const usersData = [];
        fileNames = fileNames.map(fileName => fileName.substring(0, fileName.length - 4 - 1)); //it removes the '.json' extension
        for (const fileName of fileNames) {
            const fileContent = await this.getUserData(fileName);
            usersData.push(fileContent);
        }
        return usersData;
    };

    static async updateUserImg(userName, image) {
        const userData = await this.getUserData(userName);
        userData.img = image;
        return await this.writeUserData(userName, userData);
    }

    static async isUserAlreadyExistSync(userName) {
        return existsSync(`${USERS_DIR}/${userName}.json`);
    }

    static async getUserData(userName) {
        return JSON.parse(await readFile(`${USERS_DIR}/${userName}.json`));
    }

    static async writeUserData(userName, data) {
        await writeFile(`${USERS_DIR}/${userName}.json`,
            JSON.stringify(data, null, 2));
    }

    static async removeUserDataFromAFile(userName) {
        await unlink(`${USERS_DIR}/${userName}.json`);
    };

}
