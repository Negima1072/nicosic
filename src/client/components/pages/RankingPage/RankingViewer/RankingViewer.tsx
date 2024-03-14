import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiFolderFill, RiHeartFill, RiPlayFill } from "react-icons/ri";
import {
    isShuffleAtom,
    playingDataAtom,
    playingListAtom,
    playlistDataAtom,
    playlistIndexAtom,
} from "../../../../atoms";
import { getRankingItems } from "../../../../nico/ranking";
import { getNicoboxTrendVideos } from "../../../../nico/recommend";
import styled from "./RankingViewer.module.scss";
import { secondsToTime } from "../../../../utils/time";

interface RankingViewerProps {
    rankingId: number;
    isTrend: boolean;
}

export const RankingViewer = ({ rankingId, isTrend }: RankingViewerProps) => {
    const [rankingVideos, setRankingVideos] = useState<EssentialVideo[] | null>(null);
    const isShuffle = useAtomValue(isShuffleAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    const setPlaylistDataAtom = useSetAtom(playlistDataAtom);
    const setPlaylistIndexAtom = useSetAtom(playlistIndexAtom);
    const changePlayingId = (index: number, video?: EssentialVideo) => {
        if (video && rankingVideos) {
            setPlayingData((prev) => ({ ...prev, id: video.id }));
            setPlaylistDataAtom(rankingVideos);
            let list = rankingVideos.map((item, index) => ({ index, id: item.id }));
            let newIndex = index;
            if (isShuffle) {
                list = list.sort(() => Math.random() - 0.5);
                newIndex = list.findIndex((item) => item.index === index);
            }
            setPlayingListAtom(list);
            setPlaylistIndexAtom(newIndex);
        }
    };
    useEffect(() => {
        async function fetchRankingVideos() {
            if (rankingId === null) {
                setRankingVideos(null);
                return;
            }
            if (isTrend) {
                const trend = await getNicoboxTrendVideos();
                setRankingVideos(trend.items.map((item) => item.content));
            } else {
                const ranking = await getRankingItems(rankingId);
                setRankingVideos(ranking.videos);
            }
        }
        fetchRankingVideos();
        return () => {};
    }, [isTrend, rankingId]);
    return (
        <div className={styled.rankingViewer}>
            {rankingVideos && (
                <>
                    <div className={styled.rankingItems}>
                        {rankingVideos.map((item, index) => (
                            <div
                                key={index}
                                className={styled.rankingItem}
                                onClick={() => changePlayingId(index, item)}
                            >
                                <div className={styled.rankingItemIndex}>
                                    <span>{index + 1}</span>
                                </div>
                                <div className={styled.videoImage}>
                                    {item && <img src={item.thumbnail.listingUrl} alt="thumbnail" />}
                                </div>
                                <div className={styled.rankingItemInfo}>
                                    {item ? (
                                        <>
                                            <div className={styled.rankingItemTitle}>{item.title}</div>
                                            <div className={styled.rankingItemDetail}>
                                                <div className={styled.rankingItemMeta1}>
                                                    <span>{item.owner.name}</span>
                                                    <span>/</span>
                                                    <span>{secondsToTime(item.duration)}</span>
                                                </div>
                                                <div className={styled.rankingItemMeta2}>
                                                    <div className={styled.rankingItemMetaItem}>
                                                        <RiPlayFill />
                                                        <span>{item.count.view.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.rankingItemMetaItem}>
                                                        <RiHeartFill />
                                                        <span>{item.count.like.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.rankingItemMetaItem}>
                                                        <RiFolderFill />
                                                        <span>{item.count.mylist.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.rankingItemMetaItem}>
                                                        <span>{new Date(item.registeredAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <span>削除された動画</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
