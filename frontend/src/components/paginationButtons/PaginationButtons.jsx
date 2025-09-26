










const PaginationButtons = ({ currentPage, setCurrentPage, perPage, metaData }) => {
  const totalPages = Math.ceil(metaData.total / perPage);

  const handlePaginate = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) handlePaginate(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) handlePaginate(currentPage + 1);
  };

  const getPaginationButtons = () => {
    const pages = [];

    if (totalPages <= 4) {
      // Show all pages if few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // First

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages); // Last
    }

    return pages;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <p>
        <span>Page {currentPage} of {totalPages}</span>
      </p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "5px" }}>
        <button className="btn btn-dark" onClick={handlePreviousPage} disabled={currentPage <= 1}>&laquo;</button>

        {getPaginationButtons().map((page, index) =>
          page === '...' ? (
            <span key={index} style={{ padding: '6px 12px' }}>...</span>
          ) : (
            <button
              key={index}
              className={`btn btn-light ${currentPage === page ? 'btn-dark' : ''}`}
              onClick={() => handlePaginate(page)}
            >
              {page}
            </button>
          )
        )}

        <button onClick={handleNextPage} disabled={currentPage >= totalPages} className={`btn ${currentPage >= totalPages ? 'btn-secondary' : 'btn-dark'}`}>&raquo;</button>
      </div>
    </div>
  );
};

export default PaginationButtons;
