import bailout from "./bailout";

function delay(seconds) {
    return new Promise((resolve, reject) => setTimeout(resolve, seconds * 1000));
}

(async () => {
    try {
        console.log("loading app...");
        // TODO: uncomment to see splash screen
        //await delay(5);
        require("../../../dist/shim");
        require("../app");
        console.log("app loaded");
    } catch (error) {
        bailout("App could not be loaded.", error);
    }
})();