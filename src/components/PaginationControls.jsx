import React from 'react';
import { MdOutlineKeyboardArrowLeft  } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";


export default function PaginationControls({ pagination, handlePageChange }) {
  const { currentPage, lastPage, total, perPage } = pagination;

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(start + perPage - 1, total);

  const generatePageNumbers = () => {
    const pages = [];
    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", lastPage);
      } else if (currentPage >= lastPage - 3) {
        pages.push(1, "...", lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-auto">
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-700">
            Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <MdOutlineKeyboardArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {generatePageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={index}
                  className="relative inline-flex items-center px-4 py-2 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                >
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-xs font-semibold ${
                    page === currentPage
                      ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <MdKeyboardArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
