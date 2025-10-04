import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import {curveOptions} from "./curveDefaults.js";

function ControllerListCurves({onSelectCurves, selectedCurveValues}) {
    const toggle = (curve) => {
        const newSelected = selectedCurveValues.curves.includes(curve)
            ? selectedCurveValues.curves.filter((c) => c !== curve)
            : [...selectedCurveValues.curves, curve];
        onSelectCurves({curves: newSelected});
    };

    return (
        <div className="ml-4">
            <ElementHorizontalList gap_class={"gap-y-4 gap-x-8"}>
                {curveOptions.curves.map((c) => (
                    <label key={c} className="text-button-text text-main-text whitespace-nowrap">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedCurveValues.curves.includes(c)}
                            onChange={() => toggle(c)}
                        />
                        {c}
                    </label>
                ))}
            </ElementHorizontalList>
        </div>
    );
}

export default ControllerListCurves;
