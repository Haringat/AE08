import {readFile, writeFile} from "./node/fs";
import {EEXIST, ENOENT, EISDIR, EPERM, ENFILE, EINTR, ENOMEM, EACCES} from "constants";
import ErrnoException = NodeJS.ErrnoException;

export interface IConfig {
    api: {
        host: string,
        port: number
    },
    db: {
        host: string,
        port: number
    }
    mainWindow: {
        size: {
            width: number,
            height: number,
            isMaximized: boolean
        },
        position: {
            x: number,
            y: number,
        }
    }
}

const configPath = "./config.json";

const defaultConfig = {
    api: {
        host: "::1",
        port: 6500
    },
    db: {
        host: "::1",
        port: 5432
    },
    mainWindow: {
        size: {
            width: 800,
            height: 600,
            isMaximized: true
        },
        position: {
            x: 100,
            y: 100
        }
    }
};

export default async function readConfig(attempt: number = 1) {
    if (attempt > 10) {
        throw new Error(`critical: Giving up after 10 attempts...`)
    }
    try {
        const configFileContent = await readFile(configPath);
        return JSON.parse(configFileContent.toString());
    } catch (e) {
        const error: NodeJS.ErrnoException = e;
        switch (-error.errno) {
            case ENOENT:
                console.log("info: config file does not exist. Creating it...");
                await createConfigFile();
                return await readConfig(attempt + 1);
            case EISDIR:
                throw new Error(`critical: "${configPath}" exists but is a directory.`);
            case EPERM:
                throw new Error(`critical: You lack the required access rights for "${configPath}"`);
            case ENFILE:
                console.log(`severe: too many open files. Trying again...`);
                return await readConfig(attempt + 1);
            case ENOMEM:
                throw new Error(`critical: Out of memory.`);
            default:
                console.log(error);
                throw new Error(`critical: unknown error occurred while trying to read config file.`);
        }
    }
}

async function createConfigFile(attempt: number = 1) {
    try {
        await writeFile(configPath, JSON.stringify(defaultConfig, null, 4));
    } catch (e) {
        //noinspection UnnecessaryLocalVariableJS
        const error: NodeJS.ErrnoException = e;
        switch (error.errno) {
            case EEXIST:
                console.log("config file already exists.");
                break;
            case EISDIR:
                throw new Error(`critical: "${configPath}" already exists but is a directory.`);
            case EACCES:
            case EPERM:
                throw new Error(`critical: You lack the required permissions to create "${configPath}"`);
            case EINTR:
                if (attempt < 10) {
                    console.log(`warning: could not create error file due to system call interrupt. (attempt ${attempt}). Trying again...`);
                    return createConfigFile(attempt + 1);
                } else {
                    throw new Error(`critical: could not create error file due to system call interrupt. Giving up after ${attempt} attempt.`);
                }
            case ENOMEM:
                throw new Error(`critical: Out of memory.`);
            default:
                throw new Error(`critical: unknown error occurred while trying to write config file.`);
        }
    }
}