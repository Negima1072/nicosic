import { RiFolderFill, RiHeartFill, RiPlayFill } from "react-icons/ri";
import { secondsToTime } from "../../../utils/time";
import styled from "./VideoItem.module.scss";

interface VideoItemProps {
    video?: EssentialVideo;
    ranking?: RankingStatus;
    onClick: () => void;
    onContextMenu?: (e: React.MouseEvent) => void;
}

interface RankingStatus {
    index: number;
}

export const VideoItem = (props: VideoItemProps) => {
    return (
        <div className={styled.videoItem} onClick={props.onClick}>
            {props.ranking && (
                <div className={styled.rankingIndex}>
                    <span>{props.ranking.index + 1}</span>
                </div>
            )}
            <div className={styled.videoImage}>
                {props.video && <img src={props.video.thumbnail.listingUrl} alt="thumbnail" />}
            </div>
            <div className={styled.videoItemInfo} onContextMenu={props.onContextMenu}>
                {props.video ? (
                    <>
                        <div className={styled.videoItemTitle}>{props.video.title}</div>
                        <div className={styled.videoItemDetail}>
                            <div className={styled.videoItemMeta1}>
                                <span>{props.video.owner.name}</span>
                                <span>/</span>
                                <span>{secondsToTime(props.video.duration)}</span>
                            </div>
                            <div className={styled.videoItemMeta2}>
                                <div className={styled.videoItemMetaItem}>
                                    <RiPlayFill />
                                    <span>{props.video.count.view.toLocaleString()}</span>
                                </div>
                                <div className={styled.videoItemMetaItem}>
                                    <RiHeartFill />
                                    <span>{props.video.count.like.toLocaleString()}</span>
                                </div>
                                <div className={styled.videoItemMetaItem}>
                                    <RiFolderFill />
                                    <span>{props.video.count.mylist.toLocaleString()}</span>
                                </div>
                                <div className={styled.videoItemMetaItem}>
                                    <span>{new Date(props.video.registeredAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <span>削除された動画</span>
                )}
            </div>
        </div>
    );
};
