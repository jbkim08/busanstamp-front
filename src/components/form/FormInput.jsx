function FormInput({ label, error, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        {...inputProps}
        className={`
          w-full rounded-xl border px-4 py-3
          outline-none transition
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          }
        `}
      />

      {error && (
        <span className="mt-2 block text-sm text-red-600">{error}</span>
      )}
    </label>
  );
}

export default FormInput;
