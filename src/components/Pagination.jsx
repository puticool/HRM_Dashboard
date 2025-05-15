import { ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  maxPagesToShow = 5,
  isLoading = false,
  perPageOptions = [10, 25, 50, 100],
  showJumpToPage = false
}) => {
  const [jumpPage, setJumpPage] = useState("");

  const handlePrevPage = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    if (onItemsPerPageChange && !isLoading) {
      onItemsPerPageChange(Number(e.target.value));
    }
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    
    const pageNum = parseInt(jumpPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages && !isLoading) {
      onPageChange(pageNum);
      setJumpPage("");
    } else {
      // Show error feedback (optional)
      setJumpPage("");
    }
  };

  // Calculate current range of items being shown
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Create page number buttons
  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 1) return pageNumbers;
    
    // Always include the first page
    if (currentPage > 3 && totalPages > maxPagesToShow) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => !isLoading && onPageChange(1)}
          disabled={isLoading}
          className={`w-9 h-8 mx-0.5 flex items-center justify-center rounded-lg transition-colors font-medium bg-white text-slate-900 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-blue-950 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          1
        </button>
      );
      
      // Show ellipsis if needed
      if (currentPage > 4) {
        pageNumbers.push(
          <span key="ellipsis1" className="w-8 text-center">...</span>
        );
      }
    }
    
    let startPage = Math.max(1, currentPage - Math.floor((maxPagesToShow - 2) / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 3);
    
    if (endPage - startPage + 1 < maxPagesToShow - 2) {
      startPage = Math.max(1, endPage - maxPagesToShow + 3);
    }
    
    // Adjust if we're near the start
    if (startPage <= 2) {
      startPage = 1;
      endPage = Math.min(totalPages, maxPagesToShow - 2);
    }
    
    // Adjust if we're near the end
    if (endPage >= totalPages - 1) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxPagesToShow + 3);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => !isLoading && onPageChange(i)}
          disabled={isLoading}
          className={`w-9 h-8 mx-0.5 flex items-center justify-center rounded-lg transition-colors font-medium ${
            currentPage === i 
              ? 'bg-blue-500 text-slate-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700' 
              : 'bg-white text-slate-900 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-blue-950'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    // Always include the last page
    if (currentPage < totalPages - 2 && totalPages > maxPagesToShow) {
      // Show ellipsis if needed
      if (currentPage < totalPages - 3) {
        pageNumbers.push(
          <span key="ellipsis2" className="w-8 text-center">...</span>
        );
      }
      
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => !isLoading && onPageChange(totalPages)}
          disabled={isLoading}
          className={`w-9 h-8 mx-0.5 flex items-center justify-center rounded-lg transition-colors font-medium bg-white text-slate-900 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-blue-950 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {totalPages}
        </button>
      );
    }
    
    return pageNumbers;
  };

  // Ensure we don't show pagination if there's no data
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Showing {startItem}-{endItem} of {totalItems} entries
        {isLoading && <span className="ml-2 text-blue-500">Loading...</span>}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {onItemsPerPageChange && (
          <div className="flex items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">
              Show
            </span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              disabled={isLoading}
              className={`bg-white text-slate-900 dark:text-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {perPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
        
        {showJumpToPage && (
          <form onSubmit={handleJumpToPage} className="flex items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">
              Go to
            </span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              disabled={isLoading}
              className={`w-14 bg-white text-slate-900 dark:text-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Page"
            />
            <button
              type="submit"
              disabled={isLoading || jumpPage === "" || isNaN(parseInt(jumpPage))}
              className={`ml-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 ${(isLoading || jumpPage === "" || isNaN(parseInt(jumpPage))) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Go
            </button>
          </form>
        )}
        
        <div className="flex items-center">
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1 || isLoading}
            className={`w-9 h-8 flex items-center justify-center rounded-l-lg border transition-colors ${
              currentPage === 1 || isLoading
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
            disabled={currentPage === totalPages || totalPages === 0 || isLoading}
            className={`w-9 h-8 flex items-center justify-center rounded-r-lg border transition-colors ${
              currentPage === totalPages || totalPages === 0 || isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300 dark:bg-slate-800 dark:border-slate-700' 
                : 'bg-white text-slate-900 hover:bg-blue-50 border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-50 dark:hover:bg-blue-950'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
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
  onItemsPerPageChange: PropTypes.func,
  maxPagesToShow: PropTypes.number,
  isLoading: PropTypes.bool,
  perPageOptions: PropTypes.arrayOf(PropTypes.number),
  showJumpToPage: PropTypes.bool
};

export default Pagination;