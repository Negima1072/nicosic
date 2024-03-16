import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isLoginAtom, isShuffleAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import { VideoItem } from "../VideoItem/VideoItem";
import styled from "./VideoItemList.module.scss";
import { Item, ItemParams, Menu, Separator, Submenu, useContextMenu } from "react-contexify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addVideoToMylist, getOwnMylists } from "../../../nico/list";

interface VideoItemListProps {
    videos: (EssentialVideo | undefined)[];
    isRanking?: boolean;
    isSingle?: boolean;
}

interface ContextMenuItemProps {
    video?: EssentialVideo;
}

interface ContextMylistInfoData {
    mylistId: number;
}

export const VideoItemList = (props: VideoItemListProps) => {
    const navigate = useNavigate();
    const { show: showVideoItemContext } = useContextMenu<ContextMenuItemProps>({ id: "videoitem-context" });
    const isLogin = useAtomValue(isLoginAtom);
    const isShuffle = useAtomValue(isShuffleAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const [playingList, setPlayingListAtom] = useAtom(playingListAtom);
    const [playlistData, setPlaylistDataAtom] = useAtom(playlistDataAtom);
    const [playlistIndex, setPlaylistIndexAtom] = useAtom(playlistIndexAtom);
    // TODO: マイリストの情報をAtomで管理する。(issue #13)
    const [mylists, setMylists] = useState<MylistInfoData[]>([]);
    useEffect(() => {
        (async () => {
            if (isLogin) {
                const mylists = await getOwnMylists();
                setMylists(mylists);
            }
        })();
    }, [isLogin]);
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
    const onContextMenu = (e: React.MouseEvent, video?: EssentialVideo) => {
        showVideoItemContext({
            event: e,
            props: { video },
        });
    }
    const cm_addToMylist = ({ props, data }: ItemParams<ContextMenuItemProps, ContextMylistInfoData>) => {
        if (props && props.video && data) {
            addVideoToMylist(data.mylistId, props.video.id);
            // TODO: 再生中のListsにも反映できるようマイリスト情報をローカルで更新する。(issue #13)
        }
    }
    const cm_addToNextplay = ({ props }: ItemParams<ContextMenuItemProps>) => {
        // TODO: 次に見るリストのようなものを別途用意して優先させる。ランダム再生とも競合しないようにする。(issue #12)
        if (props && props.video) {
            const video = props.video;
            if (playingList && playingList.length > 0) {
                const index = playingList.findIndex((item) => item.id === video.id);
                if (index >= 0) {
                    const ob = playingList.splice(index, 1);
                    playingList.splice(playlistIndex + 1, 0, ob[0]);
                    setPlayingListAtom(playingList);
                } else {
                    let videoIndex = playlistData.findIndex((item) => item?.id === video.id);
                    if (videoIndex === -1) {
                        setPlaylistDataAtom((prev) => [...prev, video]);
                        videoIndex = playlistData.length;
                    }
                    playingList.splice(playlistIndex + 1, 0, { index: videoIndex, id: video.id });
                }
            } else {
                setPlayingData((prev) => ({ ...prev, id: video.id }));
                setPlayingListAtom([{ index: 0, id: video.id }]);
                setPlaylistDataAtom([video]);
                setPlaylistIndexAtom(0);
            }
        }
    }
    const cm_navigateMusicInfo = ({ props }: ItemParams<ContextMenuItemProps>) => {
        if (props && props.video) {
            navigate(`/video/${props.video.id}`);
        }
    }
    const cm_navigateUserInfo = ({ props }: ItemParams<ContextMenuItemProps>) => {
        if (props && props.video) {
            navigate(`/user/${props.video.owner.id}`);
        }
    }
    return (
        <div className={styled.videoItems}>
            {props.videos.map((video, index) => (
                <VideoItem
                    key={index}
                    video={video}
                    ranking={props.isRanking ? { index } : undefined}
                    onClick={() => changePlayingId(index, video)}
                    onContextMenu={(e) => onContextMenu(e, video)}
                />
            ))}
            <Menu id="videoitem-context" theme="dark" animation={false}>
                {isLogin && (
                    <Submenu label="マイリストに追加">
                        {mylists.slice(0, 10).map((mylist, index) => (
                            <Item key={index} onClick={cm_addToMylist} data={{ mylistId: mylist.id }}>
                                {mylist.name}
                            </Item>
                        ))}
                    </Submenu>
                )}
                <Item onClick={cm_addToNextplay}>
                    次に再生に追加
                </Item>
                <Separator />
                <Item onClick={cm_navigateMusicInfo}>
                    曲の情報
                </Item>
                <Item onClick={cm_navigateUserInfo}>
                    ユーザーの情報
                </Item>
            </Menu>
        </div>
    );
};
