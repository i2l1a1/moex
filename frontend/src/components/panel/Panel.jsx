import "../../App.css";
import PanelTab from "./PanelTab.jsx";
import PanelTabInterior from "./PanelTabInterior.jsx";
import ControllerListGeneral from "./controller_lists/ControllerListGeneral.jsx";
import ControllerListPeriod from "./controller_lists/ControllerListPeriod.jsx";
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import ControllerListCurves from "./controller_lists/ControllerListCurves.jsx";
import ControllerListOscillator from "./controller_lists/ControllerListOscillator.jsx";

function Panel({
                   onGeneralChange,
                   onPeriodChange,
                   onCurvesChange,
                   onOscillatorChange,
                   selectedGeneralValues,
                   selectedPeriodValues,
                   selectedCurveValues,
                   selectedOscillatorValues,
                   activePanelTab,
                   setActivePanelTab,
                   participantTypes,
                   dataTypes,
               }) {
    const toggleCollapseGeneralTab = () => {
        setActivePanelTab("general");
    };

    const toggleCollapsePeriodTab = () => {
        setActivePanelTab("period");
    };

    const toggleCollapseCurvesTab = () => {
        setActivePanelTab("curves");
    };

    const toggleCollapseOscillatorTab = () => {
        setActivePanelTab("oscillator");
    };

    const handleGeneralSelect = (values) => {
        onGeneralChange(values);
    };

    const handlePeriodSelect = (values) => {
        onPeriodChange(values);
    };

    const handleCurvesSelect = (values) => {
        onCurvesChange(values);
    };

    const handleOscillatorSelect = (values) => {
        onOscillatorChange(values);
    };

    return (
        <div className="flex flex-col ml-4 mt-2">
            <ElementHorizontalList gap_class={"gap-8"}>
                <PanelTab
                    onCollapseClick={toggleCollapseGeneralTab}
                    isCollapsed={activePanelTab !== "general"}
                    panel_tab={"General"}
                ></PanelTab>
                <PanelTab
                    onCollapseClick={toggleCollapsePeriodTab}
                    isCollapsed={activePanelTab !== "period"}
                    panel_tab={"Period"}
                ></PanelTab>
                <PanelTab
                    onCollapseClick={toggleCollapseCurvesTab}
                    isCollapsed={activePanelTab !== "curves"}
                    panel_tab={"Curves"}>
                </PanelTab>
                {selectedCurveValues.curves.includes("oscillator") && (<PanelTab
                    onCollapseClick={toggleCollapseOscillatorTab}
                    isCollapsed={activePanelTab !== "oscillator"}
                    panel_tab={"Oscillator"}
                ></PanelTab>)}
            </ElementHorizontalList>

            {activePanelTab === "general" && (
                <PanelTabInterior isCollapsed={false}>
                    {
                        <ControllerListGeneral
                            onSelectGeneral={handleGeneralSelect}
                            selectedGeneralValues={selectedGeneralValues}
                        ></ControllerListGeneral>
                    }
                </PanelTabInterior>
            )}

            {activePanelTab === "period" && (
                <PanelTabInterior isCollapsed={false}>
                    {
                        <ControllerListPeriod
                            onSelectPeriod={handlePeriodSelect}
                            selectedPeriodValues={selectedPeriodValues}
                        ></ControllerListPeriod>
                    }
                </PanelTabInterior>
            )}

            {activePanelTab === "curves" && (
                <PanelTabInterior isCollapsed={false}>
                    {
                        <ControllerListCurves
                            onSelectCurves={handleCurvesSelect}
                            selectedCurveValues={selectedCurveValues}
                            participantTypes={participantTypes}
                            dataTypes={dataTypes}
                        ></ControllerListCurves>
                    }
                </PanelTabInterior>
            )}

            {activePanelTab === "oscillator" && (
                <PanelTabInterior isCollapsed={false}>
                    {
                        <ControllerListOscillator
                            onSelectOscillator={handleOscillatorSelect}
                            selectedOscillatorValues={selectedOscillatorValues}
                        ></ControllerListOscillator>
                    }
                </PanelTabInterior>
            )}
        </div>
    );
}

export default Panel;
