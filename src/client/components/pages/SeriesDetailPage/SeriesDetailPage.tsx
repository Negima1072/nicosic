import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { isShuffleAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import { getSeriesItems } from "../../../nico/list";
import styled from "./SeriesDetailPage.module.scss";
import { VideoItem } from "../../common/VideoItem/VideoItem";

export const SeriesDetailPage = () => {
    const { seriesId } = useParams();
    const [series, setSeries] = useState<SeriesData | null>(null);
    const isShuffle = useAtomValue(isShuffleAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    const setPlaylistDataAtom = useSetAtom(playlistDataAtom);
    const setPlaylistIndexAtom = useSetAtom(playlistIndexAtom);
    useEffect(() => {
        async function fetchSeries() {
            if (seriesId) {
                const _series = await getSeriesItems(seriesId);
                setSeries(_series);
            } else {
                setSeries(null);
            }
        }
        fetchSeries();
        return () => {};
    }, [seriesId]);
    const changePlayingId = (index: number, video?: EssentialVideo) => {
        if (video && series) {
            setPlayingData((prev) => ({ ...prev, id: video.id }));
            setPlaylistDataAtom(series.items.map((item) => item.video));
            let list = series.items.map((item, index) => ({ index, id: item.video?.id }));
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
        <div className={styled.seriesDetailPage}>
            {series && (
                <>
                    <div className={styled.seriesDetail}>
                        <div className={styled.seriesTitle}>{series.detail.title}</div>
                        <NavLink className={styled.seriesOwner} to={`/user/${series.detail.owner.user.id}`}>
                            <img src={series.detail.owner.user.icons.small} alt="icon" />
                            <span>{series.detail.owner.user.nickname}</span>
                        </NavLink>
                        <div className={styled.seriesMeta}>
                            <span>全{series.totalCount}件</span>
                            <span>作成日: {new Date(series.detail.createdAt).toLocaleString()}</span>
                            <span>更新日: {new Date(series.detail.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className={styled.seriesItems}>
                        {series.items.map((item, index) => (
                            <VideoItem
                                key={item.meta.order}
                                video={item.video}
                                onClick={() => changePlayingId(index, item.video)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
