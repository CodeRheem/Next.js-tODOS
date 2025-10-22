
type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  return (
    <div
      className="flex justify-between mt-4"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={`Go to page ${currentPage - 1}`}
        className={`px-4 py-2 rounded-md text-white font-serif ${
          currentPage === 1
            ? "bg-gray-300 px-10 py-2 rounded-md cursor-not-allowed"
            : "bg-purple-700 hover:bg-red-400 px-10 py-2 rounded-md font-bold cursor-pointer"
        }`}
      >
        Previous
      </button>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label={`Go to page ${currentPage + 1}`}
        className={`px-4 py-2 rounded-md text-white font-serif ${
          currentPage >= totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-purple-700 hover:bg-[#551c89] px-12 py-2 rounded-md font-bold cursor-pointer"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;