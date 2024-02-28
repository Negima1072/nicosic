import { useSetAtom } from "jotai";
import { playingDataAtom } from "../../../atoms";

export const HomePage = () => {
    const setPlayingData = useSetAtom(playingDataAtom);
    return (
        <div>
            <div onClick={() => setPlayingData({ id: "sm9" })}>sm9</div>
        </div>
    );
};
