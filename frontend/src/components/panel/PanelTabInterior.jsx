import "../../App.css";

function PanelTabInterior({ isCollapsed, children }) {
    return <div className="-ml-4 mt-4">{!isCollapsed && children}</div>;
}

export default PanelTabInterior;
