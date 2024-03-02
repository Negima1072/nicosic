import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { searchLists } from "../../../../nico/saerch";
import styled from "./ListSearchViewer.module.scss";

interface ListSearchViewerProps {
    searchQuery: string;
    listType: SearchListType;
    sortKey: SearchListSortKey;
    sortOrder: SearchSortOrder;
}

export const ListSearchViewer = ({ searchQuery, listType, sortKey, sortOrder }: ListSearchViewerProps) => {
    const [searchResultLists, setSearchResultLists] = useState<SearchList[] | null>(null);
    useEffect(() => {
        async function fetchSearch() {
            if (searchQuery === "") {
                setSearchResultLists(null);
                return;
            }
            try {
                const search = await searchLists(searchQuery, listType, 1, 100, sortKey, sortOrder);
                setSearchResultLists(search.items);
            } catch (e) {
                setSearchResultLists(null);
            }
        }
        fetchSearch();
        return () => {};
    }, [searchQuery, listType, sortKey, sortOrder]);
    return (
        <div className={styled.listSearchViewer}>
            {searchResultLists && (
                <div className={styled.listSearchItems}>
                    {searchResultLists.map((item, index) => (
                        <NavLink key={index} className={styled.listSearchItem} to={`/${item.type}/${item.id}`}>
                            <div className={styled.listSearchItemThumbnail}>
                                <img src={item.thumbnailUrl} alt="thumbnail" />
                            </div>
                            <div className={styled.listSearchItemInfo}>
                                <span className={styled.listSearchItemTitle}>{item.title}</span>
                                <div className={styled.listSearchItemOwner}>
                                    <img
                                        src={item.owner.iconUrl}
                                        alt="icon"
                                        className={styled.listSearchItemOwnerIcon}
                                    />
                                    <span className={styled.listSearchItemOwnerName}>{item.owner.name}</span>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};
