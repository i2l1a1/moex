import '../../App.css'
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import TextForGraphPanelTab from "./TextForGraphPanelTab.jsx";

function PanelTab({panel_tab, children, onCollapseClick, isCollapsed}) {
    return (
        <div>
            <ElementHorizontalList>
                <button onClick={onCollapseClick}>
                    <TextForGraphPanelTab isCollapsed={isCollapsed} panel_tab={panel_tab}></TextForGraphPanelTab>
                </button>
            </ElementHorizontalList>
            {children}
        </div>);
}

export default PanelTab;
