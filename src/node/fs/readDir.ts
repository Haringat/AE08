import {readdir} from "fs";

export default async function readDirAsync(path: string | Buffer) {
    return await new Promise<Array<string>>((resolve, reject) => {
        readdir(path, (error, content) => {
            if (error) {
                reject(error);
            } else {
                resolve(content);
            }
        });
    });
}