import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    checkLogin: () => ipcRenderer.send("check-login"),
    requestLogin: () => ipcRenderer.send("request-login"),
    requestLogout: () => ipcRenderer.send("request-logout"),
    openExternal: (url: string) => ipcRenderer.send("open-external", url),
    onLoginSuccess: (callback: () => void) => ipcRenderer.on("login-success", callback),
    onLogoutSuccess: (callback: () => void) => ipcRenderer.on("logout-success", callback),
});
