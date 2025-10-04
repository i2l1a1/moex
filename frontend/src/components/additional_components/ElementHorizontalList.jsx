import "../../App.css";

function ElementHorizontalList({ children, gap_class }) {
    return (
        <div className={`flex flex-wrap ${gap_class} items-center`}>
            {children}
        </div>
    );
}

export default ElementHorizontalList;
