import "../../App.css";

function TextForGraphPanelTab({panel_tab, isCollapsed}) {
    return (<div
        className={`text-button-text text-lite-gray ${!isCollapsed ? 'text-main-text bg-accent px-4 py-2 -mx-4 rounded-xl' : ''}`}>{panel_tab}
    </div>);
}

export default TextForGraphPanelTab;
