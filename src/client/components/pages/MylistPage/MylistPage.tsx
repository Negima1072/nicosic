import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { isLoginAtom } from "../../../atoms";
import { getOwnMylists } from "../../../nico/list";
import styled from "./MylistPage.module.scss";

export const MylistPage = () => {
    const isLogin = useAtomValue(isLoginAtom);
    const [ownMylists, setOwnMylists] = useState<MylistInfoData[]>([]);
    useEffect(() => {
        async function fetchMylists() {
            if (!isLogin) return;
            const mylists = await getOwnMylists();
            setOwnMylists(mylists);
        }
        fetchMylists();
        return () => {};
    }, [isLogin]);
    return (
        <div className={styled.mylistPage}>
            {isLogin ? (
                <>
                    {ownMylists.map((mylist) => (
                        <NavLink key={mylist.id} className={styled.mylistCard} to={`/mylist/${mylist.id}`}>
                            <div className={styled.mylistImage}>
                                {mylist.sampleItems.length > 0 && mylist.sampleItems[0].video && (
                                    <img src={mylist.sampleItems[0].video.thumbnail.listingUrl} alt="thumbnail" />
                                )}
                                <span className={styled.itemsCount}>{mylist.itemsCount}作品</span>
                            </div>
                            <div className={styled.mylistInfo}>
                                <span className={styled.mylistTitle}>{mylist.name}</span>
                                <div className={styled.mylistDescription}>
                                    <span className={styled.mylistOwner}>{mylist.owner.name}</span>
                                    <span className={styled.mylistDetail}>
                                        {mylist.sampleItems
                                            .map((item) => (item.video ? item.video.title : ""))
                                            .join("/")}
                                    </span>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </>
            ) : (
                <div>ログインしてください</div>
            )}
        </div>
    );
};
