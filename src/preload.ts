const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  requestLogin: () => ipcRenderer.send('request-login')
});
