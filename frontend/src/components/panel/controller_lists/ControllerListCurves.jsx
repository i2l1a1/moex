import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import {curveOptions} from "./curveDefaults.js";

function ControllerListCurves({onSelectCurves, selectedCurveValues, participantTypes}) {
    const toggle = (curve) => {
        const newSelected = selectedCurveValues.curves.includes(curve)
            ? selectedCurveValues.curves.filter((c) => c !== curve)
            : [...selectedCurveValues.curves, curve];
        onSelectCurves({curves: newSelected});
    };

    const curvesForCurrentParticipantType =
        participantTypes === "Individuals"
            ? curveOptions.ind_curves
            : participantTypes === "Companies"
                ? curveOptions.comp_curves
                : curveOptions.curves;

    return (
        <div className="ml-4">
            <ElementHorizontalList gap_class={"gap-y-4 gap-x-8"}>
                {curvesForCurrentParticipantType.map((c) => (
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
