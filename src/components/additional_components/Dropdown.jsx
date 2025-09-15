import React, {useState} from "react";

function Dropdown({options, onSelect, initialValue}) {
    const [selectedValue, setSelectedValue] = useState(
        initialValue || options[0]
    );
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value) => {
        setSelectedValue(value);
        setIsOpen(false);
        onSelect(value);
    };

    return (
        <div className="relative w-[240px]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-[36px] flex items-center justify-between pr-4 pl-[14px] text-main-text text-button-text transition
                    ${isOpen ? "bg-drop-down rounded-t-[15px] rounded-b-none" : "bg-drop-down rounded-[15px]"}`}
            >
                {selectedValue}
                <img
                    src="expand_dropdown.svg"
                    alt={"expand_dropdown"}
                    className={`transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute z-10 w-full top-full bg-drop-down rounded-b-[15px] border-t border-drop-down-hover-item overflow-hidden">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="block w-full text-left px-[14px] py-[8px] text-button-text text-main-text hover:bg-drop-down-hover-item"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
