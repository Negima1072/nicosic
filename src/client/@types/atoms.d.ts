interface IPlayingData {
    id?: string;
    watch?: WatchData;
}

interface IPlaylistData {
    index: number;
    id?: string;
}

type RepeatMode = "none" | "one" | "all";
