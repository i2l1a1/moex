import "../../App.css";
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import TextForGraphBlockHeader from "./TextForGraphBlockHeader.jsx";

function GraphBlockHeader({onCollapseClick, onTogglePanelClick, isCollapsed, requestParameters}) {
    function format_date(date_raw) {  // YYYY-MM-DD -> DD.MM.YYYY
        if (!date_raw) {
            return "...";
        }
        date_raw = date_raw.split("-");
        return `${date_raw[2]}.${date_raw[1]}.${date_raw[0]}`;
    }

    function format_participant_type(participant_type) {
        if (participant_type === "FIZ") return "Individuals";
        if (participant_type === "YUR") return "Companies";
        return "Individuals & Companies";
    }

    return (
        <div className={`flex justify-between items-center ml-8 mr-[18px] ${isCollapsed ? "mb-5" : ""}`}>
            <ElementHorizontalList gap_class={"gap-1"}>
                <TextForGraphBlockHeader
                    graph_header={`${requestParameters.ticker} · ${format_date(requestParameters.from_data)}–${format_date(requestParameters.till_date)} · ${format_participant_type(requestParameters.participant_type)}`}></TextForGraphBlockHeader>
                <button onClick={onCollapseClick}>
                    <img className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                         src="collapse_graph.svg" alt="collapse graph"/>
                </button>
            </ElementHorizontalList>
            <ElementHorizontalList gap_class={"gap-1"}>
                <button onClick={onTogglePanelClick}>
                    <img src="toggle_panel.svg" alt="toggle panel"/>
                </button>
                <img src="duplicate_graph.svg" alt="duplicate graph"/>
                <img src="delete_graph.svg" alt="delete graph"/>
            </ElementHorizontalList>
        </div>);
}

export default GraphBlockHeader;
