import "../../App.css";
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import TextForGraphBlockHeader from "./TextForGraphBlockHeader.jsx";

function GraphBlockHeader({
                              onCollapseClick,
                              onTogglePanelClick,
                              onDuplicateGraphClick,
                              isCollapsed,
                              requestParameters,
                              is_oscillator
                          }) {
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

    function format_oscillator_number_of_weeks(number_of_weeks) {
        return !is_oscillator ? "" : (number_of_weeks !== 1 ? `${number_of_weeks} weeks` : `${number_of_weeks} week`);
    }

    return (
        <div className={`flex justify-between items-center ml-8 mr-[18px] ${isCollapsed ? "mb-5" : ""}`}>
            <ElementHorizontalList gap_class={"gap-1"}>
                <TextForGraphBlockHeader
                    graph_header={`${requestParameters.ticker} · 
                    ${format_date(requestParameters.from_data)}–${format_date(requestParameters.till_date)} · 
                    ${format_participant_type(requestParameters.participant_type)}${is_oscillator ? " · " : ""} 
                    ${format_oscillator_number_of_weeks(requestParameters.number_of_weeks)}`}></TextForGraphBlockHeader>
                <button onClick={onCollapseClick}>
                    <img className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                         src="collapse_graph.svg" alt="collapse graph"/>
                </button>
            </ElementHorizontalList>
            <ElementHorizontalList gap_class={"gap-1"}>
                <button onClick={onTogglePanelClick}>
                    <img src="toggle_panel.svg" alt="toggle panel"/>
                </button>
                <button onClick={onDuplicateGraphClick}>
                    <img src="duplicate_graph.svg" alt="duplicate graph"/>
                </button>
                <img src="delete_graph.svg" alt="delete graph"/>
            </ElementHorizontalList>
        </div>);
}

export default GraphBlockHeader;
