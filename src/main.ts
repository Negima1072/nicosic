import { BrowserWindow, app, ipcMain } from "electron";
import Store from "electron-store";
import globalVal from "./global";
import path from "node:path";
import expressApp from "./server";

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

if (process.env.NODE_ENV !== "development" || app.isPackaged) {
    app.disableHardwareAcceleration();
}

const expressServer = expressApp.listen(4080, "127.0.0.1");

const store = new Store<AppConfig>();

const user_session = store.get("user_session");
if (user_session && globalVal.cookieJar) {
    globalVal.cookieJar.setCookie(`user_session=${user_session}`, "https://www.nicovideo.jp");
}

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            devTools: process.env.NODE_ENV === "development",
        },
    });

    ipcMain.on("request-login", (event: Electron.IpcMainEvent) => {
        const loginWindow = new BrowserWindow({
            width: 800, height: 600,
            webPreferences: {
                devTools: process.env.NODE_ENV === "development",
            },
        });

        loginWindow.loadURL("https://account.nicovideo.jp/login?site=niconico").then(() => {
            loginWindow.focus();
        });

        loginWindow.webContents.on("did-navigate", async (event, url) => {
            if (url.startsWith("https://www.nicovideo.jp")) {
                const cookie = await loginWindow.webContents.session.cookies.get({ name: "user_session" });
                if (cookie.length !== 0) {
                    store.set("user_session", cookie[0].value);
                    if (globalVal.cookieJar) globalVal.cookieJar.setCookie(`user_session=${cookie[0].value}`, "https://www.nicovideo.jp");
                }
                loginWindow.close();
            }
        });
    });

    mainWindow.loadURL("http://127.0.0.1:4080");
});

app.once("window-all-closed", () => {
    console.log(globalVal.cookieJar?.toJSON())
    expressServer.close();
    app.quit();
});
