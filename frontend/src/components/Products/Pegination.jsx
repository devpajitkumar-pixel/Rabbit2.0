const Pagination = ({ currentPage, totalPages, onPageChange, isFetching }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-start items-center gap-2 mt-10">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded
              ${
                currentPage === page
                  ? "bg-red-600 text-white border-red-600"
                  : "hover:bg-gray-100"
              }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Next
      </button>

      {isFetching && (
        <span className="ml-3 text-sm text-gray-500">Updating...</span>
      )}
    </div>
  );
};

export default Pagination;
