import "../../App.css";
import GraphBlockHeader from "./GraphBlockHeader.jsx";
import {useState, useMemo} from "react";
import Panel from "../panel/Panel.jsx";
import {initialGeneralValues} from "../panel/controller_lists/generalDefaults.js";
import {initialPeriodValues} from "../panel/controller_lists/periodDefaults.js";
import Graph from "../graph/Graph.jsx";
import {initialCurveValues} from "../panel/controller_lists/curveDefaults.js";

function GraphBlock() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
    const [selectedGeneralValues, setSelectedGeneralValues] =
        useState(initialGeneralValues);
    const [selectedPeriodValues, setSelectedPeriodValues] =
        useState(initialPeriodValues);
    const [selectedCurveValues, setSelectedCurveValues] =
        useState(initialCurveValues);
    const [activePanelTab, setActivePanelTab] = useState("general");

    function format_participant_type(participant_type) {
        if (participant_type === "Individuals") return "FIZ";
        if (participant_type === "Companies") return "YUR";
        return "";
    }

    const requestParameters = useMemo(
        () => ({
            ticker: selectedGeneralValues.ticker.split(" ")[0],
            participant_type: format_participant_type(selectedGeneralValues.participantTypes),
            from_data: selectedPeriodValues.from,
            till_date: selectedPeriodValues.till,
        }),
        [selectedGeneralValues, selectedPeriodValues]
    );

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

    const handleCurveChange = (values) => {
        setSelectedCurveValues(values);
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
                requestParameters={requestParameters}
            ></GraphBlockHeader>
            <div
                className={`flex-1 flex flex-col pl-8 pr-8 pb-8 gap-8 ${isCollapsed ? "hidden" : ""}`}
            >
                {!isPanelCollapsed && (
                    <Panel
                        onGeneralChange={handleGeneralChange}
                        onPeriodChange={handlePeriodChange}
                        onCurvesChange={handleCurveChange}
                        selectedGeneralValues={selectedGeneralValues}
                        selectedPeriodValues={selectedPeriodValues}
                        selectedCurveValues={selectedCurveValues}
                        activePanelTab={activePanelTab}
                        setActivePanelTab={setActivePanelTab}
                        participantTypes={selectedGeneralValues["participantTypes"]}
                    ></Panel>
                )}
                <Graph
                    requestParameters={requestParameters}
                    selectedCurvesToRender={selectedCurveValues.curves}
                ></Graph>
            </div>
        </div>
    );
}

export default GraphBlock;
