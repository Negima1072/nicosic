import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiPriceTag3Fill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import {
    isLoginAtom,
    isShuffleAtom,
    loginUserDataAtom,
    playingDataAtom,
    playingListAtom,
    playlistDataAtom,
    playlistIndexAtom,
} from "../../../atoms";
import { getHomeRecommendVideos, getPopularWorks, getTrendUserMylists } from "../../../nico/recommend";
import {
    getHomePickupFrames,
    getMylistRankingFrames,
    getPastEventFrames,
    getTwitterMylistFrames,
} from "../../../nico/wktk";
import styled from "./HomePage.module.scss";

export const HomePage = () => {
    const isLogin = useAtomValue(isLoginAtom);
    const loginUserData = useAtomValue(loginUserDataAtom);
    const [pickupFrames, setPickupFrames] = useState<WktkFrameItem<WktkHomePickupItem>[]>([]);
    const [trendVideos, setTrendVideos] = useState<RecommendVideoWithReasonItem[]>([]);
    const [recommendWorks, setRecommendWorks] = useState<RecommendVideoWithReasonItem[]>([]);
    const [popularMylists, setPopularMylists] = useState<WktkFrameItem<WktkMylistRankingItem>[]>([]);
    const [popularUserMylists, setPopularUserMylists] = useState<RecommendMylistItem[]>([]);
    const [tweetMylists, setTweetMylists] = useState<WktkFrameItem<WktkTwitterMylistItem>[]>([]);
    const [pastEventFrames, setPastEventFrames] = useState<WktkFrameItem<WktkPastEventItem>[]>([]);
    const isShuffle = useAtomValue(isShuffleAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    const setPlaylistDataAtom = useSetAtom(playlistDataAtom);
    const setPlaylistIndexAtom = useSetAtom(playlistIndexAtom);
    useEffect(() => {
        async function fetchHome() {
            const pickupFrames = await getHomePickupFrames();
            setPickupFrames(pickupFrames);
            const popularWorks = await getPopularWorks();
            setTrendVideos(popularWorks.items);
            const popularMylists = await getMylistRankingFrames();
            setPopularMylists(popularMylists);
            const popularUserMylists = await getTrendUserMylists();
            setPopularUserMylists(popularUserMylists.items);
            const tweetMylists = await getTwitterMylistFrames();
            setTweetMylists(tweetMylists);
            const pastEventFrames = await getPastEventFrames();
            setPastEventFrames(pastEventFrames);
        }
        fetchHome();
    }, []);
    useEffect(() => {
        async function fetchRecommend() {
            if (isLogin && loginUserData) {
                const recommendWorks = await getHomeRecommendVideos(loginUserData.id);
                setRecommendWorks(recommendWorks.items);
            }
        }
        fetchRecommend();
    }, [isLogin, loginUserData]);
    const changePlayingIdHome = (index: number, mylist?: RecommendVideoWithReasonItem[], video?: EssentialVideo) => {
        if (video && mylist) {
            setPlayingData((prev) => ({ ...prev, id: video.id }));
            setPlaylistDataAtom(mylist.map((item) => item.content));
            let list = mylist.map((item, index) => ({ index, id: item.content.id }));
            let newIndex = index;
            if (isShuffle) {
                list = list.sort(() => Math.random() - 0.5);
                newIndex = list.findIndex((item) => item.index === index);
            }
            setPlayingListAtom(list);
            setPlaylistIndexAtom(newIndex);
        }
    };
    return (
        <div className={styled.homePage}>
            <h1 className={styled.title}>nicosic</h1>
            <div className={styled.homeTopicItem}>
                <h3>PICK UP</h3>
                <div className={styled.eventItems}>
                    {pickupFrames.map((frame) => (
                        <NavLink
                            key={frame.itemId}
                            className={styled.homeItem}
                            to={`/${frame.values.link.type}/${frame.values.link.origin}`}
                        >
                            {frame.values.image.url && (
                                <img src={frame.values.image.url} alt={frame.values.image.alt} />
                            )}
                            <span className={styled.itemLabel}>{frame.values.label.context}</span>
                            <span className={styled.itemContent}>{frame.values.description.context}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
            {isLogin && recommendWorks.length > 0 && (
                <div className={styled.homeTopicItem}>
                    <h3>おすすめの作品</h3>
                    <div className={styled.workItems}>
                        {recommendWorks.map((work, index) => (
                            <div
                                key={work.id}
                                className={styled.homeItem}
                                onClick={() => changePlayingIdHome(index, recommendWorks, work.content)}
                            >
                                <img src={work.content.thumbnail.listingUrl} alt="work" />
                                <span className={styled.itemContent}>{work.content.title}</span>
                                <span className={styled.reasonTag}>
                                    <RiPriceTag3Fill />
                                    {work.reason.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className={styled.homeTopicItem}>
                <h3>人気の作品</h3>
                <div className={styled.workItems}>
                    {trendVideos.map((video, index) => (
                        <div
                            key={video.id}
                            className={styled.homeItem}
                            onClick={() => changePlayingIdHome(index, trendVideos, video.content)}
                        >
                            <img src={video.content.thumbnail.listingUrl} alt="work" />
                            <span className={styled.itemLabel}>{video.reason.tag}</span>
                            <span className={styled.itemContent}>{video.content.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styled.homeTopicItem}>
                <h3>人気のマイリスト</h3>
                <div className={styled.mylistItems}>
                    {popularMylists.map((mylist) => (
                        <NavLink
                            key={mylist.itemId}
                            className={styled.homeItem}
                            to={`/mylist/${mylist.values.mylist.mylist.id}`}
                        >
                            {mylist.values.mylist.mylist.videos[0].largeThumbnailUrl ? (
                                <img src={mylist.values.mylist.mylist.videos[0].largeThumbnailUrl} alt="mylist" />
                            ) : (
                                <img src={mylist.values.mylist.mylist.videos[0].thumbnailUrl} alt="mylist" />
                            )}
                            <span className={styled.itemContent}>{mylist.values.mylist.mylist.name}</span>
                            <span className={styled.reasonTag}>{mylist.values.mylist.mylist.nickname}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className={styled.homeTopicItem}>
                <h3>人気のユーザー</h3>
                <div className={styled.userItems}>
                    {popularUserMylists.map((mylist) => (
                        <NavLink
                            key={mylist.content.owner.id}
                            className={styled.homeItem}
                            to={`/user/${mylist.content.owner.id}`}
                        >
                            <img src={mylist.content.owner.iconUrl} alt="user" />
                            <span className={styled.userContent}>{mylist.content.owner.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className={styled.homeTopicItem}>
                <h3>ツイートされたマイリスト</h3>
                <div className={styled.mylistItems}>
                    {tweetMylists.map((mylist) => (
                        <NavLink
                            key={mylist.itemId}
                            className={styled.homeItem}
                            to={`/mylist/${mylist.values.mylist.mylist.id}`}
                        >
                            {mylist.values.mylist.mylist.videos[0].largeThumbnailUrl ? (
                                <img src={mylist.values.mylist.mylist.videos[0].largeThumbnailUrl} alt="mylist" />
                            ) : (
                                <img src={mylist.values.mylist.mylist.videos[0].thumbnailUrl} alt="mylist" />
                            )}
                            <span className={styled.itemContent}>{mylist.values.mylist.mylist.name}</span>
                            <span className={styled.mylistTweet}>{mylist.values.description.context}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className={styled.homeTopicItem}>
                <h3>過去のイベント</h3>
                <div className={styled.eventItems}>
                    {pastEventFrames.map((event) => (
                        <NavLink
                            key={event.itemId}
                            className={styled.homeItem}
                            to={`/${event.values.link.type}/${event.values.link.origin}`}
                        >
                            {event.values.image.url && (
                                <img src={event.values.image.url} alt={event.values.image.alt} />
                            )}
                            <span className={styled.itemLabel}>{event.values.label.context}</span>
                            <span className={styled.itemContent}>{event.values.description.context}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};
