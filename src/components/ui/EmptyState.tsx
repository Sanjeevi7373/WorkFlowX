import React from 'react';
import { FolderOpen } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/50 ${className}`}
      {...props}
    >
      <div className="h-12 w-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
        {icon || <FolderOpen className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
