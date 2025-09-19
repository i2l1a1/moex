import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";

function ControllerListPeriod({onSelectPeriod, selectedPeriodValues}) {
    const handleDropdownSelect = (type, value) => {
        const newSelectedValues = {...selectedPeriodValues};
        newSelectedValues[type] = value;
        onSelectPeriod(newSelectedValues);
    };

    return (
        <div>
            <ElementHorizontalList gap_class={"gap-1"}>
                <input
                    value={selectedPeriodValues.from}
                    onChange={(e) =>
                        handleDropdownSelect("from", e.target.value)
                    }
                    className="input_from_user hide_calendar" type="date"
                />
                <span className="text-lite-gray text-button-text">–</span>
                <input
                    value={selectedPeriodValues.till}
                    onChange={(e) =>
                        handleDropdownSelect("till", e.target.value)
                    }
                    className="input_from_user hide_calendar"
                    type="date"
                />
            </ElementHorizontalList>
        </div>
    );
}

export default ControllerListPeriod;
