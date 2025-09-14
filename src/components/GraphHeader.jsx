import '../App.css'

function GraphHeader() {
    return (
        <div className="flex items-center mx-10 mt-7">
            <div className="flex gap-1 items-center">
                <div className="text-main-text">Graph 1</div>
                <img src="collapse_graph.svg" alt="collapse graph"/>
            </div>
        </div>);
}

export default GraphHeader;
