import '../../App.css'

function ElementHorizontalList({children, gap_class}) {
    return (
        <div className={`flex ${gap_class} items-center`}>
            {children}
        </div>);
}

export default ElementHorizontalList;
