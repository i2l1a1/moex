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
                oscillator_FIZ,
                oscillator_YUR,
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
                if (oscillator_FIZ !== null && oscillator_FIZ !== undefined) {
                    processedData[tradedate].oscillator_FIZ = oscillator_FIZ;
                }
            } else if (clgroup === "YUR") {
                processedData[tradedate].cost = cost;
                processedData[tradedate].YUR_pos = pos;
                processedData[tradedate].YUR_pos_long = pos_long;
                processedData[tradedate].YUR_pos_short = pos_short;
                processedData[tradedate].YUR_pos_num = pos_num;
                processedData[tradedate].YUR_pos_long_num = pos_long_num;
                processedData[tradedate].YUR_pos_short_num = pos_short_num;
                if (oscillator_YUR !== null && oscillator_YUR !== undefined) {
                    processedData[tradedate].oscillator_YUR = oscillator_YUR;
                }
            }
        });
    }

    return Object.values(processedData);
}