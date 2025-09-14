import '../App.css'
import PanelGroup from "./PanelGroup.jsx";

function Panel() {
    return (<div className=" flex flex-col gap-1 mt-[14px] ml-[23px] mr-10">
        <PanelGroup panel_group={"General"}></PanelGroup>
        <PanelGroup panel_group={"General"}></PanelGroup>
    </div>);
}

export default Panel;
