import '../App.css'
import GraphHeader from "./GraphHeader.jsx";

function GraphBlock() {
    return (<div className="fixed inset-10 bg-background-block rounded-[40px]">
        <GraphHeader></GraphHeader>
    </div>);
}

export default GraphBlock;
