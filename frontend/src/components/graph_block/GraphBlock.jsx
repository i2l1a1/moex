import "../../App.css";
import GraphBlockHeader from "./GraphBlockHeader.jsx";
import {useState} from "react";
import Panel from "../panel/Panel.jsx";
import {initialGeneralValues} from "../panel/controller_lists/generalDefaults.js";
import {initialPeriodValues} from "../panel/controller_lists/periodDefaults.js";
import Graph from "../graph/Graph.jsx";

function GraphBlock() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
    const [selectedGeneralValues, setSelectedGeneralValues] =
        useState(initialGeneralValues);
    const [selectedPeriodValues, setSelectedPeriodValues] =
        useState(initialPeriodValues);
    const [isLastPanelGroupCollapsed, setIsLastPanelGroupCollapsed] =
        useState(true);

    const requestParameters = {
        ticker: selectedGeneralValues[0].split(" ")[0],
        from_data: "2023-05-01",
        till_date: "2024-02-01",
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const togglePanel = () => {
        setIsPanelCollapsed(!isPanelCollapsed);
    };

    const handleGeneralChange = (values) => {
        setSelectedGeneralValues(values);
    };

    const handlePeriodChange = (values) => {
        setSelectedPeriodValues(values);
    };

    const handleLastPanelGroupCollapseChange = (value) => {
        setIsLastPanelGroupCollapsed(value);
    };

    return (
        <div
            className={`fixed bg-background-block rounded-[40px] pt-5 ${
                isCollapsed ? "top-8 left-8 right-8" : "inset-8"
            } flex flex-col overflow-hidden
                ${isPanelCollapsed ? "gap-5" : "gap-[6px]"}`}
        >
            <GraphBlockHeader
                onCollapseClick={toggleCollapse}
                onTogglePanelClick={togglePanel}
                isCollapsed={isCollapsed}
            ></GraphBlockHeader>
            {!isCollapsed && (
                <div
                    className={`flex-1 flex flex-col pl-8 pr-8 pb-8 ${
                        isLastPanelGroupCollapsed ? "gap-[18px]" : "gap-8"
                    }`}
                >
                    {!isPanelCollapsed && (
                        <Panel
                            onGeneralChange={handleGeneralChange}
                            onPeriodChange={handlePeriodChange}
                            onLastPanelGroupChange={
                                handleLastPanelGroupCollapseChange
                            }
                            selectedGeneralValues={selectedGeneralValues}
                            selectedPeriodValues={selectedPeriodValues}
                        ></Panel>
                    )}
                    <Graph requestParameters={requestParameters}></Graph>
                </div>
            )}
        </div>
    );
}

export default GraphBlock;
