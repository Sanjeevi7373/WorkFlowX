import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  className = '',
  isOpen: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  const alignmentStyles = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer inline-flex items-center"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
      </div>

      {open && (
        <div
          role="menu"
          className={`absolute ${alignmentStyles[align]} mt-2 min-w-[14rem] rounded-xl bg-slate-800 border border-slate-700 shadow-xl z-50 py-1.5 focus:outline-none transition-all duration-150 animate-in fade-in zoom-in-95 ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  danger?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  icon,
  danger = false,
  className = '',
  ...props
}) => {
  return (
    <button
      role="menuitem"
      type="button"
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
        danger
          ? 'text-rose-400 hover:bg-rose-950/40'
          : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 text-slate-400 group-hover:text-current">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
};

export const DropdownHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`px-3.5 py-2 border-b border-slate-700/70 text-xs text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownDivider: React.FC = () => {
  return <div className="my-1 border-t border-slate-700/70" />;
};

export default Dropdown;
