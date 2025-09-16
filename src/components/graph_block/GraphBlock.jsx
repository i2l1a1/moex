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
            className={`fixed bg-background-block rounded-[40px] ${
                isCollapsed ? "top-10 left-10 right-10" : "inset-10"} flex flex-col overflow-hidden`}
        >
            <GraphBlockHeader
                onCollapseClick={toggleCollapse}
                isCollapsed={isCollapsed}
            ></GraphBlockHeader>
            {!isCollapsed && (
                <div className="flex-1 flex flex-col px-[40px] pb-[40px]">
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
