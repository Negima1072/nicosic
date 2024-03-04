declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

interface ElectronAPI {
    checkLogin: () => Promise<boolean>;
    getAppVersion: () => Promise<string>;
    getPlayerConfig: () => Promise<PlayerConfig>;
    savePlayerConfig: (config: PlayerConfig) => void;
    getConfig: () => Promise<Config>;
    saveConfig: (config: Config) => void;
    requestLogin: () => void;
    requestLogout: () => void;
    openExternal: (url: string) => void;
    onLoginSuccess: (callback: () => void) => void;
    onLogoutSuccess: (callback: () => void) => void;
}

export {};
