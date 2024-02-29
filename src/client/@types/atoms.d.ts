interface IPlayingData {
    id?: string;
    watch?: WatchData
}

interface IPlaylistData {
    originalIndex: number;
    id: string;
}

type RepeatMode = 'none' | 'one' | 'all';
