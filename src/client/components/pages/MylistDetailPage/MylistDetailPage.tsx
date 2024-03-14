import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getMylistItems } from "../../../nico/list";
import styled from "./MylistDetailPage.module.scss";
import { VideoItemList } from "../../common/VideoItemList/VideoItemList";

export const MylistDetailPage = () => {
    const { mylistId } = useParams();
    const [mylist, setMylist] = useState<MylistDetailData | null>(null);
    useEffect(() => {
        async function fetchMylistDetail() {
            if (mylistId) {
                const _mylist = await getMylistItems(mylistId);
                setMylist(_mylist);
            } else {
                setMylist(null);
            }
        }
        fetchMylistDetail();
        return () => {};
    }, [mylistId]);
    return (
        <div className={styled.mylistDetailPage}>
            {mylist && (
                <>
                    <div className={styled.mylistDetail}>
                        <div className={styled.mylistTitle}>{mylist.name}</div>
                        <NavLink className={styled.mylistOwner} to={`/user/${mylist.owner.id}`}>
                            <img src={mylist.owner.iconUrl} alt="icon" />
                            <span>{mylist.owner.name}</span>
                        </NavLink>
                        <div className={styled.mylistMeta}>
                            <span>全{mylist.totalItemCount}件</span>
                            <span>{mylist.isPublic ? "公開" : "非公開"}マイリスト</span>
                            {mylist.followerCount && <span>{mylist.followerCount}フォロワー</span>}
                        </div>
                    </div>
                    <VideoItemList videos={mylist.items.map((item) => item.video)} />
                </>
            )}
        </div>
    );
};
