const OrderBy = () => {
    const handleSortChage = () => {

    }
    return(
        <select onChange={handleSortChage}>
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
        </select>
    );
}

export default OrderBy