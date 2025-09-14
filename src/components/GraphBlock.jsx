import "../App.css";
import GraphHeader from "./GraphHeader.jsx";
import {useState} from "react";

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
                    {/*{123}*/}
                </div>
            )}
        </div>
    );
}

export default GraphBlock;
