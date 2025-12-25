import React from "react";
import "../../App.css";
import dayjs from "dayjs";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {curveMapping} from "./curves.js";
import CustomTooltip from "./CustomTooltip.jsx";
import processData from "./processData.js";
import {calculatePriceTicks} from "./calculatePriceTicks.js";

function Graph({
                   selectedCurvesToRender,
                   dataTypes,
                   participantTypes,
                   is_oscillator,
                   data: externalData,
                   loading: externalLoading,
                   error: externalError,
               }) {
    let filteredCurvesToRender;

    if (is_oscillator) {
        if (participantTypes === "Individuals") {
            filteredCurvesToRender = ["oscillator_FIZ"];
        } else if (participantTypes === "Companies") {
            filteredCurvesToRender = ["oscillator_YUR"];
        } else {
            filteredCurvesToRender = ["oscillator_FIZ", "oscillator_YUR"];
        }
    } else {
        filteredCurvesToRender = selectedCurvesToRender.filter(
            (c) =>
                !c.startsWith("oscillator")
        );

        if (participantTypes === "Individuals") {
            filteredCurvesToRender = filteredCurvesToRender.filter((c) => c.startsWith("FIZ_") || !c.includes("_"));
        } else if (participantTypes === "Companies") {
            filteredCurvesToRender = filteredCurvesToRender.filter((c) => c.startsWith("YUR_") || !c.includes("_"));
        }

        if (dataTypes === "Number of contracts") {
            filteredCurvesToRender = filteredCurvesToRender.filter((c) => (c.includes("pos") && !c.includes("num")) || c === "open_interest");
        } else if (dataTypes === "Number of traders") {
            filteredCurvesToRender = filteredCurvesToRender.filter((c) => c.includes("num"));
        }
    }

    const data = externalData;
    const loading = externalLoading;
    const error = externalError;

    const processedData = processData(Array.isArray(data) ? data : data?.data);

    if (loading)
        return (
            <div className="loading_and_error_message text-gray">
                Loading...
            </div>
        );
    if (error)
        return (
            <div className="loading_and_error_message text-error">
                An error occurred. Please try again later.
            </div>
        );

    const labelColor = "#5e666e";
    const tickColor = "#5e666e";

    const {priceDomainMin, priceDomainMax, priceTicks} =
        calculatePriceTicks(processedData);

    const createDotFunction = (dataKey) => {
        const isNull = (val) => val === null || val === undefined;

        return (props) => {
            const {payload, index, cx, cy, stroke} = props;
            const currentValue = payload[dataKey];

            if (isNull(currentValue)) return null;

            const prevValue = index > 0 ? processedData[index - 1]?.[dataKey] : null;
            const nextValue = index < processedData.length - 1 ? processedData[index + 1]?.[dataKey] : null;

            if (isNull(prevValue) && isNull(nextValue)) {
                return <circle cx={cx} cy={cy} r={1.2} fill={stroke}/>;
            }

            return null;
        };
    };

    return (
        <ResponsiveContainer className="w-full flex-1">
            <LineChart
                data={processedData}
                margin={{
                    bottom: 0,
                    left: 25,
                    right: 20,
                    top: 0,
                }}
            >
                {/*<CartesianGrid stroke="#1B1D28" strokeDasharray="2 2"/>*/}
                <XAxis
                    dataKey="tradedate"
                    tickSize={6}
                    fontSize={15}
                    tick={{fill: tickColor}}
                    axisLine={{stroke: labelColor, strokeWidth: 1}}
                    tickLine={{stroke: tickColor, strokeWidth: 0}}
                    minTickGap={32}
                    tickFormatter={(date) =>
                        date ? dayjs(date).format("MMM YYYY") : ""
                    }
                ></XAxis>
                <YAxis
                    axisLine={{stroke: labelColor, strokeWidth: 1}}
                    tickLine={{stroke: tickColor, strokeWidth: 0}}
                    tickSize={6}
                    fontSize={15}
                    tick={{fill: tickColor}}
                    yAxisId="num"
                    label={{
                        value:
                            dataTypes === "Number of contracts"
                                ? is_oscillator
                                    ? "Oscillator"
                                    : "Contracts"
                                : is_oscillator
                                    ? "Oscillator"
                                    : "Traders",
                        angle: -90,
                        position: "insideLeft",
                        offset: -20,
                        style: {
                            textAnchor: "middle",
                            fill: labelColor,
                            fontSize: 12,
                        },
                    }}
                    padding={{bottom: 12}}
                />
                <YAxis
                    axisLine={{stroke: labelColor, strokeWidth: 1}}
                    tickLine={{stroke: tickColor, strokeWidth: 0}}
                    yAxisId="pos"
                    orientation="right"
                    tickSize={6}
                    tick={{fill: tickColor}}
                    domain={[priceDomainMin, priceDomainMax]}
                    ticks={priceTicks}
                    allowDecimals={false}
                    label={{
                        value: "Price (₽)",
                        angle: 90,
                        position: "insideRight",
                        offset: -15,
                        style: {
                            textAnchor: "middle",
                            fill: labelColor,
                            fontSize: 12,
                        },
                    }}
                    padding={{bottom: 12}}
                />

                <Tooltip
                    isAnimationActive={false}
                    content={
                        <CustomTooltip
                            selectedCurves={filteredCurvesToRender}
                        />
                    }
                />
                <Legend/>

                <Line
                    key="cost"
                    yAxisId="pos"
                    type="linear"
                    dataKey="cost"
                    stroke="#888"
                    name="Price"
                    dot={createDotFunction("cost")}
                    connectNulls={false}
                />

                {filteredCurvesToRender.map((curveName) => {
                    const curveInfo = curveMapping[curveName];
                    if (curveInfo) {
                        return (
                            <Line
                                key={curveName}
                                yAxisId={curveInfo.yAxisId}
                                type="linear"
                                dataKey={curveInfo.dataKey}
                                stroke={curveInfo.stroke}
                                name={curveInfo.name}
                                dot={createDotFunction(curveInfo.dataKey)}
                                connectNulls={false}
                            />
                        );
                    }
                    return null;
                })}
            </LineChart>
        </ResponsiveContainer>
    );
}

export default React.memo(Graph);
