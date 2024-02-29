import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage/HomePage";
import { MylistDetailPage } from "../pages/MylistDetailPage/MylistDetailPage";
import { MylistPage } from "../pages/MylistPage/MylistPage";
import { RankingPage } from "../pages/RankingPage/RankingPage";
import { SearchPage } from "../pages/SearchPage/SearchPage";
import { UserPage } from "../pages/UserPage/UserPage";
import styled from "./MainFrame.module.scss";
import { ConfigPage } from "../pages/ConfigPage/ConfigPage";

export const MainFrame = () => {
    return (
        <div className={styled.mainFrame}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/mylist" element={<MylistPage />} />
                <Route path="/mylist/:mylistId" element={<MylistDetailPage />} />
                <Route path="/user/:userId" element={<UserPage />} />
                <Route path="/config" element={<ConfigPage />} />
            </Routes>
        </div>
    );
};
