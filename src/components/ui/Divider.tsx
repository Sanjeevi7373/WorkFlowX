import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className = '',
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block w-px self-stretch bg-slate-200 dark:bg-slate-800 ${className}`}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center my-3 ${className}`}
        {...props}
      >
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        <span className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <hr
      className={`border-0 border-t border-slate-200 dark:border-slate-800 my-2 ${className}`}
      {...props}
    />
  );
};

export default Divider;
