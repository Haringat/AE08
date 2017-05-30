import {readFile} from "fs";

export default async function readFileAsync(path: string) {
    return await new Promise<Buffer>((resolve, reject) => {
        readFile(path, (error, content) => {
            if (error) {
                reject(error);
            } else {
                resolve(content);
            }
        });
    });
}