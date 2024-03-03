import { useParams } from "react-router-dom";

export const VideoDetailPage = () => {
    const { videoId } = useParams();
    return (
        <div>
            <h1>VideoDetailPage: {videoId}</h1>
        </div>
    );
};
