import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { searchUsers } from "../../../../nico/saerch";
import styled from "./UserSearchViewer.module.scss";

interface UserSearchViewerProps {
    searchQuery: string;
    sortKey: SearchUserSortKey;
}

export const UserSearchViewer = ({ searchQuery, sortKey }: UserSearchViewerProps) => {
    const [searchResultUsers, setSearchResultUsers] = useState<SearchUser[] | null>(null);
    useEffect(() => {
        async function fetchSearch() {
            if (searchQuery === "") {
                setSearchResultUsers(null);
                return;
            }
            try {
                const search = await searchUsers(searchQuery, 1, 100, sortKey);
                setSearchResultUsers(search.items);
            } catch (e) {
                setSearchResultUsers(null);
            }
        }
        fetchSearch();
        return () => {};
    }, [searchQuery, sortKey]);
    return (
        <div className={styled.userSearchViewer}>
            {searchResultUsers && (
                <div className={styled.userSearchItems}>
                    {searchResultUsers.map((item, index) => (
                        <NavLink key={index} className={styled.userSearchItem} to={`/user/${item.id}`}>
                            <img src={item.icons.small} alt="icon" className={styled.userSearchItemIcon} />
                            <div className={styled.userSearchItemInfo}>
                                <span className={styled.userSearchItemTitle}>{item.nickname}</span>
                                <span className={styled.userSearchItemDescription}>{item.shortDescription}</span>
                                <div className={styled.userSearchItemStats}>
                                    <div className={styled.userSearchItemStatsItem}>
                                        <span className={styled.userSearchItemStatsLabel}>投稿数</span>
                                        <span className={styled.userSearchItemStatsValue}>
                                            {item.videoCount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={styled.userSearchItemStatsItem}>
                                        <span className={styled.userSearchItemStatsLabel}>フォロワー数</span>
                                        <span className={styled.userSearchItemStatsValue}>
                                            {item.followerCount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};
