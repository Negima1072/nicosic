import { NicoError, get } from "./common";

export async function getRankingSettings(): Promise<RankingSettings> {
    const url = `https://nvapi.nicovideo.jp/v1/ranking/nicobox/settings?_language=ja-jp`;
    const res = await get<NvAPIResponse<RankingSettings>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function getRankingProcessedSettings(settings: RankingSettings): Promise<ProcessedRankingSetting[]> {
    const processed: ProcessedRankingSetting[] = [];
    settings.settings.forEach((setting) => {
        const title = setting.tag ?? setting.genre.label;
        const existingIndex = processed.findIndex((p) => p.title === title && p.priority === setting.priority);
        if (existingIndex === -1) {
            const terms: ProcessedRankingTerm[] = [];
            terms.push({ id: setting.id, term: setting.term });
            processed.push({ title, terms, priority: setting.priority, isTrend: false });
        } else {
            processed[existingIndex].terms.push({ id: setting.id, term: setting.term });
        }
    });
    settings.trendSettings.forEach((setting) => {
        const title = "トレンド";
        const existingIndex = processed.findIndex((p) => p.title === title && p.priority === setting.priority);
        if (existingIndex === -1) {
            const terms: ProcessedRankingTerm[] = [];
            terms.push({ id: setting.id, term: setting.term });
            processed.push({ title, terms, priority: setting.priority, isTrend: true });
        } else {
            processed[existingIndex].terms.push({ id: setting.id, term: setting.term });
        }
    });
    processed.sort((a, b) => b.priority - a.priority);
    return processed;
}

export async function getRankingItems(rankingId: number, pageSize?: number, page?: number): Promise<RankingDetailData> {
    let url = `https://nvapi.nicovideo.jp/v1/ranking/nicobox/${rankingId}`;
    const params = new URLSearchParams();
    params.append("_language", "ja-jp");
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (page !== undefined) params.append("page", page.toString());
    if (params.toString() !== "") url += "?" + params.toString();
    const res = await get<NvAPIResponse<RankingData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.ranking;
}

export function rankingTerm2String(term: RankingTerm): string {
    if (term === "24h") return "24時間";
    if (term === "month") return "月間";
    if (term === "total") return "全期間";
    if (term === "week") return "週間";
    return term;
}
