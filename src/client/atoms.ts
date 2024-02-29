import { atom } from 'jotai';

export const isPlayingAtom = atom(false);
export const playingDataAtom = atom<IPlayingData>({});
export const isShuffleAtom = atom(false);
export const repeatModeAtom = atom<RepeatMode>('none');
export const volumeAtom = atom(100);
export const playingListAtom = atom<IPlaylistData[]>([]);
export const playlistDataAtom = atom<[]>([]);
export const playlistIndexAtom = atom(0);
