import "./FormField.css";

export default function FormField({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  children,
  className = "",
}) {
  return (
    <div className={`k-form-field ${error ? "k-form-field-has-error" : ""} ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="k-form-label">
          {label}
          {required && <span className="k-form-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="k-form-control-wrap">{children}</div>
      {error ? (
        <p className="k-form-error">{error}</p>
      ) : helperText ? (
        <p className="k-form-helper">{helperText}</p>
      ) : null}
    </div>
  );
}
