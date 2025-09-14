import '../App.css'
import ElementPair from "./ElementPair.jsx";
import TextForGraphPanelGroup from "./TextForGraphPanelGroup.jsx";

function PanelGroup({panel_group, children}) {
    return (
        <div className="flex">
            <ElementPair>
                <img src="expand_panel_group.svg" alt="collapse panel group"/>
                <TextForGraphPanelGroup panel_group={panel_group}></TextForGraphPanelGroup>
            </ElementPair>
            {children}
        </div>);
}

export default PanelGroup;
