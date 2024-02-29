import { atom } from "jotai";

export const isLoginAtom = atom<boolean>(false);
export const loginUserDataAtom = atom<ExpandUser | null>(null);

export const isPlayingAtom = atom(false);
export const playingDataAtom = atom<IPlayingData>({});
export const isShuffleAtom = atom(false);
export const repeatModeAtom = atom<RepeatMode>("none");
export const volumeAtom = atom(0.1);

export const playingListAtom = atom<IPlaylistData[] | null>(null);
export const playlistDataAtom = atom<(EssentialVideo | undefined)[]>([]);
export const playlistIndexAtom = atom(0);
