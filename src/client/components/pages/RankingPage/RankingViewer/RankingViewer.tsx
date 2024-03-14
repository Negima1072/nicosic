import { useEffect, useState } from "react";
import { getRankingItems } from "../../../../nico/ranking";
import { getNicoboxTrendVideos } from "../../../../nico/recommend";
import styled from "./RankingViewer.module.scss";
import { VideoItemList } from "../../../common/VideoItemList/VideoItemList";

interface RankingViewerProps {
    rankingId: number;
    isTrend: boolean;
}

export const RankingViewer = ({ rankingId, isTrend }: RankingViewerProps) => {
    const [rankingVideos, setRankingVideos] = useState<EssentialVideo[] | null>(null);
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
                <VideoItemList videos={rankingVideos} isRanking={true} />
            )}
        </div>
    );
};
