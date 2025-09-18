import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import {generalOptions} from "./generalDefaults.js";

function ControllerListGeneral({onSelectGeneral, selectedGeneralValues}) {
    const handleDropdownSelect = (index, value) => {
        const newSelectedValues = [...selectedGeneralValues];
        newSelectedValues[index] = value;
        onSelectGeneral(newSelectedValues);
    };

    return (
        <div>
            <ElementHorizontalList gap_class={"gap-4"}>
                {selectedGeneralValues.map((value, index) => (
                    <select
                        key={index}
                        value={value}
                        onChange={(e) =>
                            handleDropdownSelect(index, e.target.value)
                        }
                        className="w-[280px] h-[36px] pr-4 pl-[14px] text-main-text text-button-text transition bg-drop-down rounded-[15px] overflow-y-auto max-h-[200px] appearance-none"
                        style={{
                            backgroundImage: `url('expand_dropdown.svg')`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 14px center",
                            backgroundSize: "16px",
                        }}
                    >
                        {generalOptions[index].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ))}
            </ElementHorizontalList>
        </div>
    );
}

export default ControllerListGeneral;
