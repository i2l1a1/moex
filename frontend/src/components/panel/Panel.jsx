import "../../App.css";
import PanelGroup from "./PanelGroup.jsx";
import {useState, useEffect} from "react";
import PanelGroupInterior from "./PanelGroupInterior.jsx";
import ControllerListGeneral from "./controller_lists/ControllerListGeneral.jsx";
import ControllerListPeriod from "./controller_lists/ControllerListPeriod.jsx";

function Panel({onGeneralChange, onPeriodChange, onLastPanelGroupChange}) {
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

    useEffect(() => {
        onLastPanelGroupChange(isCollapsedPeriodGroup);
    }, [isCollapsedPeriodGroup, onLastPanelGroupChange]);

    return (
        <div className="flex flex-col -ml-4">
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
