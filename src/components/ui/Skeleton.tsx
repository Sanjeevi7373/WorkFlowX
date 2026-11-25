import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl h-32 w-full',
  };

  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800 ${variantStyles[variant]} ${className}`}
      style={inlineStyles}
      {...props}
    />
  );
};

export default Skeleton;
