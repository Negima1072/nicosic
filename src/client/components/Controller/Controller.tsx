import { MdPlayCircleFilled, MdRepeat, MdShuffle, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { RiHeartFill, RiHeartLine, RiInformationLine, RiMovieFill, RiShareBoxLine } from "react-icons/ri";
import styled from "./Controller.module.scss";

export const Controller = () => {
    return (
        <div className={styled.controller}>
            <div className={styled.songMeta}>
                <img src="https://nicovideo.cdn.nimg.jp/thumbnails/9/9" alt="thumbnail" />
                <div className={styled.songInfo}>
                    <h3>レッツゴー!陰陽師</h3>
                    <p>ボカロP</p>
                </div>
            </div>
            <div className={styled.songControls}>
                <div className={styled.songCtrlButtons}>
                    <button>
                        <MdShuffle />
                    </button>
                    <button>
                        <MdSkipPrevious />
                    </button>
                    <button className={styled.playButton}>
                        <MdPlayCircleFilled />
                    </button>
                    <button>
                        <MdSkipNext />
                    </button>
                    <button>
                        <MdRepeat />
                    </button>
                </div>
                <div className={styled.songCtrlRange}>
                    <span>0:00</span>
                    <input type="range" min="0" max="100" />
                    <span>0:00</span>
                </div>
            </div>
            <div className={styled.songExtButtons}>
                <button disabled>{false ? <RiHeartFill /> : <RiHeartLine />}</button>
                <button disabled>
                    <RiInformationLine />
                </button>
                <button disabled>
                    <RiMovieFill />
                </button>
                <button disabled>
                    <RiShareBoxLine />
                </button>
            </div>
        </div>
    );
};
