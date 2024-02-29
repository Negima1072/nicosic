declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

interface ElectronAPI {
    checkLogin: () => void;
    requestLogin: () => void;
    requestLogout: () => void;
    openExternal: (url: string) => void;
    onLoginSuccess: (callback: () => void) => void;
    onLogoutSuccess: (callback: () => void) => void;
}

export {};
