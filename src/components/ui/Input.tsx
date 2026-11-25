import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2 text-sm bg-slate-900 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20 text-rose-200'
              : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-400'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
