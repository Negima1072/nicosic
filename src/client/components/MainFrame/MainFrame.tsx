import { MdArrowBackIos } from "react-icons/md";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ConfigPage } from "../pages/ConfigPage/ConfigPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { MylistDetailPage } from "../pages/MylistDetailPage/MylistDetailPage";
import { MylistPage } from "../pages/MylistPage/MylistPage";
import { NextPlayPage } from "../pages/NextPlayPage/NextPlayPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { RankingPage } from "../pages/RankingPage/RankingPage";
import { SearchPage } from "../pages/SearchPage/SearchPage";
import { SeriesDetailPage } from "../pages/SeriesDetailPage/SeriesDetailPage";
import { UserPage } from "../pages/UserPage/UserPage";
import { UserVideosPage } from "../pages/UserVideosPage/UserVideosPage";
import { VideoDetailPage } from "../pages/VideoDetailPage/VideoDetailPage";
import styled from "./MainFrame.module.scss";

export const MainFrame = () => {
    const navigate = useNavigate();
    const backBtnHandler = () => {
        navigate(-1);
    };
    return (
        <div className={styled.mainFrame}>
            <div className={styled.header}>
                <button onClick={backBtnHandler} className={styled.backBtn}>
                    <MdArrowBackIos />
                </button>
            </div>
            <div className={styled.content}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/ranking" element={<RankingPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/mylist" element={<MylistPage />} />
                    <Route path="/mylist/:mylistId" element={<MylistDetailPage />} />
                    <Route path="/series/:seriesId" element={<SeriesDetailPage />} />
                    <Route path="/user/:userId" element={<UserPage />} />
                    <Route path="/user/:userId/videos" element={<UserVideosPage />} />
                    <Route path="/video/:videoId" element={<VideoDetailPage />} />
                    <Route path="/nextplay" element={<NextPlayPage />} />
                    <Route path="/config" element={<ConfigPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </div>
    );
};
