import '../../App.css'
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import TextForGraphPanelGroup from "./TextForGraphPanelGroup.jsx";

function PanelGroup({panel_group, children, onCollapseClick, isCollapsed}) {
    return (
        <div className={`flex flex-col ${!isCollapsed ? 'gap-[6px]' : ''}`}>
            <ElementHorizontalList>
                <button onClick={onCollapseClick}>
                    <img className={`transition-transform duration-200 ${!isCollapsed ? "rotate-90" : ""}`}
                         src="expand_panel_group.svg" alt="collapse panel group"/>
                </button>
                <TextForGraphPanelGroup panel_group={panel_group}></TextForGraphPanelGroup>
            </ElementHorizontalList>
            {children}
        </div>);
}

export default PanelGroup;
