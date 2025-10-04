import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import { curveOptions } from "./curveDefaults.js";

function ControllerListCurves({ onSelectCurves, selectedCurveValues }) {
    const toggle = (curve) => {
        const newSelected = selectedCurveValues.curves.includes(curve)
            ? selectedCurveValues.curves.filter((c) => c !== curve)
            : [...selectedCurveValues.curves, curve];
        onSelectCurves({ curves: newSelected });
    };

    return (
        <ElementHorizontalList gap_class={"gap-8"}>
            {curveOptions.curves.map((c) => (
                <label key={c}>
                    <input
                        type="checkbox"
                        checked={selectedCurveValues.curves.includes(c)}
                        onChange={() => toggle(c)}
                    />
                    {c}
                </label>
            ))}
        </ElementHorizontalList>
    );
}

export default ControllerListCurves;
