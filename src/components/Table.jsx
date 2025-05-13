import PropTypes from "prop-types";

const DataTable = ({ 
  columns, 
  data, 
  isLoading,
  emptyMessage = "No data available" 
}) => {
  return (
    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <table className="table">
          <thead className="table-header">
            <tr className="table-row">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`table-head ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="table-row">
                  {columns.map((column, colIndex) => (
                    <td 
                      key={`${rowIndex}-${colIndex}`} 
                      className={`table-cell ${column.cellClassName || ''}`}
                    >
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="table-row">
                <td colSpan={columns.length} className="table-cell text-center py-8">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
      className: PropTypes.string,
      cellClassName: PropTypes.string
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  emptyMessage: PropTypes.string
};

export default DataTable;