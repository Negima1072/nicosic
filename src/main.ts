import { BrowserWindow, app } from "electron";
import path from "node:path";

import expressApp from "./server";
const expressServer = expressApp.listen(4080, "127.0.0.1");

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

if (process.env.NODE_ENV === "development") {
    require("electron-reload")(__dirname, {
        electron: path.resolve(
            __dirname,
            process.platform === "win32"
                ? "../node_modules/electron/dist/electron.exe"
                : "../node_modules/.bin/electron",
        ),
        forceHardReset: true,
        hardResetMethod: "exit",
    });
}

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.loadURL("http://127.0.0.1:4080");
});

app.once("window-all-closed", () => {
    expressServer.close();
    app.quit();
});
