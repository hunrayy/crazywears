
const CategoryMenuComponent = ({categoryMenuExiting, closeCategoryMenu, selectedCategory, handleCategorySelect, categories}) => {
    console.log("hello")
    return <div className={`menu-overlay ${categoryMenuExiting ? "fade-out" : "fade-in"}`} onClick={closeCategoryMenu}>
        <div className={`text-muted menu-panel ${categoryMenuExiting ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
            <h6 className="my-4">CATEGORIES</h6>
            <div
            key={'0'}
            className={` menu-item ${'all' === selectedCategory ? "active" : ""}`}
            onClick={() => handleCategorySelect('all')}
            >
            All
            </div>
            {categories && categories.map((cat, idx) => (
            <div
                key={idx + 1}
                className={` menu-item ${cat.name.toLowerCase() === selectedCategory ? "active" : ""}`}
                onClick={() => handleCategorySelect(cat)}
            >
                {cat.name}
            </div>
            ))}
        </div>
    </div>
}
export default CategoryMenuComponent