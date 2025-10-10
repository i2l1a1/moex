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
    FIZ_pos: {
        dataKey: "FIZ_pos",
        stroke: "#2751A5",
        name: "FIZ_pos",
        yAxisId: "num",
    },
    YUR_pos: {
        dataKey: "YUR_pos",
        stroke: "#CF504A",
        name: "YUR_pos",
        yAxisId: "num",
    },
    FIZ_pos_long: {
        dataKey: "FIZ_pos_long",
        stroke: "#a5276e",
        name: "FIZ_pos_long",
        yAxisId: "num",
    },
    YUR_pos_long: {
        dataKey: "YUR_pos_long",
        stroke: "#6827a5",
        name: "YUR_pos_long",
        yAxisId: "num",
    },
    FIZ_pos_short: {
        dataKey: "FIZ_pos_short",
        stroke: "#FFC658",
        name: "FIZ_pos_short",
        yAxisId: "num",
    },
    YUR_pos_short: {
        dataKey: "YUR_pos_short",
        stroke: "#3e1319",
        name: "YUR_pos_short",
        yAxisId: "num",
    },
    FIZ_pos_num: {
        dataKey: "FIZ_pos_num",
        stroke: "#69a260",
        name: "FIZ_pos_num",
        yAxisId: "num",
    },
    YUR_pos_num: {
        dataKey: "YUR_pos_num",
        stroke: "#288b8f",
        name: "YUR_pos_num",
        yAxisId: "num",
    },
    FIZ_pos_long_num: {
        dataKey: "FIZ_pos_long_num",
        stroke: "#8884d8",
        name: "FIZ_pos_long_num",
        yAxisId: "num",
    },
    YUR_pos_long_num: {
        dataKey: "YUR_pos_long_num",
        stroke: "#82ca9d",
        name: "YUR_pos_long_num",
        yAxisId: "num",
    },
    FIZ_pos_short_num: {
        dataKey: "FIZ_pos_short_num",
        stroke: "#6a7396",
        name: "FIZ_pos_short_num",
        yAxisId: "num",
    },
    YUR_pos_short_num: {
        dataKey: "YUR_pos_short_num",
        stroke: "#48CF82",
        name: "YUR_pos_short_num",
        yAxisId: "num",
    },
};

// Кастомный тултип: показывает цену и выбранные метрики.
// Также добавляет *_num поля (например FIZ_pos_long_num), даже если они не рисуются линиями.
function CustomTooltip({active, payload, label, selectedCurves = []}) {
    if (!active || !payload || payload.length === 0) return null;

    // payload[0].payload содержит весь объект данных для точки (включая cost и *_num поля)
    const point = payload[0].payload || {};

    // Удобная функция форматирования чисел
    const fmt = (v) => (v === null || v === undefined ? "-" : v);

    return (
        <div className="custom-tooltip" style={{background: "#0b0c10", padding: 10, borderRadius: 6, color: "#fff"}}>
            <div style={{fontSize: 12, marginBottom: 6}}>{label}</div>

            {/* Цена (правой оси) */}
            <div style={{fontSize: 13}}>
                <strong>Цена:</strong> {fmt(point.cost)}
            </div>

            <div style={{height: 6}}/>

            {/* Для каждого выбранного кривого показываем его значение (если есть) */}
            {selectedCurves.map((curveName) => {
                // Значение основной метрики
                const val = point[curveName];
                // Возможные дополнительные *_num поля (long/short)
                let numField = null;
                if (curveName.endsWith("_long")) {
                    numField = `${curveName}_num`; // e.g. FIZ_pos_long -> FIZ_pos_long_num
                } else if (curveName.endsWith("_short")) {
                    numField = `${curveName}_num`;
                } else if (curveName.endsWith("_pos_long")) {
                    numField = `${curveName}_num`;
                }

                return (
                    <div key={curveName} style={{fontSize: 13, marginTop: 6}}>
                        <div><strong>{curveName}:</strong> {fmt(val)}</div>
                        {numField && point[numField] !== undefined && (
                            <div style={{fontSize: 12, opacity: 0.85}}>({numField}: {fmt(point[numField])})</div>
                        )}
                    </div>
                );
            })}

            {/* Кроме выбранных — если есть дополнительные *_num поля в данных, можно показать их тоже (необязательно) */}
            {/* Пример: FIZ_pos_long_num или FIZ_pos_short_num */}
            {["FIZ_pos_long_num", "FIZ_pos_short_num", "YUR_pos_long_num", "YUR_pos_short_num"].map((k) => {
                if (selectedCurves.includes(k)) return null; // уже показано выше
                if (point[k] === undefined) return null;
                return (
                    <div key={k} style={{fontSize: 12, marginTop: 6}}>
                        <strong>{k}:</strong> {fmt(point[k])}
                    </div>
                );
            })}
        </div>
    );
}

