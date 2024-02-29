import { RiBarChartHorizontalFill, RiHome2Fill, RiSearchLine, RiUser3Fill, RiVipCrownFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import styled from "./SideMenu.module.scss";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { isLoginAtom, loginUserDataAtom } from "../../atoms";
import { getOwnUserData } from "../../nico/user";

export const SideMenu = () => {
    const [isLogin, setIsLogin] = useAtom(isLoginAtom);
    const [loginUserData, setLoginUserData] = useAtom(loginUserDataAtom);
    useEffect(() => {
        window.electronAPI.checkLogin();
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
        }
    }, []);
    return (
        <div className={styled.sideMenu}>
            <NavLink to="/" className={({ isActive }) => `${styled.menuItem} ${isActive ? styled.active : ""}`}>
                <RiHome2Fill />
                <span>ホーム</span>
            </NavLink>
            <NavLink to="/ranking" className={({ isActive }) => `${styled.menuItem} ${isActive ? styled.active : ""}`}>
                <RiVipCrownFill />
                <span>ランキング</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `${styled.menuItem} ${isActive ? styled.active : ""}`}>
                <RiSearchLine />
                <span>検索</span>
            </NavLink>
            <NavLink to="/mylist" className={({ isActive }) => `${styled.menuItem} ${isActive ? styled.active : ""}`}>
                <RiBarChartHorizontalFill />
                <span>マイリスト</span>
            </NavLink>
            {isLogin && loginUserData ? (
                <div className={`${styled.menuItem} ${styled.userMenu}`}>
                    <img src={loginUserData.icons.small} alt="icon" className={styled.icon} />
                    <span>{loginUserData.nickname}</span>
                </div>
            ) : (
                <div className={`${styled.menuItem} ${styled.userMenu}`} onClick={() => window.electronAPI.requestLogin()}>
                    <RiUser3Fill />
                    <span>ログイン</span>
                </div>
            )}
        </div>
    );
};
