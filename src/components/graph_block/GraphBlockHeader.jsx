import "../../App.css";
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import TextForGraphBlockHeader from "./TextForGraphBlockHeader.jsx";

function GraphBlockHeader({onCollapseClick, isCollapsed}) {
    return (
        <div className={`flex justify-between items-center ml-10 mr-[25px] mt-7 ${isCollapsed ? "mb-7" : ""}`}>
            <ElementHorizontalList gap_class={"gap-1"}>
                <TextForGraphBlockHeader graph_header={"Graph 1"}></TextForGraphBlockHeader>
                <button onClick={onCollapseClick}>
                    <img className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} src="collapse_graph.svg" alt="collapse graph"/>
                </button>
            </ElementHorizontalList>
            <ElementHorizontalList gap_class={"gap-2"}>
                <img src="duplicate_graph.svg" alt="duplicate graph"/>
                <img src="delete_graph.svg" alt="delete graph"/>
            </ElementHorizontalList>
        </div>);
}

export default GraphBlockHeader;
