import "../../../assets/css/_pagination.css";

interface PaginationProps {
  currentPage: number;
  npage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, npage, onPageChange }: PaginationProps) {
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
          <span className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            {"<"}
          </span>
        </li>

        {getPageNumbers().map((n, i) => (
          <li className={`page-item-table ${currentPage === n ? "active" : ""}`} key={i}>
            {typeof n === "number" ? (
              <span className="page-link" onClick={() => onPageChange(n)}>
                {n}
              </span>
            ) : (
              <span className="page-link">{n}</span>
            )}
          </li>
        ))}

        <li className="page-item-table">
          <span className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            {">"}
          </span>
        </li>
      </ul>
    </nav>
  );
}
