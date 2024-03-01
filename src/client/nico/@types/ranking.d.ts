interface RankingSettings {
    settings: RankingSetting[];
    trendSettings: TrendRankingSetting[];
}

interface TrendRankingSetting {
    id: number;
    term: RankingTerm;
    default: boolean;
    priority: number;
}

type RankingTerm = "total" | "month" | "week" | "24h";

interface RankingSetting {
    tag: string | null;
    genre: RankingGenre;
    id: number;
    term: RankingTerm;
    default: boolean;
    priority: number;
}

interface RankingGenre {
    key: string;
    label: string;
}

interface ProcessedRankingSetting {
    title: string;
    terms: ProcessedRankingTerm[];
    priority: number;
    isTrend: boolean;
}

interface ProcessedRankingTerm {
    id: number;
    term: RankingTerm;
}

interface RankingData {
    ranking: RankingDetailData;
}

interface RankingDetailData {
    id: number;
    setting: RankingSetting;
    videos: EssentialVideo[];
    hasNext: boolean;
}
