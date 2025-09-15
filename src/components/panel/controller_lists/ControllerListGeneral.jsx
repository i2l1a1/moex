import ElementHorizontalList from "../../additional_components/ElementHorizontalList.jsx";

function ControllerListGeneral() {
    return (
        <div>
            <ElementHorizontalList gap_class={"gap-4"}>
                <div className="bg-blue-500 w-[240px] h-[36px]"></div>
                <div className="bg-blue-500 w-[240px] h-[36px]"></div>
                <div className="bg-blue-500 w-[240px] h-[36px]"></div>
            </ElementHorizontalList>
        </div>
    )
}

export default ControllerListGeneral;
