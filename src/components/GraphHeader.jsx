import '../App.css'
import ElementPair from "./ElementPair.jsx";
import TextForGraphHeader from "./TextForGraphHeader.jsx";

function GraphHeader() {
    return (
        <div className=" flex justify-between items-center ml-10 mr-[25px] mt-7">
            <ElementPair gap_class={"gap-1"}>
                <TextForGraphHeader graph_header={"Graph 1"}></TextForGraphHeader>
                <img src="collapse_graph.svg" alt="collapse graph"/>
            </ElementPair>
            <ElementPair gap_class={"gap-2"}>
                <img src="duplicate_graph.svg" alt="duplicate graph"/>
                <img src="delete_graph.svg" alt="delete graph"/>
            </ElementPair>
        </div>);
}

export default GraphHeader;
