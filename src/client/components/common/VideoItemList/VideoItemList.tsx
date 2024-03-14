import { useAtomValue, useSetAtom } from "jotai";
import { VideoItem } from "../VideoItem/VideoItem";
import styled from "./VideoItemList.module.scss";
import { isShuffleAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";

interface VideoItemListProps {
    videos: (EssentialVideo | undefined)[];
    isRanking?: boolean;
    isSingle?: boolean;
}

export const VideoItemList = (props: VideoItemListProps) => {
    const isShuffle = useAtomValue(isShuffleAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    const setPlaylistDataAtom = useSetAtom(playlistDataAtom);
    const setPlaylistIndexAtom = useSetAtom(playlistIndexAtom);
    const changePlayingId = (index: number, video?: EssentialVideo) => {
        if (video && props.videos) {
            setPlayingData((prev) => ({ ...prev, id: video.id }));
            if (props.isSingle) {
                setPlaylistDataAtom([video]);
                setPlayingListAtom([{ index: 0, id: video.id }]);
                setPlaylistIndexAtom(0);
            } else {
                setPlaylistDataAtom(props.videos.map((item) => item));
                let list = props.videos.map((item, index) => ({ index, id: item?.id }));
                let newIndex = index;
                if (isShuffle) {
                    list = list.sort(() => Math.random() - 0.5);
                    newIndex = list.findIndex((item) => item.index === index);
                }
                setPlayingListAtom(list);
                setPlaylistIndexAtom(newIndex);
            }
        }
    };
    return (
        <div className={styled.videoItems}>
            {props.videos.map((video, index) => (
                <VideoItem
                    key={index}
                    video={video}
                    ranking={props.isRanking ? {index} : undefined}
                    onClick={() => changePlayingId(index, video)}
                />
            ))}
        </div>
    );
};
