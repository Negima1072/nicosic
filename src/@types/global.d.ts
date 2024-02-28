declare module '*.sass' {
    const content: Record<string, string>;
    export default content;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

interface ElectronAPI {
    requestLogin: () => void;
}

export {};
