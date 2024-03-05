import { useEffect, useState } from "react";
import { getHomeRecommendVideos, getPopularWorks, getTrendUserMylists } from "../../../nico/recommend";
import styled from "./HomePage.module.scss";
import { useAtomValue } from "jotai";
import { isLoginAtom, loginUserDataAtom } from "../../../atoms";
import { getHomePickupFrames, getMylistRankingFrames, getPastEventFrames, getTwitterMylistFrames } from "../../../nico/wktk";
import { RiPriceTag3Fill } from "react-icons/ri";

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
    return (
        <div className={styled.homePage}>
            <h1 className={styled.title}>nicosic</h1>
            <div className={styled.homeTopicItem}>
                <h3>PICK UP</h3>
                <div className={styled.eventItems}>
                    {pickupFrames.map((frame) => (
                        <div key={frame.itemId} className={styled.homeItem}>
                            {frame.values.image.url && (
                                <img src={frame.values.image.url} alt={frame.values.image.alt} />
                            )}
                            <span className={styled.itemLabel}>{frame.values.label.context}</span>
                            <span className={styled.itemContent}>{frame.values.description.context}</span>
                        </div>
                    ))}
                </div>
            </div>
            {isLogin && recommendWorks.length > 0 && (
                <div className={styled.homeTopicItem}>
                    <h3>おすすめの作品</h3>
                    <div className={styled.workItems}>
                        {recommendWorks.map((work) => (
                            <div key={work.id} className={styled.homeItem}>
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
                    {trendVideos.map((video) => (
                        <div key={video.id} className={styled.homeItem}>
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
                        <div key={mylist.itemId} className={styled.homeItem}>
                            <img src={mylist.values.mylist.mylist.videos[0].largeThumbnailUrl} alt="mylist" />
                            <span className={styled.itemContent}>{mylist.values.mylist.mylist.name}</span>
                            <span className={styled.reasonTag}>{mylist.values.mylist.mylist.nickname}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styled.homeTopicItem}>
                <h3>人気のユーザー</h3>
                <div className={styled.userItems}>
                    {popularUserMylists.map((mylist) => (
                        <div key={mylist.content.owner.id} className={styled.homeItem}>
                            <img src={mylist.content.owner.iconUrl} alt="user" />
                            <span className={styled.userContent}>{mylist.content.owner.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styled.homeTopicItem}>
                <h3>ツイートされたマイリスト</h3>
                <div className={styled.mylistItems}>
                    {tweetMylists.map((mylist) => (
                        <div key={mylist.itemId} className={styled.homeItem}>
                            <img src={mylist.values.mylist.mylist.videos[0].largeThumbnailUrl} alt="mylist" />
                            <span className={styled.itemContent}>{mylist.values.mylist.mylist.name}</span>
                            <span className={styled.mylistTweet}>{mylist.values.description.context}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styled.homeTopicItem}>
                <h3>過去のイベント</h3>
                <div className={styled.eventItems}>
                    {pastEventFrames.map((event) => (
                        <div key={event.itemId} className={styled.homeItem}>
                            {event.values.image.url && (
                                <img src={event.values.image.url} alt={event.values.image.alt} />
                            )}
                            <span className={styled.itemLabel}>{event.values.label.context}</span>
                            <span className={styled.itemContent}>{event.values.description.context}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
