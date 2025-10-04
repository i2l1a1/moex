import "../../App.css";
import PanelTab from "./PanelTab.jsx";
import PanelTabInterior from "./PanelTabInterior.jsx";
import ControllerListGeneral from "./controller_lists/ControllerListGeneral.jsx";
import ControllerListPeriod from "./controller_lists/ControllerListPeriod.jsx";
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";

function Panel({
                   onGeneralChange,
                   onPeriodChange,
                   selectedGeneralValues,
                   selectedPeriodValues,
                   activePanelTab,
                   setActivePanelTab
               }) {
    const toggleCollapseGeneralTab = () => {
        setActivePanelTab("general");
    };

    const toggleCollapsePeriodTab = () => {
        setActivePanelTab("period");
    };

    const handleGeneralSelect = (values) => {
        onGeneralChange(values);
    };

    const handlePeriodSelect = (values) => {
        onPeriodChange(values);
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
        </div>
    );
}

export default Panel;
