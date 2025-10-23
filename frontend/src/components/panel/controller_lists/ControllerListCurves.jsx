import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import {curveOptions} from "./curveDefaults.js";

function filterCurves(participantTypes, dataTypes) {
    if (participantTypes === "Individuals") {
        if (dataTypes === "Number of contracts") {
            return [...curveOptions.ind_curves_contracts, ...curveOptions.oscillator];
        } else {
            return [...curveOptions.ind_curves_traders, ...curveOptions.oscillator];
        }
    } else if (participantTypes === "Companies") {
        if (dataTypes === "Number of contracts") {
            return [...curveOptions.comp_curves_contracts, ...curveOptions.oscillator];
        } else {
            return [...curveOptions.comp_curves_traders, ...curveOptions.oscillator];
        }
    } else {
        if (dataTypes === "Number of contracts") {
            return [
                ...curveOptions.ind_curves_contracts,
                ...curveOptions.comp_curves_contracts,
                ...curveOptions.oscillator,
            ];
        } else {
            return [
                ...curveOptions.ind_curves_traders,
                ...curveOptions.comp_curves_traders,
                ...curveOptions.oscillator,
            ];
        }
    }
}

function ControllerListCurves({onSelectCurves, selectedCurveValues, participantTypes, dataTypes}) {
    const toggle = (curve) => {
        const newSelected = selectedCurveValues.curves.includes(curve)
            ? selectedCurveValues.curves.filter((c) => c !== curve)
            : [...selectedCurveValues.curves, curve];
        onSelectCurves({curves: newSelected});
    };

    return (
        <div className="ml-4">
            <ElementHorizontalList gap_class={"gap-y-4 gap-x-8"}>
                {filterCurves(participantTypes, dataTypes).map((c) => (
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
