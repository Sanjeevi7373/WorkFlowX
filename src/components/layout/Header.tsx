import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, User as UserIcon, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  // Generate clean page title from path
  const getPageTitle = (path: string) => {
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    const segment = path.split('/').filter(Boolean).pop() || '';
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 text-slate-100">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-lg font-semibold text-white tracking-tight">
          {getPageTitle(location.pathname)}
        </h1>
        <p className="text-xs text-slate-400 font-mono">WorkFlowX / {location.pathname.replace(/^\//, '') || 'dashboard'}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Input Placeholder */}
        <div className="relative hidden md:block">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, team..."
            className="w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Notifications Button */}
        <Link
          to="/notifications"
          aria-label="View notifications"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 rounded-full" />
        </Link>

        {/* Auth link switch for easy navigation */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
          title="Go to Login page"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Sign In</span>
        </Link>

        {/* User Profile Avatar Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-indigo-400 flex items-center justify-center font-semibold text-xs">
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-white leading-none">Admin User</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">admin@workflowx.io</p>
          </div>
        </Link>
      </div>
    </header>
  );
};
