import { RiBarChartHorizontalFill, RiHome2Fill, RiSearchLine, RiVipCrownFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import styled from "./SideMenu.module.scss";

export const SideMenu = () => {
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
        </div>
    );
};
