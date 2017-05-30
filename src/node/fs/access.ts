import {access} from "fs";

const callbackFactory = function(resolve: Function, reject: Function) {
    return (err) => {
        if (err) {
            reject(err)
        } else {
            resolve();
        }
    }
};

export default function accessAsync(path: string, mode?: number) {
    return new Promise<void>((resolve, reject) => {
        if (mode) {
            access(path, mode, callbackFactory(resolve, reject));
        } else {
            access(path, callbackFactory(resolve, reject));
        }
    });
}