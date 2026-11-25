import React, { useState } from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  alt,
  size = 'md',
  status,
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeStyles = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
    xl: 'h-14 w-14 text-lg',
  };

  const statusSize = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
  };

  const statusColor = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center font-semibold border border-slate-200 dark:border-slate-700 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 select-none ${sizeStyles[size]}`}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-slate-900 ${statusSize[size]} ${statusColor[status]}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Avatar;
