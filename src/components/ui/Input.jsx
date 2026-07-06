import { forwardRef, useId } from 'react';

/**
 * Input — labelled text field with inline error (Tailwind CSS v4).
 */
const Input = forwardRef(function Input(
  { label, error, id, type = 'text', className = '', ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : undefined;

  return (
    <div className={['flex flex-col gap-1', className].join(' ')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={[
          'h-12 px-4 rounded-[10px] border bg-surface-pure text-ink text-[15px] transition-all duration-150',
          'placeholder:text-ink-soft',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
          error
            ? 'border-[#C81E1E] focus:ring-[#C81E1E]'
            : 'border-border hover:border-ink-muted',
        ].join(' ')}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {error && (
        <p
          id={describedBy}
          className="text-[12px] text-[#C81E1E] font-medium mt-0.5"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
