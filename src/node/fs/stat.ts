import {stat, Stats} from "fs";

export default async function statAsyc(path: string | Buffer) {
    return await new Promise<Stats>((resolve, reject) => {
        stat(path, (error, stats) => {
            if (error) {
                reject(error);
            } else {
                resolve(stats);
            }
        });
    });
}