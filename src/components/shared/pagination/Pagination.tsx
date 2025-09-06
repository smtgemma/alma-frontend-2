interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
    return (
        <nav role="navigation" aria-label="Pagination" className={`flex items-center justify-center gap-2 ${className}`}>
            {/* Prev button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 text-sm font-medium border rounded-full enabled:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Prev
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                const isActive = pageNumber === currentPage

                return (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        disabled={isActive}
                        className={`w-8 h-8 flex border mx-2 items-center justify-center rounded-full text-sm font-medium transition-colors
              ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-700"}`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {pageNumber}
                    </button>
                )
            })}

            {/* Next button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 text-sm font-medium rounded-full bg-blue-500 text-white enabled:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        </nav>
    )
}

