import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/50 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/50 text-rose-300 border-rose-800/60',
    info: 'bg-indigo-950/50 text-indigo-300 border-indigo-800/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
