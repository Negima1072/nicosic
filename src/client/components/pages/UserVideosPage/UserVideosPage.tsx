import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserVideos } from "../../../nico/user";
import { VideoItemList } from "../../common/VideoItemList/VideoItemList";
import styled from "./UserVideosPage.module.scss";

export const UserVideosPage = () => {
    const { userId } = useParams();
    const [userVideos, setUserVideos] = useState<UserVideosData | null>(null);
    useEffect(() => {
        async function fetchUserVideos() {
            if (userId) {
                const _userVideos = await getUserVideos(userId, undefined, undefined, 1, 100);
                setUserVideos(_userVideos);
            } else {
                setUserVideos(null);
            }
        }
        fetchUserVideos();
        return () => {};
    }, [userId]);
    return (
        <div className={styled.userVideosPage}>
            {userVideos && (
                <>
                    <div className={styled.userVideosDetail}>
                        <div className={styled.userVideosTitle}>投稿一覧</div>
                        <div className={styled.userVideosMeta}>
                            <span>全{userVideos.totalCount}件</span>
                        </div>
                    </div>
                    <VideoItemList videos={userVideos.items.map((item) => item.essential)} />
                </>
            )}
        </div>
    );
};
