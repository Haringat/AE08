import rmDirAsync from "./rmDir";
import unlinkAsync from "./unlink";
import readDirAsync from "./readDir";
import statAsync from "./stat";
import {sep, normalize} from "path";
import "../../shim/array/forEachAsync";

export default async function rmRecursiveAsync(path: string | Buffer) {
    const entries = await readDirAsync(path);
    await entries.forEachAsync(async (entry) => {
        const entryPath = normalize(path.toString() + sep + entry);
        const stat = await statAsync(entryPath);
        if (stat.isDirectory()) {
            await rmRecursiveAsync(entryPath);
        } else {
            await unlinkAsync(entryPath);
        }
    });
    await rmDirAsync(normalize(path.toString()));
}