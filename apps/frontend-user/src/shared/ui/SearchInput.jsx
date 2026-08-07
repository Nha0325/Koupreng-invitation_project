import { IoSearchOutline, IoCloseCircleOutline } from "react-icons/io5";
import "./SearchInput.css";

export default function SearchInput({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  ariaLabel = "Search input",
  className = "",
  disabled = false,
}) {
  return (
    <div className={`k-search-input-wrap ${className}`}>
      <IoSearchOutline className="k-search-icon" aria-hidden="true" />
      <input
        type="text"
        className="k-search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      {value && onClear && (
        <button
          type="button"
          className="k-search-clear-btn"
          onClick={onClear}
          aria-label="Clear search input"
          disabled={disabled}
        >
          <IoCloseCircleOutline aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
