import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load workspace data',
  description = 'Something went wrong while communicating with the service. Please try again.',
  onRetry,
  className = '',
  ...props
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 ${className}`}
      {...props}
    >
      <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">{title}</h3>
      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 max-w-sm leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100/60"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try again</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
