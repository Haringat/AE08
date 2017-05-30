import {rmdir} from "fs";

export default async function rmDirAsync(path: string | Buffer) {
    return await new Promise<void>((resolve, reject) => {
        rmdir(path, ((error) => {
            if (error) {
                reject(error);
            }
            resolve();
        }))
    })
}