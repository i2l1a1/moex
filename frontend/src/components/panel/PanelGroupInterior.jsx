import "../../App.css";

function PanelGroupInterior({ isCollapsed, children }) {
    return <div className="ml-8">{!isCollapsed && children}</div>;
}

export default PanelGroupInterior;
