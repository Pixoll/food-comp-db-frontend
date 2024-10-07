const OrderBy = () => {
    const handleSortChange = () => { }

    return(
        <select className="select-order" onChange={handleSortChange}>
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
        </select>
    );
}

export default OrderBy;
