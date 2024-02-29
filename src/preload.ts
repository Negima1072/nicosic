import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    requestLogin: () => ipcRenderer.send("request-login"),
    openExternal: (url: string) => ipcRenderer.send("open-external", url),
});
