import "../App.css";
import GraphHeader from "./GraphHeader.jsx";
import {useState} from "react";
import PanelGroup from "./PanelGroup.jsx";
import Panel from "./Panel.jsx";

function GraphBlock() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className={`fixed bg-background-block rounded-[40px] ${
                isCollapsed ? "top-10 left-10 right-10" : "inset-10"}`}
        >
            <GraphHeader
                onCollapseClick={toggleCollapse}
                isCollapsed={isCollapsed}
            ></GraphHeader>
            {!isCollapsed && (
                <div>
                    <Panel></Panel>
                </div>
            )}
        </div>
    );
}

export default GraphBlock;
