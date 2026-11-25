import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isOpen,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      bg: 'bg-slate-900',
      text: 'text-white',
      iconColor: 'text-emerald-400',
      badge: 'bg-emerald-950/60',
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-500/30',
      bg: 'bg-slate-900',
      text: 'text-white',
      iconColor: 'text-rose-400',
      badge: 'bg-rose-950/60',
    },
    info: {
      icon: Info,
      border: 'border-indigo-500/30',
      bg: 'bg-slate-900',
      text: 'text-white',
      iconColor: 'text-indigo-400',
      badge: 'bg-indigo-950/60',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
      style={{
        backgroundColor: 'var(--toast-bg, inherit)',
      }}
    >
      <div className={`p-1.5 rounded-lg shrink-0 ${config.badge} ${config.iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <p className={`text-sm font-semibold tracking-tight ${config.text}`}>
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
