import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    checkLogin: async () => (await ipcRenderer.invoke("check-login")) as boolean,
    getAppVersion: async () => (await ipcRenderer.invoke("get-app-version")) as string,
    getPlayerConfig: async () => (await ipcRenderer.invoke("get-player-config")) as PlayerConfig,
    savePlayerConfig: (config: PlayerConfig) => ipcRenderer.send("save-player-config", config),
    getConfig: async () => (await ipcRenderer.invoke("get-config")) as Config,
    saveConfig: (config: Config) => ipcRenderer.send("save-config", config),
    requestLogin: () => ipcRenderer.send("request-login"),
    requestLogout: () => ipcRenderer.send("request-logout"),
    openExternal: (url: string) => ipcRenderer.send("open-external", url),
    onLoginSuccess: (callback: () => void) => ipcRenderer.on("login-success", callback),
    onLogoutSuccess: (callback: () => void) => ipcRenderer.on("logout-success", callback),
});
