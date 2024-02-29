import { useAtom } from "jotai";
import { useEffect } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import { RiBarChartHorizontalFill, RiHome2Fill, RiSearchLine, RiUser3Fill, RiVipCrownFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { isLoginAtom, loginUserDataAtom } from "../../atoms";
import { getOwnUserData } from "../../nico/user";
import styled from "./SideMenu.module.scss";

export const SideMenu = () => {
    const [isLogin, setIsLogin] = useAtom(isLoginAtom);
    const [loginUserData, setLoginUserData] = useAtom(loginUserDataAtom);
    const { show: showUserContext } = useContextMenu({ id: "user-context" });
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
        };
    }, []);
    const displayUserContext = (e: React.MouseEvent) => {
        showUserContext({ event: e });
    };
    const userClickHandler = () => {
        if (!isLogin) {
            window.electronAPI.requestLogin();
        }
    }
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
            <div
                className={`${styled.menuItem} ${styled.userMenu}`}
                onClick={userClickHandler}
                onContextMenu={displayUserContext}
            >
                {isLogin && loginUserData ? (
                    <>
                        <img src={loginUserData.icons.small} alt="icon" className={styled.icon} />
                        <span>{loginUserData.nickname}</span>
                    </>
                ) : (
                    <>
                        <RiUser3Fill />
                        <span>ログイン</span>
                    </>
                )}
                <Menu id="user-context" theme="dark" animation={false}>
                    <Item>
                        <NavLink to="/config" className={styled.navLink}>
                            設定
                        </NavLink>
                    </Item>
                    {isLogin && loginUserData && (
                        <Item onClick={() => window.electronAPI.requestLogout()}>ログアウト</Item>
                    )}
                </Menu>
            </div>
        </div>
    );
};
