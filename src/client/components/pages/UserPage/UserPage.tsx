import { useParams } from "react-router-dom";

export const UserPage = () => {
    const { userId } = useParams();
    return <div>User Page: {userId}</div>;
};
