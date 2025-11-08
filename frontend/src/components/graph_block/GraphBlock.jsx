import "../../App.css";
import GraphBlockHeader from "./GraphBlockHeader.jsx";
import React, {useMemo, useEffect} from "react";
import Panel from "../panel/Panel.jsx";
import Graph from "../graph/Graph.jsx";
import {downloadTable} from "../../utils/downloadTable.js";

function GraphBlock({
                        id,
                        selectedGeneralValues, setSelectedGeneralValues,
                        selectedPeriodValues, setSelectedPeriodValues,
                        debouncedPeriodValues, setDebouncedPeriodValues,
                        selectedCurveValues, setSelectedCurveValues,
                        selectedOscillatorValues, setSelectedOscillatorValues,
                        activePanelTab, setActivePanelTab,
                        isCollapsed, setIsCollapsed,
                        isPanelCollapsed, setIsPanelCollapsed,
                        onDuplicateGraphClick,
                        onDeleteGraphClick
                    }) {
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedPeriodValues(selectedPeriodValues);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [selectedPeriodValues, setDebouncedPeriodValues]);

    function format_participant_type(participant_type) {
        if (participant_type === "Individuals") return "FIZ";
        if (participant_type === "Companies") return "YUR";
        return "";
    }

    const baseRequestParams = useMemo(
        () => ({
            ticker: selectedGeneralValues.ticker.split(" ")[0],
            participant_type: format_participant_type(selectedGeneralValues.participantTypes),
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

    const handleCollapseClick = () => setIsCollapsed(!isCollapsed);
    const handleTogglePanelClick = () => setIsPanelCollapsed(!isPanelCollapsed);
    const handleDownloadTableClick = () => {
        const tableName = `data_${id}_${oscillatorRequestParams.ticker}_from_${oscillatorRequestParams.from_data}_till_${oscillatorRequestParams.till_date}.xlsx`;
        downloadTable("http://127.0.0.1:9091/get_table", oscillatorRequestParams, tableName);
    };

    return (
        <div
            className={`bg-background-block rounded-[40px] w-full pt-5 ${isCollapsed ? "h-[88px]" : "h-[calc(100vh-64px)]"} flex-shrink-0 flex flex-col overflow-hidden`}>
            <GraphBlockHeader
                onCollapseClick={handleCollapseClick}
                onTogglePanelClick={handleTogglePanelClick}
                onDownloadTableClick={handleDownloadTableClick}
                onDuplicateGraphClick={() => onDuplicateGraphClick(id)}
                onDeleteGraphClick={() => onDeleteGraphClick(id)}
                isCollapsed={isCollapsed}
                isPanelCollapsed={isPanelCollapsed}
                requestParameters={oscillatorRequestParams}
                is_oscillator={selectedCurveValues.curves.includes("oscillator")}
            />
            <div className={`flex-1 flex flex-col pl-8 pr-8 pb-8 gap-8${isCollapsed ? " hidden" : ""}`}>
                {!isPanelCollapsed && (
                    <Panel
                        onGeneralChange={setSelectedGeneralValues}
                        onPeriodChange={setSelectedPeriodValues}
                        onCurvesChange={setSelectedCurveValues}
                        onOscillatorChange={setSelectedOscillatorValues}
                        selectedGeneralValues={selectedGeneralValues}
                        selectedPeriodValues={selectedPeriodValues}
                        selectedCurveValues={selectedCurveValues}
                        selectedOscillatorValues={selectedOscillatorValues}
                        activePanelTab={activePanelTab}
                        setActivePanelTab={setActivePanelTab}
                        participantTypes={selectedGeneralValues["participantTypes"]}
                        dataTypes={selectedGeneralValues["dataTypes"]}
                    />
                )}
                <Graph
                    requestParameters={mainGraphRequestParams}
                    selectedCurvesToRender={selectedCurveValues.curves}
                    dataTypes={selectedGeneralValues["dataTypes"]}
                    participantTypes={selectedGeneralValues["participantTypes"]}
                    is_oscillator={false}
                    api_url={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:9091"}/get_futoi_data`}
                />
                {selectedCurveValues.curves.includes("oscillator") && (
                    <Graph
                        requestParameters={oscillatorRequestParams}
                        selectedCurvesToRender={selectedCurveValues.curves}
                        dataTypes={selectedGeneralValues["dataTypes"]}
                        participantTypes={selectedGeneralValues["participantTypes"]}
                        is_oscillator={true}
                        api_url={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:9091"}/get_oscillator_data`}
                    />
                )}
            </div>
        </div>
    );
}

export default React.memo(GraphBlock);
