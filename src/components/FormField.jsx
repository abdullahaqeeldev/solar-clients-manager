function FormField({ label, name, error, className = "", children }) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
      >
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default FormField;
