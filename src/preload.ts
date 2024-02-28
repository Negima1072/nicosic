import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    requestLogin: () => ipcRenderer.send("request-login"),
});
