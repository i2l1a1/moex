import "../../App.css";
import GraphBlockHeader from "./GraphBlockHeader.jsx";
import {useState} from "react";
import Panel from "../panel/Panel.jsx";

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
            <GraphBlockHeader
                onCollapseClick={toggleCollapse}
                isCollapsed={isCollapsed}
            ></GraphBlockHeader>
            {!isCollapsed && (
                <div>
                    <Panel></Panel>
                </div>
            )}
        </div>
    );
}

export default GraphBlock;
