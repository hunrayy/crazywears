

const SortMenuComponent = ({sortMenuExiting, closeSortMenu, sortOptions, selectedSort, handleSortSelect}) => {
    return <div className={`menu-overlay ${sortMenuExiting ? "fade-out" : "fade-in"}`} onClick={closeSortMenu}>
        <div className={`text-muted menu-panel ${sortMenuExiting ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
            <h6 className="my-4">SORT BY</h6>
            {sortOptions.map((option, idx) => (
            <div
                key={idx}
                className={`menu-item ${option === selectedSort ? "active" : ""}`}
                onClick={() => handleSortSelect(option)}
            >
                {option}
            </div>
            ))}
        </div>
    </div>
}
export default SortMenuComponent