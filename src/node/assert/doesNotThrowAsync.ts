import {AssertionError} from "assert";
import {EOL} from "os";

export default async function doesNotThrowAsync(block: () => Promise<any>, errorOrMessage: string | Function | RegExp | ((err: any) => boolean), message?: string) {
    let thrown: Error;
    try {
        await block();
    } catch (error) {
        thrown = error;
    }
    if (thrown) {
        let error = new AssertionError({message: (message ? message : "Block execution threw an error.") + EOL + "Error:" + EOL + thrown.stack , stackStartFunction: block});
        if (!message) {
            throw error;
        } else if (errorOrMessage instanceof RegExp) {
            if (errorOrMessage.test(thrown.message)) {
                throw error;
            }
        } else if (errorOrMessage && (<Function> errorOrMessage).prototype instanceof Error) {
            if (thrown instanceof (<Function> errorOrMessage)) {
                throw new AssertionError(`Block execution threw an error which is not an instance of ${(<Function> errorOrMessage).name}`);
            }
        } else if (errorOrMessage instanceof Function) {
            if ((<(err: any) => boolean> errorOrMessage).apply(undefined, thrown)) {
                throw error;
            }
        } else {
            new AssertionError({message: "Block execution threw an error." + EOL + "Error:" + EOL + thrown.stack , stackStartFunction: block});
        }
    }
}