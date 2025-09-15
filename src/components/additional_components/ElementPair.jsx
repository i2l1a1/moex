import '../../App.css'

function ElementPair({children, gap_class}) {
    return (
        <div className={`flex ${gap_class} items-center`}>
            {children}
        </div>);
}

export default ElementPair;
