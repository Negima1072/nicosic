import { useEffect, useState } from "react";
import { RiChat4Fill, RiFolderFill, RiHeartFill, RiPlayFill } from "react-icons/ri";
import { NavLink, useParams } from "react-router-dom";
import { getVideoRelatedMylists } from "../../../nico/recommend";
import { getVideoData, getVideoTags } from "../../../nico/video";
import styled from "./VideoDetailPage.module.scss";

export const VideoDetailPage = () => {
    const { videoId } = useParams();
    const [videoData, setVideoData] = useState<EssentialVideo | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [relatedMylists, setRelatedMylists] = useState<RecommendMylistItem[]>([]);
    useEffect(() => {
        async function fetchVideoData() {
            if (videoId) {
                const _video = await getVideoData(videoId);
                setVideoData(_video);
                const _tags = await getVideoTags(videoId);
                setTags(_tags);
                const _related = await getVideoRelatedMylists(videoId);
                setRelatedMylists(_related.items);
            } else {
                setVideoData(null);
                setTags([]);
                setRelatedMylists([]);
            }
        }
        fetchVideoData();
        return () => {};
    }, [videoId]);
    return (
        <div className={styled.videoDetailPage}>
            {videoData && (
                <>
                    <div className={styled.videoInfo}>
                        <img src={videoData.thumbnail.largeUrl} alt="" />
                        <div className={styled.videoDetail}>
                            <span className={styled.videoTitle}>{videoData.title}</span>
                            <NavLink className={styled.videoOwnerData} to={`/user/${videoData.owner.id}`}>
                                <img src={videoData.owner.iconUrl} alt="icon" />
                                <span>{videoData.owner.name}</span>
                            </NavLink>
                            <div className={styled.videoStats}>
                                <div className={styled.videoStatItem}>
                                    <RiPlayFill />
                                    <span>{videoData.count.view.toLocaleString()}</span>
                                </div>
                                <div className={styled.videoStatItem}>
                                    <RiHeartFill />
                                    <span>{videoData.count.like.toLocaleString()}</span>
                                </div>
                                <div className={styled.videoStatItem}>
                                    <RiFolderFill />
                                    <span>{videoData.count.mylist.toLocaleString()}</span>
                                </div>
                                <div className={styled.videoStatItem}>
                                    <RiChat4Fill />
                                    <span>{videoData.count.comment.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className={styled.videoDate}>
                                投稿日時 {new Date(videoData.registeredAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div className={styled.videoDescription}>
                        <span>{videoData.shortDescription}</span>
                    </div>
                    <div className={styled.videoTags}>
                        {tags.map((tag) => (
                            <NavLink
                                key={tag.name}
                                className={styled.videoTag}
                                to={`/search?q=${tag.name}&queryType=tag`}
                            >
                                {tag.name}
                            </NavLink>
                        ))}
                    </div>
                    <div className={styled.relatedMylistContainer}>
                        <h3>関連マイリスト</h3>
                        <div className={styled.relatedMylists}>
                            {relatedMylists.map((mylist) => (
                                <NavLink key={mylist.id} className={styled.userMylistsItem} to={`/mylist/${mylist.id}`}>
                                    {mylist.content.sampleItems.length > 0 && mylist.content.sampleItems[0].video && (
                                        <img
                                            src={mylist.content.sampleItems[0].video.thumbnail.listingUrl}
                                            alt="thumbnail"
                                        />
                                    )}
                                    <div className={styled.userMylistsItemInfo}>
                                        <div className={styled.userMylistsItemTitle}>{mylist.content.name}</div>
                                        <div className={styled.userMylistsItemMeta}>
                                            <span>{mylist.content.itemsCount.toLocaleString()} 作品</span>
                                            <span>{mylist.content.followerCount.toLocaleString()} フォロワー</span>
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
