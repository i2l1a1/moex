import React, {useState, useRef, useCallback} from "react";
import GraphBlock from "../graph_block/GraphBlock.jsx";
import {initialGeneralValues} from "../panel/controller_lists/generalDefaults.js";
import {initialPeriodValues} from "../panel/controller_lists/periodDefaults.js";
import {initialCurveValues} from "../panel/controller_lists/curveDefaults.js";
import {initialOscillatorValues} from "../panel/controller_lists/oscillatorDefaults.js";

function GraphBlockHolder() {
    const [graphBlocks, setGraphBlocks] = useState({
        1: {
            id: 1,
            selectedGeneralValues: initialGeneralValues,
            selectedPeriodValues: initialPeriodValues,
            debouncedPeriodValues: initialPeriodValues,
            selectedCurveValues: initialCurveValues,
            selectedOscillatorValues: initialOscillatorValues,
            activePanelTab: "general",
            isCollapsed: false,
            isPanelCollapsed: false
        }
    });
    const currentIdRef = useRef(1);

    const duplicateGraphBlock = useCallback((idToDuplicate) => {
        setGraphBlocks((prevBlocks) => {
            const blockToDuplicate = prevBlocks[idToDuplicate];
            if (!blockToDuplicate) return prevBlocks;

            currentIdRef.current += 1;
            const newId = currentIdRef.current;
            const copy = JSON.parse(JSON.stringify(blockToDuplicate));
            copy.id = newId;

            return {
                ...prevBlocks,
                [newId]: copy,
            };
        });
    }, []);

    const deleteGraphBlock = useCallback((idToDelete) => {
        setGraphBlocks((prevBlocks) => {
            const {[idToDelete]: _, ...restOfBlocks} = prevBlocks;
            return restOfBlocks;
        });
    }, []);

    const setterMapRef = useRef({});
    Object.values(graphBlocks).forEach((block) => {
        if (!setterMapRef.current[block.id]) {
            setterMapRef.current[block.id] = {
                setSelectedGeneralValues: values => setGraphBlocks(prev => ({
                    ...prev,
                    [block.id]: {...prev[block.id], selectedGeneralValues: values}
                })),
                setSelectedPeriodValues: values => setGraphBlocks(prev => ({
                    ...prev,
                    [block.id]: {...prev[block.id], selectedPeriodValues: values}
                })),
                setDebouncedPeriodValues: values => setGraphBlocks(prev => ({
                    ...prev,
                    [block.id]: {...prev[block.id], debouncedPeriodValues: values}
                })),
                setSelectedCurveValues: values => setGraphBlocks(prev => ({
                    ...prev,
                    [block.id]: {...prev[block.id], selectedCurveValues: values}
                })),
                setSelectedOscillatorValues: values => setGraphBlocks(prev => ({
                    ...prev,
                    [block.id]: {...prev[block.id], selectedOscillatorValues: values}
                })),
                setActivePanelTab: tab => setGraphBlocks(prev => ({
                    ...prev,
                    [block.id]: {...prev[block.id], activePanelTab: tab}
                })),
                setIsCollapsed: val => setGraphBlocks(prev => ({
                    ...prev,
                    [block.id]: {...prev[block.id], isCollapsed: val}
                })),
                setIsPanelCollapsed: val => setGraphBlocks(prev => ({
                    ...prev,
                    [block.id]: {...prev[block.id], isPanelCollapsed: val}
                })),
            }
        }
    });

    return (
        <div className="p-8 flex flex-col gap-8 w-full h-full overflow-y-auto">
            {Object.values(graphBlocks).map((block) => (
                <GraphBlock
                    key={block.id}
                    id={block.id}
                    selectedGeneralValues={block.selectedGeneralValues}
                    setSelectedGeneralValues={setterMapRef.current[block.id].setSelectedGeneralValues}
                    selectedPeriodValues={block.selectedPeriodValues}
                    setSelectedPeriodValues={setterMapRef.current[block.id].setSelectedPeriodValues}
                    debouncedPeriodValues={block.debouncedPeriodValues}
                    setDebouncedPeriodValues={setterMapRef.current[block.id].setDebouncedPeriodValues}
                    selectedCurveValues={block.selectedCurveValues}
                    setSelectedCurveValues={setterMapRef.current[block.id].setSelectedCurveValues}
                    selectedOscillatorValues={block.selectedOscillatorValues}
                    setSelectedOscillatorValues={setterMapRef.current[block.id].setSelectedOscillatorValues}
                    activePanelTab={block.activePanelTab}
                    setActivePanelTab={setterMapRef.current[block.id].setActivePanelTab}
                    isCollapsed={block.isCollapsed}
                    setIsCollapsed={setterMapRef.current[block.id].setIsCollapsed}
                    isPanelCollapsed={block.isPanelCollapsed}
                    setIsPanelCollapsed={setterMapRef.current[block.id].setIsPanelCollapsed}
                    onDuplicateGraphClick={duplicateGraphBlock}
                    onDeleteGraphClick={deleteGraphBlock}
                />
            ))}
        </div>
    );
}

export default GraphBlockHolder;
