import '../../App.css'
import PanelGroup from "./PanelGroup.jsx";
import {useState} from "react";
import PanelGroupInterior from "./PanelGroupInterior.jsx";
import ControllerListGeneral from "./controller_lists/ControllerListGeneral.jsx";
import ControllerListPeriod from "./controller_lists/ControllerListPeriod.jsx";

function Panel() {
    const [isCollapsedGeneralGroup, setIsCollapsedGeneralGroup] = useState(true);
    const [isCollapsedPeriodGroup, setIsCollapsedPeriodGroup] = useState(true);

    const toggleCollapseGeneralGroup = () => {
        setIsCollapsedGeneralGroup(!isCollapsedGeneralGroup);
    };

    const toggleCollapsePeriodGroup = () => {
        setIsCollapsedPeriodGroup(!isCollapsedPeriodGroup);
    };

    return (<div className=" flex flex-col gap-1 mt-[14px] ml-[23px] mr-10">
        <PanelGroup onCollapseClick={toggleCollapseGeneralGroup} isCollapsed={isCollapsedGeneralGroup}
                    panel_group={"General"}>
            <PanelGroupInterior isCollapsed={isCollapsedGeneralGroup}>{
                <ControllerListGeneral></ControllerListGeneral>}</PanelGroupInterior>
        </PanelGroup>
        <PanelGroup onCollapseClick={toggleCollapsePeriodGroup} isCollapsed={isCollapsedPeriodGroup}
                    panel_group={"Period"}>
            <PanelGroupInterior isCollapsed={isCollapsedPeriodGroup}>{<ControllerListPeriod></ControllerListPeriod>}</PanelGroupInterior>
        </PanelGroup>
    </div>);
}

export default Panel;
