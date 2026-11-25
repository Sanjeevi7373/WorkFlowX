import React, { forwardRef } from 'react';
import { Tooltip } from './Tooltip';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  tooltip?: string;
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
  variant?: 'default' | 'ghost' | 'outline' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      tooltip,
      tooltipPosition = 'top',
      variant = 'ghost',
      size = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-9 w-9 text-sm',
      lg: 'h-10 w-10 text-base',
    };

    const variantStyles = {
      default:
        'bg-slate-800 text-slate-200 hover:bg-slate-700',
      ghost:
        'text-slate-400 hover:text-slate-100 hover:bg-slate-800',
      outline:
        'border border-slate-700 text-slate-300 hover:bg-slate-800',
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm focus:ring-indigo-500',
    };

    const button = (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );

    if (tooltip && !disabled) {
      return (
        <Tooltip content={tooltip} position={tooltipPosition}>
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
