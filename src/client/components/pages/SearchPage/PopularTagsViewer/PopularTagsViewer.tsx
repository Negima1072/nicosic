import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getNicoboxPopularTags } from "../../../../nico/recommend";
import { searchVideos } from "../../../../nico/saerch";
import styled from "./PopularTagsViewer.module.scss";

interface PopularTag {
    content: string;
    image: string;
}

export const PopularTagsViewer = () => {
    const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
    useEffect(() => {
        async function fetchPopularTags() {
            const tags = await getNicoboxPopularTags();
            const popularTags = [] as PopularTag[];
            for (const tag of tags.items) {
                const search = await searchVideos(tag.content, "tag", "hot", "none", 1, 1);
                if (search.items.length > 0) {
                    popularTags.push({
                        content: tag.content,
                        image: search.items[0].thumbnail.listingUrl,
                    });
                }
            }
            setPopularTags(popularTags);
        }
        fetchPopularTags();
        return () => {};
    }, []);
    return (
        <div className={styled.popularTagsViewer}>
            <h3>人気のタグ</h3>
            <p>よく検索されているタグをチェックしよう</p>
            <div className={styled.popularTags}>
                {popularTags.map((tag, index) => (
                    <NavLink key={index} className={styled.popularTag} to={`/search?q=${tag.content}&queryType=tag`}>
                        <img src={tag.image} alt={tag.content} />
                        <span>{tag.content}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};
