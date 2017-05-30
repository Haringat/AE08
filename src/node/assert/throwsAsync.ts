import {AssertionError} from "assert";
import {EOL} from "os";

export default async function throwsAsync(block: () => Promise<any>, errorOrMessage: string | Function | RegExp | ((err: any) => boolean), message?: string) {
    let thrown: Error;
    try {
        await block();
    } catch (error) {
        thrown = error;
    }
    if (thrown) {
        let error = new AssertionError({message: "Block execution did not throw an exception." + (message ? EOL + " " + message : ""), stackStartFunction: block});
        if (!message) {
            throw error;
        } else if (errorOrMessage instanceof RegExp) {
            if (!errorOrMessage.test(thrown.message)) {
                throw error;
            }
        } else if ((<Function> errorOrMessage).prototype instanceof Error) {
            if (!(thrown instanceof (<Function> errorOrMessage))) {
                throw error;
            }
        } else {
            if (!(<(err: any) => boolean> errorOrMessage).apply(undefined, thrown)) {
                throw error;
            }
        }
    } else {
        throw new AssertionError({message: "Block execution did not throw an exception." + (message ? EOL + " " + message : ""), stackStartFunction: block});
    }
}