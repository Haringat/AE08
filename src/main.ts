import electron = require("electron");
import readConfig from "./config";
import "./backend/app";

type BrowserWindowType = typeof electron.BrowserWindow.prototype;

const {
    BrowserWindow,
    app
} = electron;

let windows: Array<BrowserWindowType> = [];

let primaryDisplay;

(async () => {
    app.on("ready", async () => {
        try {
            primaryDisplay = electron.screen.getPrimaryDisplay();
            await init();
        } catch (e) {
            console.log(e);
        }
    });
})();

async function init() {
    let config = await readConfig();
    windows.splice(0, 0, new BrowserWindow(Object.assign({}, config.mainWindow.size, {
        maximizable: true,
        center: true
    })));
    windows[0].webContents.openDevTools();
    if (config.mainWindow.size.isMaximized) {
        windows[0].maximize();
    }
    windows[0].loadURL(`file://${__dirname}/../frontend/index.html`);
}

async function createWindow(options: {
    width: number,
    height: number,
    content: string,
    onClose?: () => void
}) {
    let window = new BrowserWindow({
        width: options.width,
        height: options.height
    });
    window.loadURL(options.content);

    window.on("close", () => {
        if (options.onClose && options.onClose instanceof Function) {
            options.onClose();
        }
    });

    return window;
}

