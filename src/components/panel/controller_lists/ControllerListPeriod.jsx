import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import Dropdown from "../../additional_components/Dropdown.jsx";
import {useState} from "react";
import {periodOptions, initialPeriodValues} from "./periodDefaults.js";

function ControllerListPeriod({onSelectPeriod}) {
    const [selectedValues, setSelectedValues] = useState(initialPeriodValues);

    const handleDropdownSelect = (index, value) => {
        const newSelectedValues = [...selectedValues];
        newSelectedValues[index] = value;
        setSelectedValues(newSelectedValues);
        onSelectPeriod(newSelectedValues);
    };

    return (
        <div>
            <ElementHorizontalList gap_class={"gap-4"}>
                {selectedValues.map((value, index) => (
                    <Dropdown
                        key={index}
                        options={periodOptions[index]}
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

export default ControllerListPeriod;
