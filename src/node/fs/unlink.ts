import {unlink} from "fs";

export default async function unlinkAsync(path: string | Buffer) {
    return await new Promise<void>((resolve, reject) => {
        unlink(path, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}