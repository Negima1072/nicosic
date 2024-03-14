import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import {
    configAtom,
    isLoadingAtom,
    isLoginAtom,
    isMuteAtom,
    isShuffleAtom,
    loginUserDataAtom,
    repeatModeAtom,
    volumeAtom,
} from "./atoms";
import { Controller } from "./components/Controller/Controller";
import { MainFrame } from "./components/MainFrame/MainFrame";
import { SideMenu } from "./components/SideMenu/SideMenu";
import { getOwnUserData } from "./nico/user";

export const App = () => {
    const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
    const setIsLogin = useSetAtom(isLoginAtom);
    const setLoginUserData = useSetAtom(loginUserDataAtom);
    const [isShuffle, setIsShuffle] = useAtom(isShuffleAtom);
    const [repeatMode, setRepeatMode] = useAtom(repeatModeAtom);
    const [isMute, setIsMute] = useAtom(isMuteAtom);
    const [volume, setVolume] = useAtom(volumeAtom);
    const [config, setConfig] = useAtom(configAtom);
    useEffect(() => {
        async function initialize() {
            const _isLogin = await window.electronAPI.checkLogin();
            if (_isLogin) {
                try {
                    const user = await getOwnUserData();
                    setIsLogin(true);
                    setLoginUserData(user);
                } catch (e) {
                    setIsLogin(false);
                    setLoginUserData(null);
                }
            }
            const _config = await window.electronAPI.getConfig();
            setConfig(_config);
            const playerConfig = await window.electronAPI.getPlayerConfig();
            setIsShuffle(playerConfig.shuffle);
            setRepeatMode(playerConfig.repeat);
            setIsMute(playerConfig.mute);
            setVolume(playerConfig.volume);
            setIsLoading(false);
        }
        initialize();
        window.electronAPI.onLoginSuccess(async () => {
            try {
                const user = await getOwnUserData();
                setIsLogin(true);
                setLoginUserData(user);
            } catch (e) {
                setIsLogin(false);
                setLoginUserData(null);
            }
        });
        window.electronAPI.onLogoutSuccess(() => {
            setIsLogin(false);
            setLoginUserData(null);
        });
        return () => {
            window.electronAPI.onLoginSuccess(() => {});
            window.electronAPI.onLogoutSuccess(() => {});
        };
    }, []);
    useEffect(() => {
        if (!isLoading) {
            window.electronAPI.savePlayerConfig({
                volume,
                mute: isMute,
                shuffle: isShuffle,
                repeat: repeatMode,
            });
        }
    }, [isMute, isShuffle, repeatMode, volume]);
    useEffect(() => {
        if (!isLoading && config) {
            window.electronAPI.saveConfig(config);
        }
    }, [config]);
    return (
        <div id="container">
            {isLoading ? (
                <div id="loading">
                    <ScaleLoader color="#fff" loading={true} height={60} width={5} radius={10} margin={5} />
                </div>
            ) : (
                <>
                    <div id="main">
                        <SideMenu />
                        <MainFrame />
                    </div>
                    <div id="controller">
                        <Controller />
                    </div>
                </>
            )}
        </div>
    );
};
