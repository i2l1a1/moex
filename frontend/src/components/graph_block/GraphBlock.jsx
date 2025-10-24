import "../../App.css";
import GraphBlockHeader from "./GraphBlockHeader.jsx";
import {useState, useMemo, useEffect} from "react";
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
    const [debouncedPeriodValues, setDebouncedPeriodValues] =
        useState(initialPeriodValues);
    const [selectedCurveValues, setSelectedCurveValues] =
        useState(initialCurveValues);
    const [selectedOscillatorValues, setSelectedOscillatorValues] = useState({
        weeks: 20,
    });
    const [activePanelTab, setActivePanelTab] = useState("general");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedPeriodValues(selectedPeriodValues);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [selectedPeriodValues]);

    function format_participant_type(participant_type) {
        if (participant_type === "Individuals") return "FIZ";
        if (participant_type === "Companies") return "YUR";
        return "";
    }

    const baseRequestParams = useMemo(
        () => ({
            ticker: selectedGeneralValues.ticker.split(" ")[0],
            participant_type: format_participant_type(
                selectedGeneralValues.participantTypes
            ),
            data_types: selectedGeneralValues["dataTypes"],
        }),
        [selectedGeneralValues]
    );

    const mainGraphRequestParams = useMemo(
        () => ({
            ...baseRequestParams,
            from_data: debouncedPeriodValues.from,
            till_date: debouncedPeriodValues.till,
        }),
        [baseRequestParams, debouncedPeriodValues]
    );

    const oscillatorRequestParams = useMemo(
        () => ({
            ...mainGraphRequestParams,
            number_of_weeks: parseInt(selectedOscillatorValues.weeks, 10) || 20,
        }),
        [mainGraphRequestParams, selectedOscillatorValues]
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

    const handleOscillatorChange = (values) => {
        setSelectedOscillatorValues(values);
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
                requestParameters={mainGraphRequestParams}
            ></GraphBlockHeader>
            <div
                className={`flex-1 flex flex-col pl-8 pr-8 pb-8 gap-8 ${isCollapsed ? "hidden" : ""}`}
            >
                {!isPanelCollapsed && (
                    <Panel
                        onGeneralChange={handleGeneralChange}
                        onPeriodChange={handlePeriodChange}
                        onCurvesChange={handleCurveChange}
                        onOscillatorChange={handleOscillatorChange}
                        selectedGeneralValues={selectedGeneralValues}
                        selectedPeriodValues={selectedPeriodValues}
                        selectedCurveValues={selectedCurveValues}
                        selectedOscillatorValues={selectedOscillatorValues}
                        activePanelTab={activePanelTab}
                        setActivePanelTab={setActivePanelTab}
                        participantTypes={selectedGeneralValues["participantTypes"]}
                        dataTypes={selectedGeneralValues["dataTypes"]}
                    ></Panel>
                )}
                <Graph
                    requestParameters={mainGraphRequestParams}
                    selectedCurvesToRender={selectedCurveValues.curves}
                    dataTypes={selectedGeneralValues["dataTypes"]}
                    participantTypes={selectedGeneralValues["participantTypes"]}
                    is_oscillator={false}
                    api_url={"http://127.0.0.1:9091/get_all_data"}
                ></Graph>

                {selectedCurveValues.curves.includes("oscillator") && (
                    <Graph
                        requestParameters={oscillatorRequestParams}
                        selectedCurvesToRender={selectedCurveValues.curves}
                        dataTypes={selectedGeneralValues["dataTypes"]}
                        participantTypes={selectedGeneralValues["participantTypes"]}
                        is_oscillator={true}
                        api_url={"http://127.0.0.1:9091/get_oscillator_data"}
                    ></Graph>
                )}
            </div>
        </div>
    );
}

export default GraphBlock;
