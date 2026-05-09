export default function Pagination({ page, totalPages, goNext, goPrev }) {

  return (
    <div className="pagination-controls">
      <button onClick={goPrev} disabled={page === 1}>
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button onClick={goNext} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}