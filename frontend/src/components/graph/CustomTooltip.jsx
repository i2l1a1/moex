export default function CustomTooltip({active, payload, label, selectedCurves = []}) {
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
                <strong>Price:</strong> {fmt(point.cost)}
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