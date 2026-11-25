import React from 'react';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = '7xl',
  className = '',
  ...props
}) => {
  const maxWidthStyles = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`min-h-full w-full bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 ${className}`}
      {...props}
    >
      <div className={`mx-auto w-full ${maxWidthStyles[maxWidth]}`}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
