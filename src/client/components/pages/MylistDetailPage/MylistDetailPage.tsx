import { useParams } from "react-router-dom";

export const MylistDetailPage = () => {
    const { mylistId } = useParams();
    return <div>Mylist Detail Page: {mylistId}</div>;
};
