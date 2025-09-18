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

function Graph({requestParameters}) {
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

    console.log(loading);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ResponsiveContainer className="w-full flex-1">
            <LineChart
                data={processedData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis
                    dataKey="tradedate"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval="preserveStartEnd"
                    tickFormatter={(tick) => {
                        const date = new Date(tick);
                        return date.toLocaleString("ru-RU", {
                            month: "short",
                            year: "numeric",
                        });
                    }}
                />
                <YAxis
                    yAxisId="num"
                    label={{
                        value: "Количество контрактов",
                        angle: -90,
                        position: "insideLeft",
                    }}
                />
                <YAxis
                    yAxisId="pos"
                    orientation="right"
                    label={{
                        value: "Цена",
                        angle: 90,
                        position: "insideRight",
                    }}
                />
                <Tooltip/>
                <Legend/>
                <Line
                    yAxisId="pos"
                    type="monotone"
                    dataKey="FIZ_pos_long"
                    stroke="#2751A5"
                    name="FIZ Long"
                    dot={false}
                />
                <Line
                    yAxisId="pos"
                    type="monotone"
                    dataKey="YUR_pos_long"
                    stroke="#CF504A"
                    name="YUR Long"
                    dot={false}
                />
                <Line
                    yAxisId="num"
                    type="monotone"
                    dataKey="YUR_pos_short_num"
                    stroke="#48CF82"
                    name="YUR Short Num"
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Graph;
