import { BrowserWindow, app, ipcMain, shell } from "electron";
import Store from "electron-store";
import path from "node:path";
import globalVal from "./global";
import expressApp from "./server";

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
    globalVal.cookieJar.setCookie(
        `user_session=${user_session};Domain=.nicovideo.jp;Path=/`,
        "https://www.nicovideo.jp",
    );
}

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            devTools: process.env.NODE_ENV === "development",
            nodeIntegration: true,
        },
        autoHideMenuBar: true,
    });

    if (process.env.NODE_ENV === "development") {
        mainWindow.setSize(1600, 800);
        mainWindow.webContents.openDevTools();
    }

    ipcMain.on("request-login", (event: Electron.IpcMainInvokeEvent) => {
        const loginWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                devTools: process.env.NODE_ENV === "development",
            },
            autoHideMenuBar: true,
            parent: mainWindow,
        });

        mainWindow.setEnabled(false);

        loginWindow.loadURL("https://account.nicovideo.jp/login?site=niconico").then(() => {
            loginWindow.focus();
        });

        loginWindow.webContents.on("did-navigate", async (_event, url) => {
            if (url.startsWith("https://www.nicovideo.jp")) {
                const cookie = await loginWindow.webContents.session.cookies.get({ name: "user_session" });
                if (cookie.length !== 0) {
                    if (globalVal.cookieJar) {
                        store.set("user_session", cookie[0].value);
                        globalVal.cookieJar.setCookie(
                            `user_session=${cookie[0].value};Domain=.nicovideo.jp;Path=/`,
                            "https://www.nicovideo.jp",
                        );
                        event.sender.send("login-success");
                    }
                }
                loginWindow.close();
            }
        });

        loginWindow.on("closed", () => {
            mainWindow.setEnabled(true);
            mainWindow.focus();
        });
    });

    ipcMain.on("request-logout", (event: Electron.IpcMainInvokeEvent) => {
        if (globalVal.cookieJar) {
            store.delete("user_session");
            globalVal.cookieJar.setCookie("user_session=;Domain=.nicovideo.jp;Path=/", "https://www.nicovideo.jp");
        }

        event.sender.send("logout-success");
    });

    ipcMain.on("open-external", (event, url) => {
        shell.openExternal(url);
    });

    ipcMain.handle("check-login", (event: Electron.IpcMainInvokeEvent) => {
        if (globalVal.cookieJar) {
            const cookie = globalVal.cookieJar.getCookieStringSync("https://www.nicovideo.jp");
            if (cookie.includes("user_session")) {
                return true;
            }
        }
        return false;
    });

    ipcMain.handle("get-player-config", async () => {
        const playerConfig = store.get("player_config", JSON.stringify({
            volume: 1,
            mute: false,
            shuffle: false,
            repeat: "none",
        }));
        return JSON.parse(playerConfig) as PlayerConfig;
    });

    ipcMain.on("save-player-config", (event, config: PlayerConfig) => {
        store.set("player_config", JSON.stringify(config));
    });

    mainWindow.loadURL("http://127.0.0.1:4080");
});

app.on("quit", () => {
    expressServer.close();
})

app.once("window-all-closed", () => {
    expressServer.close();
    app.quit();
});
