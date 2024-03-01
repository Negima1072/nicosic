import { useEffect, useMemo, useRef, useState } from "react";
import { getRankingProcessedSettings, getRankingSettings, rankingTerm2String } from "../../../nico/ranking";
import { RankingViewer } from "./RankingViewer/RankingViewer";
import styled from "./RankingPage.module.scss";
import { useSearchParams } from "react-router-dom";

export const RankingPage = () => {
    const [rankingSettings, setRankingSettings] = useState<ProcessedRankingSetting[]>([]);
    const rankingSelectorRef = useRef<HTMLDivElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [rankingIndex, termIndex] = useMemo(() => {
        const rankingIndex = parseInt(searchParams.get("rankingIndex") ?? "0");
        const termIndex = parseInt(searchParams.get("termIndex") ?? "0");
        return [rankingIndex, termIndex];
    }, [searchParams]);
    const [isTrend, rankingId] = useMemo(() => {
        const ranking = rankingSettings[rankingIndex];
        if (ranking === undefined) return [false, null];
        const term = ranking.terms[termIndex];
        if (term === undefined) return [false, null];
        return [ranking.isTrend, term.id];
    }, [rankingSettings, rankingIndex, termIndex]);
    const onRankingSelectorMoveDown = () => {
        if (rankingSelectorRef.current) {
            const onMouseMove = (e: MouseEvent) => {
                rankingSelectorRef.current!.scrollLeft -= e.movementX;
            };
            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }
    };
    const onRankingSelectorWheel = (e: React.WheelEvent) => {
        if (rankingSelectorRef.current) {
            rankingSelectorRef.current.scrollLeft += e.deltaY * 0.5;
        }
    }
    const setRankingIndex = (index: number) => {
        setSearchParams({ rankingIndex: index.toString(), termIndex: "0" });
    };
    const setTermIndex = (index: number) => {
        setSearchParams({ termIndex: index.toString(), rankingIndex: rankingIndex.toString() });
    };
    useEffect(() => {
        async function fetchRankingSettings() {
            const settings = await getRankingSettings();
            const processed = await getRankingProcessedSettings(settings);
            setRankingSettings(processed);
        }
        fetchRankingSettings();
        return () => {};
    }, []);
    return (
        <div className={styled.rankingPage}>
            <div className={styled.rankingSettings}>
                <div className={styled.rankingSelector} onMouseDown={onRankingSelectorMoveDown} onWheel={onRankingSelectorWheel} ref={rankingSelectorRef}>
                    {rankingSettings.map((setting, i) => (
                        <div key={i} onClick={() => setRankingIndex(i)} className={i === rankingIndex ? styled.selected : ""}>
                            {setting.title}
                        </div>
                    ))}
                </div>
                <div className={styled.termSelector}>
                    <select value={rankingSettings[rankingIndex]?.terms[termIndex]?.id} onChange={(e) => setTermIndex(e.target.selectedIndex)}>
                        {rankingSettings[rankingIndex]?.terms.map((term, i) => (
                            <option key={i} value={term.id}>
                                {rankingTerm2String(term.term)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {rankingId && (
                <RankingViewer isTrend={isTrend} rankingId={rankingId} />
            )}
        </div>
    );
};
