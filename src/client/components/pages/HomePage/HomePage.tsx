import { useSetAtom } from "jotai";
import { playingDataAtom, playingListAtom } from "../../../atoms";

export const HomePage = () => {
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    return (
        <div>
            <div
                onClick={() => {
                    setPlayingData({ id: "sm9" });
                    setPlayingListAtom(null);
                }}
            >
                sm9
            </div>
        </div>
    );
};
