import {mkdtemp} from "fs";
import {tmpdir} from "os";
import {sep, normalize, parse} from "path";
import process = require("process");

export default async function mkdTempAsync() {
    let prefix: string = `${normalize(tmpdir())}${sep}`;
    if (process.argv0) {
        prefix += `${parse(process.argv0).base}-`;
    }
    return await new Promise<string>((resolve, reject) => {
        mkdtemp(prefix, (error, dirName) => {
            if (error) {
                reject(error);
            }
            resolve(dirName);
        });
    });
}