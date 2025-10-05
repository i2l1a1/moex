import "../../App.css";
import PanelTab from "./PanelTab.jsx";
import PanelTabInterior from "./PanelTabInterior.jsx";
import ControllerListGeneral from "./controller_lists/ControllerListGeneral.jsx";
import ControllerListPeriod from "./controller_lists/ControllerListPeriod.jsx";
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import ControllerListCurves from "./controller_lists/ControllerListCurves.jsx";

function Panel({
                   onGeneralChange,
                   onPeriodChange,
                   onCurvesChange,
                   selectedGeneralValues,
                   selectedPeriodValues,
                   selectedCurveValues,
                   activePanelTab,
                   setActivePanelTab,
                   participantTypes
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

    const handleGeneralSelect = (values) => {
        onGeneralChange(values);
    };

    const handlePeriodSelect = (values) => {
        onPeriodChange(values);
    };

    const handleCurvesSelect = (values) => {
        onCurvesChange(values);
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
                    panel_tab={"Curves"}
                ></PanelTab>
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
                        ></ControllerListCurves>
                    }
                </PanelTabInterior>
            )}
        </div>
    );
}

export default Panel;
