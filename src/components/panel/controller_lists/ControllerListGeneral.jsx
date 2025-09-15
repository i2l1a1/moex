import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import Dropdown from "../../additional_components/Dropdown.jsx";
import {useState} from "react";
import {generalOptions, initialGeneralValues} from "./generalDefaults.js";

function ControllerListGeneral({onSelectGeneral}) {
    const [selectedValues, setSelectedValues] = useState(initialGeneralValues);

    const handleDropdownSelect = (index, value) => {
        const newSelectedValues = [...selectedValues];
        newSelectedValues[index] = value;
        setSelectedValues(newSelectedValues);
        onSelectGeneral(newSelectedValues);
    };

    return (
        <div>
            <ElementHorizontalList gap_class={"gap-4"}>
                {selectedValues.map((value, index) => (
                    <Dropdown
                        key={index}
                        options={generalOptions[index]}
                        onSelect={(newValue) =>
                            handleDropdownSelect(index, newValue)
                        }
                        initialValue={value}
                    />
                ))}
            </ElementHorizontalList>
        </div>
    );
}

export default ControllerListGeneral;
