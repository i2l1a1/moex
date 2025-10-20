export default function processData(data) {
    let processedData = {};
    if (data) {
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
                oscillator
            } = item;

            if (!processedData[tradedate]) {
                processedData[tradedate] = {tradedate: tradedate};
            }

            if (clgroup === "FIZ") {
                processedData[tradedate].cost = cost;
                processedData[tradedate].FIZ_pos = pos;
                processedData[tradedate].FIZ_pos_long = pos_long;
                processedData[tradedate].FIZ_pos_short = pos_short;
                processedData[tradedate].FIZ_pos_num = pos_num;
                processedData[tradedate].FIZ_pos_long_num = pos_long_num;
                processedData[tradedate].FIZ_pos_short_num = pos_short_num;
                processedData[tradedate].oscillator = oscillator;
            } else if (clgroup === "YUR") {
                processedData[tradedate].cost = cost;
                processedData[tradedate].YUR_pos = pos;
                processedData[tradedate].YUR_pos_long = pos_long;
                processedData[tradedate].YUR_pos_short = pos_short;
                processedData[tradedate].YUR_pos_num = pos_num;
                processedData[tradedate].YUR_pos_long_num = pos_long_num;
                processedData[tradedate].YUR_pos_short_num = pos_short_num;
                processedData[tradedate].oscillator = oscillator;
            }
        });
    }

    return Object.values(processedData);
}