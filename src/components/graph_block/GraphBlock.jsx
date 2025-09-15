import "../../App.css";
import GraphBlockHeader from "./GraphBlockHeader.jsx";
import {useState} from "react";
import Panel from "../panel/Panel.jsx";
import {initialGeneralValues} from "../panel/controller_lists/generalDefaults.js";
import {initialPeriodValues} from "../panel/controller_lists/periodDefaults.js";

function GraphBlock() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedGeneralValues, setSelectedGeneralValues] = useState(initialGeneralValues);
    const [selectedPeriodValues, setSelectedPeriodValues] = useState(initialPeriodValues);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleGeneralChange = (values) => {
        setSelectedGeneralValues(values);
    };

    const handlePeriodChange = (values) => {
        setSelectedPeriodValues(values);
    };

    return (
        <div
            className={`fixed bg-background-block rounded-[40px] ${
                isCollapsed ? "top-10 left-10 right-10" : "inset-10"}`}
        >
            <GraphBlockHeader
                onCollapseClick={toggleCollapse}
                isCollapsed={isCollapsed}
            ></GraphBlockHeader>
            {!isCollapsed && (
                <div>
                    <Panel
                        onGeneralChange={handleGeneralChange}
                        onPeriodChange={handlePeriodChange}
                    ></Panel>
                    <p className="text-[#666]">Selected General: {selectedGeneralValues.join(", ")}</p>
                    <p className="text-[#666]">Selected Period: {selectedPeriodValues.join(", ")}</p>
                </div>
            )}
        </div>
    );
}

export default GraphBlock;
