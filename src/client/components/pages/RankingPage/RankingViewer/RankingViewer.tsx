import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
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
import { VideoItem } from "../../../common/VideoItem/VideoItem";

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
                            <VideoItem
                                key={index}
                                video={item}
                                ranking={{index}}
                                onClick={() => changePlayingId(index, item)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
