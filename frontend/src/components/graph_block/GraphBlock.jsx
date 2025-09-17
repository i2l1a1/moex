import "../../App.css";
import GraphBlockHeader from "./GraphBlockHeader.jsx";
import {useState} from "react";
import Panel from "../panel/Panel.jsx";
import {initialGeneralValues} from "../panel/controller_lists/generalDefaults.js";
import {initialPeriodValues} from "../panel/controller_lists/periodDefaults.js";
import Graph from "../graph/Graph.jsx";

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
            className={`fixed bg-background-block rounded-[40px] pt-5 ${
                isCollapsed ? "top-8 left-8 right-8" : "inset-8"} flex flex-col overflow-hidden gap-[6px]`}
        >
            <GraphBlockHeader
                onCollapseClick={toggleCollapse}
                isCollapsed={isCollapsed}
            ></GraphBlockHeader>
            {!isCollapsed && (
                <div className="flex-1 flex flex-col pl-8 pr-8 pb-8 gap-[22px]">
                    <Panel
                        onGeneralChange={handleGeneralChange}
                        onPeriodChange={handlePeriodChange}
                    ></Panel>
                    <Graph></Graph>
                </div>
            )}
        </div>
    );
}

export default GraphBlock;
