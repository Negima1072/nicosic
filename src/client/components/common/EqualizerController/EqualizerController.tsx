import { useEffect, useRef, useState } from "react"
import fitCurve from "fit-curve";
import styled from "./EqualizerController.module.scss";

interface EqualizerInputProps {
    name: string,
    value: number,
    index: number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onInput: (event: React.MouseEvent<HTMLInputElement>) => void,
}

const EqualizerInput = ({ name, value, index, onChange, onInput }: EqualizerInputProps) => {
    return (
        <>
            <div className={styled.equalizerRangeContainer} style={{ gridArea: `1 / ${index + 3} / 4 / ${index + 4}` }}>
                <span className={styled.equalizerRangeHorizontalLine}></span>
                <span className={styled.equalizerRangeVerticalLine}></span>
                <input type="range" min="-12" max="12" step="0.1" value={value} name={name} onChange={onChange} onInput={onInput}/>
            </div>
            <div className={styled.equalizerHorizontalLabel} style={{ gridArea: `5 / ${index + 3} / 6 / ${index + 4}` }}>
                <span>{name}</span>
            </div>
        </>
    )
}

interface EqualizerControllerProps {
    defaultEqualizerValue: TEqualizerValue,
    onValueChange?: (value: TEqualizerValue) => void,
}

export const EqualizerController = ({ defaultEqualizerValue, onValueChange }: EqualizerControllerProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const pathDrawRef = useRef<SVGPathElement>(null);
    const [equalizerValue, setEqualizerValue] = useState<TEqualizerValue>(defaultEqualizerValue);
    const [svgWidth, setSvgWidth] = useState(0);
    const [svgHeight, setSvgHeight] = useState(0);
    const handleEqualizerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEqualizerValue({
            ...equalizerValue,
            [name]: Number(value),
        });
    }
    const handleEqualizerInput = () => {
        if (onValueChange) {
            onValueChange(equalizerValue);
        }
    }
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (svgRef.current) {
                setSvgWidth(svgRef.current.clientWidth);
                setSvgHeight(svgRef.current.clientHeight - 30);
            }
        });
        if (svgRef.current) {
            observer.observe(svgRef.current);
        }
        return () => {
            if (svgRef.current) {
                observer.unobserve(svgRef.current);
            }
        }
    }, []);
    useEffect(() => {
        if (pathRef.current && pathDrawRef.current && svgWidth !== 0 && svgHeight !== 0) {
            const path = pathRef.current;
            const pathDraw = pathDrawRef.current;
            const points = Object.entries(equalizerValue).map(([key, value], index) => {
                const x = (svgWidth / 12) * (index * 2 + 1);
                const y = (svgHeight / 24) * (12 - value) + 15;
                return [x, y];
            });
            const curve = fitCurve(points, 0);
            let d = `M ${curve[0][0][0]} ${curve[0][0][1]}`;
            for (let i = 0; i < curve.length; i++) {
                d += ` C ${curve[i][1][0]} ${curve[i][1][1]}, ${curve[i][2][0]} ${curve[i][2][1]}, ${curve[i][3][0] + 1} ${curve[i][3][1]}`;
            }
            path.setAttribute("d", d);
            pathDraw.setAttribute("d", d + " L " + (svgWidth / 12 * 11 + 1) + " " + (svgHeight + 30) + " L " + (svgWidth / 12) + " " + (svgHeight + 30) + " Z");
        }
    }, [equalizerValue, svgWidth, svgHeight]);
    return (
        <div className={styled.equalizerContainer}>
            <span className={styled.equalizerVerticalLabel} style={{ gridArea: "1 / 1 / 2 / 2" }}>+12dB</span>
            <span className={styled.equalizerVerticalLabel} style={{ gridArea: "3 / 1 / 4 / 2" }}>-12dB</span>
            {Object.entries(equalizerValue).map(([key, value], index) => (
                <EqualizerInput key={key} name={key} value={value} index={index} onChange={handleEqualizerChange} onInput={handleEqualizerInput}/>
            ))}
            <svg className={styled.equalizerSvg} ref={svgRef}>
                <defs>
                    <linearGradient id="equalizerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3870e0" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#252525" stopOpacity={0.6}/>
                    </linearGradient>
                    <clipPath id="equalizerClipPath">
                        <path ref={pathDrawRef}/>
                    </clipPath>
                </defs>
                <path strokeWidth="3" fill="none" stroke="#3870e0" ref={pathRef}/>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#equalizerGradient)" clipPath="url(#equalizerClipPath)"/>
            </svg>
        </div>
    )
}
