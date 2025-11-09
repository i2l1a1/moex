import "../../App.css";
import ElementHorizontalList from "../additional_components/ElementHorizontalList.jsx";
import TextForGraphBlockHeader from "./TextForGraphBlockHeader.jsx";

function GraphBlockHeader({
                              onCollapseClick,
                              onTogglePanelClick,
                              onDownloadTableClick,
                              onDuplicateGraphClick,
                              isCollapsed,
                              isPanelCollapsed,
                              requestParameters,
                              is_oscillator,
                              onDeleteGraphClick,
                              mainMisses,
                              costMisses
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

    const handleShowStatisticsClick = () => {
        alert(`Main data misses: ${mainMisses}\nCost data misses: ${costMisses}`);
    };

    return (
        <div className={`flex justify-between items-center ml-8 mr-[18px] ${isPanelCollapsed ? "mb-5" : ""}`}>
            <ElementHorizontalList gap_class={"gap-1"}>
                <TextForGraphBlockHeader
                    graph_header={`${requestParameters?.ticker || ''} · ${format_date(requestParameters?.from_data)}–${format_date(requestParameters?.till_date)} · ${format_participant_type(requestParameters?.participant_type)}${is_oscillator ? " · " : ""} ${format_oscillator_number_of_weeks(requestParameters?.number_of_weeks)}`}
                />
                <button onClick={onCollapseClick}>
                    <img className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                         src="/collapse_graph.svg" alt="collapse graph"/>
                </button>
            </ElementHorizontalList>
            <ElementHorizontalList gap_class={"gap-1"}>
                <button onClick={onTogglePanelClick}>
                    <img src="/toggle_panel.svg" alt="toggle panel"/>
                </button>
                <button onClick={handleShowStatisticsClick}>
                    <img src="/show_statistics.svg" alt="show statistics"/>
                </button>
                <button onClick={onDownloadTableClick}>
                    <img src="/download_table.svg" alt="download table"/>
                </button>
                <button onClick={onDuplicateGraphClick}>
                    <img src="/duplicate_graph.svg" alt="duplicate graph"/>
                </button>
                <button onClick={onDeleteGraphClick}>
                    <img src="/delete_graph.svg" alt="delete graph"/>
                </button>
            </ElementHorizontalList>
        </div>
    );
}

export default GraphBlockHeader;
