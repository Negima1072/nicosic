import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiFolderFill, RiHeartFill, RiPlayFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { isShuffleAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import { getSeriesItems } from "../../../nico/list";
import styled from "./SeriesDetailPage.module.scss";

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
    const secondsToTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };
    return (
        <div className={styled.seriesDetailPage}>
            {series && (
                <>
                    <div className={styled.seriesDetail}>
                        <div className={styled.seriesTitle}>{series.detail.title}</div>
                        <div className={styled.seriesOwner}>
                            <img src={series.detail.owner.user.icons.small} alt="icon" />
                            <span>{series.detail.owner.user.nickname}</span>
                        </div>
                        <div className={styled.seriesMeta}>
                            <span>全{series.totalCount}件</span>
                            <span>作成日: {new Date(series.detail.createdAt).toLocaleString()}</span>
                            <span>更新日: {new Date(series.detail.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className={styled.seriesItems}>
                        {series.items.map((item, index) => (
                            <div
                                key={item.meta.order}
                                className={styled.seriesItem}
                                onClick={() => changePlayingId(index, item.video)}
                            >
                                <div className={styled.videoImage}>
                                    {item.video && <img src={item.video.thumbnail.listingUrl} alt="thumbnail" />}
                                </div>
                                <div className={styled.seriesItemInfo}>
                                    {item.video ? (
                                        <>
                                            <div className={styled.seriesItemTitle}>{item.video.title}</div>
                                            <div className={styled.seriesItemDetail}>
                                                <div className={styled.seriesItemMeta1}>
                                                    <span>{item.video.owner.name}</span>
                                                    <span>/</span>
                                                    <span>{secondsToTime(item.video.duration)}</span>
                                                </div>
                                                <div className={styled.seriesItemMeta2}>
                                                    <div className={styled.seriesItemMetaItem}>
                                                        <RiPlayFill />
                                                        <span>{item.video.count.view.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.seriesItemMetaItem}>
                                                        <RiHeartFill />
                                                        <span>{item.video.count.like.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.seriesItemMetaItem}>
                                                        <RiFolderFill />
                                                        <span>{item.video.count.mylist.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.seriesItemMetaItem}>
                                                        <span>
                                                            {new Date(item.video.registeredAt).toLocaleString()}
                                                        </span>
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
