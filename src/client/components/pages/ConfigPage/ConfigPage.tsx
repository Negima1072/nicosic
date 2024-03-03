import { useEffect, useState } from "react";
import styled from "./ConfigPage.module.scss";

export const ConfigPage = () => {
    const [appVersion, setAppVersion] = useState<string>('');
    useEffect(() => {
        window.electronAPI.getAppVersion().then((version) => {
            setAppVersion(version);
        });
    })
    return (
        <div className={styled.configPage}>
            <div className={styled.appInfo}>
                <h1>nicosic</h1>
                <span>version: {appVersion}</span>
            </div>
        </div>
    );
};
