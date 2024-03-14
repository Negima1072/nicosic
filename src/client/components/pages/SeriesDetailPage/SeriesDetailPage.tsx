import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getSeriesItems } from "../../../nico/list";
import styled from "./SeriesDetailPage.module.scss";
import { VideoItemList } from "../../common/VideoItemList/VideoItemList";

export const SeriesDetailPage = () => {
    const { seriesId } = useParams();
    const [series, setSeries] = useState<SeriesData | null>(null);
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
                    <VideoItemList videos={series.items.map((item) => item.video)} />
                </>
            )}
        </div>
    );
};
