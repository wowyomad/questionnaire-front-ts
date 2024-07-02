interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handleClickNext = () => {
      if (currentPage < totalPages - 1) {
        onPageChange(currentPage + 1);
      }
    };
  
    const handleClickPrevious = () => {
      if (currentPage > 0) {
        onPageChange(currentPage - 1);
      }
    };
  
    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handleClickPrevious} tabIndex={-1}>Previous</button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(i)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handleClickNext}>Next</button>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Pagination;