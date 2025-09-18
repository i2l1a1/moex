import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import {generalOptions} from "./generalDefaults.js";

function ControllerListGeneral({onSelectGeneral, selectedGeneralValues}) {
    const handleDropdownSelect = (name, value) => {
        const newSelectedValues = {...selectedGeneralValues};
        newSelectedValues[name] = value;
        onSelectGeneral(newSelectedValues);
    };

    return (
        <div>
            <ElementHorizontalList gap_class={"gap-4"}>
                {Object.entries(selectedGeneralValues).map(
                    ([name, currentValue]) => (
                        <select
                            key={name}
                            value={currentValue}
                            onChange={(e) =>
                                handleDropdownSelect(name, e.target.value)
                            }
                            className="w-[280px] h-[36px] pr-4 pl-[14px] text-main-text text-button-text transition bg-drop-down rounded-[15px] overflow-y-auto max-h-[200px] appearance-none"
                            style={{
                                backgroundImage: `url('expand_dropdown.svg')`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 14px center",
                                backgroundSize: "16px",
                            }}
                        >
                            {generalOptions[name].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    )
                )}
            </ElementHorizontalList>
        </div>
    );
}

export default ControllerListGeneral;
