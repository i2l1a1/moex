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
import useFetch from "../../hooks/useFetch.jsx";
import { curveMapping } from "./curves.js";
import CustomTooltip from "./CustomTooltip.jsx";
import processData from "./processData.js";
import { calculatePriceTicks } from "./calculatePriceTicks.js";

function Graph({
    requestParameters,
    selectedCurvesToRender,
    dataTypes,
    participantTypes,
    is_oscillator,
    api_url,
}) {
    if (is_oscillator) {
        if (participantTypes === "Individuals") {
            selectedCurvesToRender = ["oscillator_FIZ"];
        } else if (participantTypes === "Companies") {
            selectedCurvesToRender = ["oscillator_YUR"];
        } else {
            selectedCurvesToRender = ["oscillator_FIZ", "oscillator_YUR"];
        }
    } else {
        selectedCurvesToRender = selectedCurvesToRender.filter(
            (c) =>
                c !== "oscillator" &&
                c !== "oscillator_FIZ" &&
                c !== "oscillator_YUR"
        );
    }

    const { data, loading, error } = useFetch(api_url, requestParameters);

    const processedData = processData(data);

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

    const { priceDomainMin, priceDomainMax, priceTicks } =
        calculatePriceTicks(processedData);

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
                    tick={{ fill: tickColor }}
                    axisLine={{ stroke: labelColor, strokeWidth: 1 }}
                    tickLine={{ stroke: tickColor, strokeWidth: 0 }}
                    minTickGap={32}
                    tickFormatter={(date) =>
                        date ? dayjs(date).format("MMM YYYY") : ""
                    }
                ></XAxis>
                <YAxis
                    axisLine={{ stroke: labelColor, strokeWidth: 1 }}
                    tickLine={{ stroke: tickColor, strokeWidth: 0 }}
                    tickSize={6}
                    fontSize={15}
                    tick={{ fill: tickColor }}
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
                    padding={{ bottom: 12 }}
                />
                <YAxis
                    axisLine={{ stroke: labelColor, strokeWidth: 1 }}
                    tickLine={{ stroke: tickColor, strokeWidth: 0 }}
                    yAxisId="pos"
                    orientation="right"
                    tickSize={6}
                    tick={{ fill: tickColor }}
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
                    padding={{ bottom: 12 }}
                />

                <Tooltip
                    isAnimationActive={false}
                    content={
                        <CustomTooltip
                            selectedCurves={selectedCurvesToRender}
                        />
                    }
                />
                <Legend />

                <Line
                    key="cost"
                    yAxisId="pos"
                    type="linear"
                    dataKey="cost"
                    stroke="#888"
                    name="Price"
                    dot={false}
                />

                {selectedCurvesToRender.map((curveName) => {
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
                                dot={false}
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
