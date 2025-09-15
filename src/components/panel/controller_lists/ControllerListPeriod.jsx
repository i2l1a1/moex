import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";

function ControllerListPeriod() {
    return (
        <div>
            <ElementHorizontalList gap_class={"gap-4"}>
                <div className="bg-amber-900 w-[240px] h-[36px]"></div>
                <div className="bg-amber-900 w-[240px] h-[36px]"></div>
            </ElementHorizontalList>
        </div>
    )
}

export default ControllerListPeriod;
