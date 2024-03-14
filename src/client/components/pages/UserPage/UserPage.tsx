import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { isLoginAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import { followUser, getUserData, getUserMylists, getUserVideos, unfollowUser } from "../../../nico/user";
import styled from "./UserPage.module.scss";
import { VideoItem } from "../../common/VideoItem/VideoItem";
import { VideoItemList } from "../../common/VideoItemList/VideoItemList";

export const UserPage = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [popularWorks, setPopularWorks] = useState<UserVideoItem[]>([]);
    const [newWorks, setNewWorks] = useState<UserVideoItem[]>([]);
    const [mylists, setMylists] = useState<MylistInfoData[]>([]);
    const isLogin = useAtomValue(isLoginAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    const setPlaylistDataAtom = useSetAtom(playlistDataAtom);
    const setPlaylistIndexAtom = useSetAtom(playlistIndexAtom);
    useEffect(() => {
        async function fetchUserData() {
            if (userId) {
                const user = await getUserData(userId);
                setUserData(user);
                const popular = await getUserVideos(userId, "viewCount", "desc", 1, 5);
                setPopularWorks(popular.items);
                const newWorks = await getUserVideos(userId, "registeredAt", "desc", 1, 3);
                setNewWorks(newWorks.items);
                const mylists = await getUserMylists(userId, 1);
                setMylists(mylists.mylists);
            } else {
                setUserData(null);
                setPopularWorks([]);
                setNewWorks([]);
                setMylists([]);
            }
        }
        fetchUserData();
        return () => {};
    }, [userId]);
    const changePlayingId = (video?: EssentialVideo) => {
        if (video && userData) {
            setPlayingData((prev) => ({ ...prev, id: video.id }));
            setPlaylistDataAtom([video]);
            setPlayingListAtom([{ index: 0, id: video.id }]);
            setPlaylistIndexAtom(0);
        }
    };
    const userFollowHandler = async (follow: boolean) => {
        if (userData) {
            if (follow) {
                await followUser(userData.user.id);
            } else {
                await unfollowUser(userData.user.id);
            }
            setUserData((prev) => {
                if (prev) {
                    return {
                        ...prev,
                        relationships: {
                            ...prev.relationships,
                            sessionUser: {
                                ...prev.relationships.sessionUser,
                                isFollowing: follow,
                            },
                        },
                    };
                }
                return prev;
            });
        }
    };
    return (
        <div className={styled.userPage}>
            {userData && (
                <>
                    <div className={styled.userInfo}>
                        {userData.user.coverImage && (
                            <img
                                src={userData.user.coverImage.smartphoneUrl}
                                alt="cover"
                                className={styled.userInfoCover}
                            />
                        )}
                        <div className={styled.userInfoInner}>
                            <img
                                src={userData.user.icons.large}
                                alt="icon"
                                className={`${styled.userInfoIcon} ${userData.user.coverImage ? styled.userInfoIconWithCover : ""}`}
                            />
                            <div className={styled.userInfoMeta}>
                                <span className={styled.userInfoName}>{userData.user.nickname}</span>
                                <div className={styled.userInfoButtons}>
                                    {!userData.relationships.isMe && isLogin && (
                                        <button
                                            className={`${styled.userInfoFollowButton} ${userData.relationships.sessionUser.isFollowing ? styled.userInfoButtonFollowing : ""}`}
                                            onClick={() =>
                                                userFollowHandler(!userData.relationships.sessionUser.isFollowing)
                                            }
                                        >
                                            {userData.relationships.sessionUser.isFollowing ? "フォロー中" : "フォロー"}
                                        </button>
                                    )}
                                    <div className={styled.userInfoSns}>
                                        {userData.user.sns.map((sns) => (
                                            <div
                                                key={sns.type}
                                                className={styled.userInfoSnsItem}
                                                onClick={() => window.electronAPI.openExternal(sns.url)}
                                            >
                                                <img src={sns.iconUrl} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styled.userInfoCounts}>
                                    <div className={styled.userInfoCountsItem}>
                                        <span className={styled.userInfoCountsItemValue}>
                                            {userData.user.followeeCount.toLocaleString()}
                                        </span>
                                        <span>フォロー中</span>
                                    </div>
                                    <div className={styled.userInfoCountsItem}>
                                        <span className={styled.userInfoCountsItemValue}>
                                            {userData.user.followerCount.toLocaleString()}
                                        </span>
                                        <span>フォロワー</span>
                                    </div>
                                </div>
                                <div className={styled.userInfoDescription}>
                                    <span>{userData.user.strippedDescription}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styled.popularWorks}>
                        <h3>人気の作品</h3>
                        <div className={styled.popularWorksList}>
                            {popularWorks.map((item, index) => (
                                <div
                                    key={item.essential.id}
                                    className={styled.popularWorksItem}
                                    onClick={() => changePlayingId(item.essential)}
                                >
                                    <span className={styled.popularWorksItemRank}>{index + 1}</span>
                                    <img src={item.essential.thumbnail.listingUrl} alt="thumbnail" />
                                    <div className={styled.popularWorksItemMeta}>
                                        <div className={styled.popularWorksItemTitle}>{item.essential.title}</div>
                                        <span className={styled.popularWorksItemViewCount}>
                                            {item.essential.count.view.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styled.newWorks}>
                        <div className={styled.newWorksHeader}>
                            <h3>新着の作品</h3>
                            <NavLink to={`/user/${userId}/videos`} className={styled.newWorksLink}>
                                動画一覧
                            </NavLink>
                        </div>
                        <VideoItemList videos={newWorks.map((item) => item.essential)} isSingle={true} />
                    </div>
                    <div className={styled.userMylists}>
                        <h3>公開マイリスト</h3>
                        <div className={styled.userMylistsList}>
                            {mylists.map((item) => (
                                <NavLink key={item.id} className={styled.userMylistsItem} to={`/mylist/${item.id}`}>
                                    {item.sampleItems.length > 0 && item.sampleItems[0].video && (
                                        <img src={item.sampleItems[0].video.thumbnail.listingUrl} alt="thumbnail" />
                                    )}
                                    <div className={styled.userMylistsItemInfo}>
                                        <div className={styled.userMylistsItemTitle}>{item.name}</div>
                                        <div className={styled.userMylistsItemMeta}>
                                            <span>{item.itemsCount.toLocaleString()} 作品</span>
                                            <span>{item.followerCount.toLocaleString()} フォロワー</span>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
