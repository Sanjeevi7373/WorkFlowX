import React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'indigo';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'sm',
  variant = 'default',
  showLabel = false,
  className = '',
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const variantStyles = {
    default: 'bg-indigo-600 dark:bg-indigo-500',
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-rose-500 dark:bg-rose-400',
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span className="tabular-nums font-semibold text-slate-800 dark:text-slate-200">
            {clampedValue}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${variantStyles[variant]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
