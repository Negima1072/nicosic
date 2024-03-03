import { useParams } from "react-router-dom";

export const UserVideosPage = () => {
    const { userId } = useParams();
    return (
        <div>
            <h1>UserVideosPage: { userId }</h1>
        </div>
    );
}
