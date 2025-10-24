import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";
import { useState } from "react";

function ControllerListOscillator({
    onSelectOscillator,
    selectedOscillatorValues,
}) {
    const [weeks, setWeeks] = useState(selectedOscillatorValues?.weeks || "20");

    const handleWeeksChange = (e) => {
        const value = e.target.value;
        setWeeks(value);
        onSelectOscillator({ weeks: value });
    };

    return (
        <div>
            <ElementHorizontalList gap_class={"gap-4"}>
                <input
                    type="text"
                    value={weeks}
                    onChange={handleWeeksChange}
                    placeholder="Weeks"
                    className="w-[280px] h-[36px] pr-4 pl-[14px] text-main-text text-button-text transition bg-drop-down rounded-[15px] border-none outline-none"
                />
            </ElementHorizontalList>
        </div>
    );
}

export default ControllerListOscillator;
