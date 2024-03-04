import { useEffect, useState } from "react";
import styled from "./ConfigPage.module.scss";
import { EqualizerController } from "../../common/EqualizerController/EqualizerController";
import { useAtom } from "jotai";
import { configAtom } from "../../../atoms";

export const ConfigPage = () => {
    const [appVersion, setAppVersion] = useState<string>('');
    const [config, setConfig] = useAtom(configAtom);
    useEffect(() => {
        window.electronAPI.getAppVersion().then((version) => {
            setAppVersion(version);
        });
    })
    const handleEqualizerChange = (value: TEqualizerValue) => {
        setConfig({
            ...config,
            equalizer: value,
        });
    }
    return (
        <div className={styled.configPage}>
            <div className={styled.appInfo}>
                <h1>nicosic</h1>
                <span>version: {appVersion}</span>
            </div>
            {config && (
                <div className={styled.configItem}>
                    <span className={styled.configItemTitle}>イコライザ</span>
                    <div className={styled.equalizerController}>
                        <EqualizerController defaultEqualizerValue={config.equalizer} onValueChange={handleEqualizerChange}/>
                    </div>
                </div>
            )}
        </div>
    );
};
