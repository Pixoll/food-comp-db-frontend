import "../../../assets/css/_pagination.css"
interface PaginationProps {
    currentPage: number;
    npage: number;
    onPageChange: (page: number) => void;
  }
  
  const PaginationAdmin: React.FC<PaginationProps> = ({
    currentPage,
    npage,
    onPageChange,
  }) => {
    const getPageNumbers = () => {
      const pageLimit = 5;
      const sidePages = 2;
      const numbers = [...Array(npage + 1).keys()].slice(1);
      let pages: (number | string)[] = [];
  
      if (npage <= pageLimit) {
        pages = numbers;
      } else {
        if (currentPage <= sidePages + 1) {
          pages = [...numbers.slice(0, sidePages + 2), "...", npage];
        } else if (currentPage >= npage - sidePages) {
          pages = [1, "...", ...numbers.slice(npage - (sidePages + 2))];
        } else {
          pages = [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            npage,
          ];
        }
      }
  
      return pages;
    };
  
    return (
      <nav>
        <ul className="pagination-table">
          <li className="page-item-table">
            <a href="#" className="page-link" onClick={() => onPageChange(currentPage - 1)}>
              {"<"}
            </a>
          </li>
  
          {getPageNumbers().map((n, i) => (
            <li className={`page-item-table ${currentPage === n ? "active" : ""}`} key={i}>
              {typeof n === "number" ? (
                <a href="#" className="page-link" onClick={() => onPageChange(n)}>
                  {n}
                </a>
              ) : (
                <span className="page-link">{n}</span>
              )}
            </li>
          ))}
  
          <li className="page-item-table">
            <a href="#" className="page-link" onClick={() => onPageChange(currentPage + 1)}>
              {">"}
            </a>
          </li>
        </ul>
      </nav>
    );
  };
export default PaginationAdmin;  