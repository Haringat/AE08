import {readFile, writeFile} from "./node/fs";
import {EEXIST, ENOENT, EISDIR, EPERM, ENFILE, EINTR, ENOMEM, EACCES} from "constants";
import ErrnoException = NodeJS.ErrnoException;


export interface IConfig {
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

const defaultConfig: IConfig = {
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
    let configFileContent: Buffer;
    try {
        configFileContent = await readFile(configPath);
    } catch (e) {
        const error: NodeJS.ErrnoException = e;
        switch (error.errno) {
            case ENOENT:
                console.log("info: config file does not exist. Creating it...");
                return await createConfigFile();
            case EISDIR:
                throw new Error(`critical: "${configPath}" exists but is a directory.`);
            case EPERM:
                throw new Error(`critical: You lack the required access rights for "${configPath}"`);
            case ENFILE:
                if (attempt < 10) {
                    console.log(`warning: too many open files (${attempt}. attempt). Trying again...`);
                    return await readConfig(attempt + 1);
                } else {
                    throw new Error(`critical: too many open files. Giving up after 3 attempts`);
                }
            case ENOMEM:
                throw new Error(`critical: Out of memory.`);
            default:
                console.log(error);
                throw new Error(`critical: unknown error occurred while trying to read config file.`);
        }
    }
    return JSON.parse(configFileContent.toString());
}

async function createConfigFile(attempt: number = 1) {
    try {
        await writeFile(configPath, defaultConfig);
    } catch (e) {
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
    return await readConfig();
}