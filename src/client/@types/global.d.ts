declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

interface ElectronAPI {
    requestLogin: () => void;
    openExternal: (url: string) => void;
}

export {};