function Graph({requestParameters, selectedCurvesToRender, dataTypes}) {
    const {data, loading, error} = useFetch(
        "http://127.0.0.1:9091/get_all_data",
        requestParameters
    );

    const y_left_label = dataTypes === "Number of contracts" ? "Количество контрактов" : "Количество лиц"

    let processedData = {};
    if (data) {
        console.log(data);

        data.forEach((item) => {
            const {
                tradedate,
                clgroup,
                cost,
                pos,
                pos_long,
                pos_short,
                pos_num,
                pos_long_num,
                pos_short_num,
            } = item;

            // стандартный ключ — tradedate (строка "YYYY-MM-DD")
            if (!processedData[tradedate]) {
                processedData[tradedate] = {tradedate: tradedate};
            }

            // наполняем поля, придерживаясь твоей логики
            if (clgroup === "FIZ") {
                processedData[tradedate].cost = cost;
                processedData[tradedate].FIZ_pos = pos;
                processedData[tradedate].FIZ_pos_long = pos_long;
                processedData[tradedate].FIZ_pos_short = pos_short;
                processedData[tradedate].FIZ_pos_num = pos_num;
                processedData[tradedate].FIZ_pos_long_num = pos_long_num;
                processedData[tradedate].FIZ_pos_short_num = pos_short_num;
            } else if (clgroup === "YUR") {
                processedData[tradedate].cost = cost;
                processedData[tradedate].YUR_pos = pos;
                processedData[tradedate].YUR_pos_long = pos_long;
                processedData[tradedate].YUR_pos_short = pos_short;
                processedData[tradedate].YUR_pos_num = pos_num;
                processedData[tradedate].YUR_pos_long_num = pos_long_num;
                processedData[tradedate].YUR_pos_short_num = pos_short_num;
            }
        });

        processedData = Object.values(processedData);

        // Дополнительно: привести cost к числу (если нужно) и остальные поля к числам
        processedData = processedData.map((row) => {
            const r = {...row};
            if (r.cost !== undefined) r.cost = Number(r.cost);
            ["FIZ_pos", "FIZ_pos_long", "FIZ_pos_short", "FIZ_pos_long_num", "FIZ_pos_short_num",
                "YUR_pos", "YUR_pos_long_num", "YUR_pos_short", "YUR_pos_short_num"].forEach((k) => {
                if (r[k] !== undefined) r[k] = Number(r[k]);
            });
            return r;
        });
    }

    console.log(processedData);

    if (loading) return (
        <div className="loading_and_error_message text-gray">Loading...</div>
    );
    if (error) return (
        <div className="loading_and_error_message text-error">An error occurred. Please try again later.</div>
    );

    // Решение: всегда отрисовываем линию price (cost) на правой оси,
    // и отдельно рисуем линии для выбранных кривых (selectedCurvesToRender).
    // Для тултипа передаём selectedCurvesToRender, чтобы показывать сопутствующие *_num поля.
    return (
        <ResponsiveContainer className="w-full flex-1">
            <LineChart
                data={processedData}
            >
                <CartesianGrid stroke="#1B1D28" strokeDasharray="2 2"/>
                <XAxis
                    dataKey="tradedate"
                />
                <YAxis
                    yAxisId="num"
                    label={{
                        value: y_left_label,
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
                    }}
                />

                {/* Кастомный тултип: передаём выбранные кривые, чтобы он знал, что показывать */}
                <Tooltip content={<CustomTooltip selectedCurves={selectedCurvesToRender}/>}/>
                <Legend/>

                {/* Линия цены (правый Y) — показываем всегда, чтобы была на графике */}
                <Line
                    key="cost"
                    yAxisId="pos"
                    type="linear"
                    dataKey="cost"
                    stroke="#888"
                    name="Цена"
                    dot={false}
                />

                {/* Рисуем выбранные кривые */}
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
