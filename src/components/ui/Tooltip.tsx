import React, { useState } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'right' | 'bottom' | 'left';
  disabled?: boolean;
  className?: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'right',
  disabled = false,
  className = '',
  delay = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  if (disabled || !content) {
    return children;
  }

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md shadow-md whitespace-nowrap pointer-events-none transition-opacity duration-150 border border-slate-700/50 ${positionStyles[position]} ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
