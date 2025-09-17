import "../../App.css";
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import TextForGraphBlockHeader from "./TextForGraphBlockHeader.jsx";

function GraphBlockHeader({onCollapseClick, isCollapsed}) {
    return (
        <div className={`flex justify-between items-center ml-8 mr-[18px] ${isCollapsed ? "mb-5" : ""}`}>
            <ElementHorizontalList gap_class={"gap-1"}>
                <TextForGraphBlockHeader graph_header={"SI · 25.01.2024–07.03.2025 · YUR"}></TextForGraphBlockHeader>
                <button onClick={onCollapseClick}>
                    <img className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} src="collapse_graph.svg" alt="collapse graph"/>
                </button>
            </ElementHorizontalList>
            <ElementHorizontalList gap_class={"gap-1"}>
                <img src="duplicate_graph.svg" alt="duplicate graph"/>
                <img src="delete_graph.svg" alt="delete graph"/>
            </ElementHorizontalList>
        </div>);
}

export default GraphBlockHeader;
