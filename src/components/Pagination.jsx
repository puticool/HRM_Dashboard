import { ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  maxPagesToShow = 5
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate current range of items being shown
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Create page number buttons
  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 1) return pageNumbers;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-9 h-8 mx-0.5 flex items-center justify-center rounded-lg transition-colors font-medium ${
            currentPage === i 
              ? 'bg-blue-500 text-slate-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700' 
              : 'bg-white text-slate-900 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-blue-950'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Showing {startItem}-{endItem} of {totalItems} entries
      </div>
      <div className="flex items-center">
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          className={`w-9 h-8 flex items-center justify-center rounded-l-lg border transition-colors ${
            currentPage === 1 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300 dark:bg-slate-800 dark:border-slate-700' 
              : 'bg-white text-slate-900 hover:bg-blue-50 border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-50 dark:hover:bg-blue-950'
          }`}
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center h-10">
          {renderPageNumbers()}
        </div>
        
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages || totalPages === 0}
          className={`w-9 h-8 flex items-center justify-center rounded-r-lg border transition-colors ${
            currentPage === totalPages || totalPages === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300 dark:bg-slate-800 dark:border-slate-700' 
              : 'bg-white text-slate-900 hover:bg-blue-50 border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-50 dark:hover:bg-blue-950'
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  maxPagesToShow: PropTypes.number
};

export default Pagination;