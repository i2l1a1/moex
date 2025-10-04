import React from "react";
import "../../App.css";
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

const curveMapping = {
    Liquidity: {
        dataKey: "FIZ_pos_long",
        stroke: "#2751A5",
        name: "FIZ Long",
        yAxisId: "pos",
    },
    "Risk Premium": {
        dataKey: "YUR_pos_long",
        stroke: "#CF504A",
        name: "YUR Long",
        yAxisId: "pos",
    },
    "Yield Dynamics": {
        dataKey: "YUR_pos_short_num",
        stroke: "#48CF82",
        name: "YUR Short Num",
        yAxisId: "num",
    },
    Volatility: {
        dataKey: "FIZ_pos_short",
        stroke: "#FFC658",
        name: "FIZ Short",
        yAxisId: "pos",
    },
    "Investment Horizon": {
        dataKey: "FIZ_pos_long_num",
        stroke: "#8884d8",
        name: "FIZ Long Num",
        yAxisId: "num",
    },
    "Asset Correlation": {
        dataKey: "YUR_pos_long_num",
        stroke: "#82ca9d",
        name: "YUR Long Num",
        yAxisId: "pos",
    },
};

function Graph({requestParameters, selectedCurvesToRender}) {
    const {data, loading, error} = useFetch(
        "http://127.0.0.1:9091/get_all_data",
        requestParameters
    );

    let processedData = {};
    if (data) {
        data.forEach((item) => {
            const {
                tradedate,
                clgroup,
                pos_long,
                pos_short,
                pos_long_num,
                pos_short_num,
            } = item;

            if (!processedData[tradedate]) {
                processedData[tradedate] = {tradedate: tradedate};
            }
            if (clgroup === "FIZ") {
                processedData[tradedate].FIZ_pos_long = pos_long;
                processedData[tradedate].FIZ_pos_short = pos_short;
                processedData[tradedate].FIZ_pos_long_num = pos_long_num;
                processedData[tradedate].FIZ_pos_short_num = pos_short_num;
            } else if (clgroup === "YUR") {
                processedData[tradedate].YUR_pos_long = pos_long;
                processedData[tradedate].YUR_pos_short = pos_short;
                processedData[tradedate].YUR_pos_long_num = pos_long_num;
                processedData[tradedate].YUR_pos_short_num = pos_short_num;
            }
        });

        processedData = Object.values(processedData);
    }

    if (loading) return (
        <div className="loading_and_error_message text-gray">Loading...</div>
    );
    if (error) return (
        <div className="loading_and_error_message text-error">An error occurred. Please try again later.</div>
    );

    return (
        <ResponsiveContainer className="w-full flex-1">
            <LineChart
                data={processedData}
            >
                <CartesianGrid stroke="#1B1D28" strokeDasharray="2 2"/>
                <XAxis
                    dataKey="tradedate"
                    // angle={-45}
                    // textAnchor="end"
                    // height={80}
                    // interval="preserveStartEnd"
                    // tickFormatter={(tick) => {
                    //     const date = new Date(tick);
                    //     console.log(date)
                    //     return date.toLocaleString("us-US", {
                    //         month: "short",
                    //         year: "numeric",
                    //     });
                    // }}
                />
                <YAxis
                    yAxisId="num"
                    label={{
                        value: "Количество контрактов",
                        angle: -90,
                        position: "outsideMiddle",
                    }}
                />
                <YAxis
                    yAxisId="pos"
                    orientation="right"
                    tickMargin={8}
                    label={{
                        value: "Цена",
                        angle: 90,
                        // position: "insideRight",
                    }}
                />
                <Tooltip content={<CustomTooltip/>}/>
                <Legend/>
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

const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
                <p className="text-medium text-lg">{label}</p>
                {payload.map((entry, index) => (
                    <p
                        key={`item-${index}`}
                        className="text-sm"
                        style={{color: entry.stroke}}
                    >
                        {entry.name}:<span className="ml-2">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default React.memo(Graph);
