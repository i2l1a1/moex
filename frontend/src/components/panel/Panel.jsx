import "../../App.css";
import PanelGroup from "./PanelGroup.jsx";
import {useState} from "react";
import PanelGroupInterior from "./PanelGroupInterior.jsx";
import ControllerListGeneral from "./controller_lists/ControllerListGeneral.jsx";
import ControllerListPeriod from "./controller_lists/ControllerListPeriod.jsx";

function Panel({onGeneralChange, onPeriodChange}) {
    const [isCollapsedGeneralGroup, setIsCollapsedGeneralGroup] =
        useState(true);
    const [isCollapsedPeriodGroup, setIsCollapsedPeriodGroup] = useState(true);

    const toggleCollapseGeneralGroup = () => {
        setIsCollapsedGeneralGroup(!isCollapsedGeneralGroup);
    };

    const toggleCollapsePeriodGroup = () => {
        setIsCollapsedPeriodGroup(!isCollapsedPeriodGroup);
    };

    const handleGeneralSelect = (values) => {
        onGeneralChange(values);
    };

    const handlePeriodSelect = (values) => {
        onPeriodChange(values);
    };

    return (
        <div className="flex flex-col gap-[4px] mt-[14px] ml-[-15px]">
            <PanelGroup onCollapseClick={toggleCollapseGeneralGroup}
                        isCollapsed={isCollapsedGeneralGroup}
                        panel_group={"General"}
            >
                <PanelGroupInterior isCollapsed={isCollapsedGeneralGroup}>
                    {
                        <ControllerListGeneral
                            onSelectGeneral={handleGeneralSelect}
                        ></ControllerListGeneral>
                    }
                </PanelGroupInterior>
            </PanelGroup>
            <PanelGroup
                onCollapseClick={toggleCollapsePeriodGroup}
                isCollapsed={isCollapsedPeriodGroup}
                panel_group={"Period"}
            >
                <PanelGroupInterior isCollapsed={isCollapsedPeriodGroup}>
                    {
                        <ControllerListPeriod
                            onSelectPeriod={handlePeriodSelect}
                        ></ControllerListPeriod>
                    }
                </PanelGroupInterior>
            </PanelGroup>
        </div>
    );
}

export default Panel;
