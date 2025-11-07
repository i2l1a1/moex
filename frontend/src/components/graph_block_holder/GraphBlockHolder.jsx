import React, {useState} from "react";
import GraphBlock from "../graph_block/GraphBlock.jsx";

function GraphBlockHolder() {
    const [graphBlocks, setGraphBlocks] = useState([1]);

    const duplicateGraphBlock = () => {
        setGraphBlocks((prevBlocks) => [
            ...prevBlocks,
            Math.max(...prevBlocks) + 1,
        ]);
    };

    return (
        <div className="flex flex-col gap-8 w-full h-full overflow-y-auto">
            {graphBlocks.map((id) => (
                <GraphBlock key={id} id={id} onDuplicateGraphClick={duplicateGraphBlock}/>
            ))}
        </div>
    );
}

export default GraphBlockHolder;
