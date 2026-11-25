
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  CalendarDays,
  BarChart3,
  Bell,
  UserCog,
  UsersRound,
  ClipboardList,
  Settings,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { useAuth } from '@/hooks/useAuth';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const mainNavItems: NavItemConfig[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Calendar', path: '/calendar', icon: CalendarDays },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
];

const workspaceNavItems: NavItemConfig[] = [
  { name: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
];

const managementNavItems: NavItemConfig[] = [
  { name: 'Users', path: '/admin/users', icon: UserCog },
  { name: 'Teams', path: '/admin/teams', icon: UsersRound },
  { name: 'Audit Logs', path: '/admin/audit-logs', icon: ClipboardList },
];

const bottomNavItems: NavItemConfig[] = [
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Profile', path: '/profile', icon: UserCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onCloseMobile();
    navigate('/login');
  };

  const renderNavLink = (item: NavItemConfig) => {
    const linkContent = (
      <NavLink
        to={item.path}
        onClick={onCloseMobile}
        className={({ isActive }) =>
          `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 outline-none select-none ${
            isCollapsed ? 'justify-center' : ''
          } ${
            isActive
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 focus-visible:ring-2 focus-visible:ring-indigo-500'
          }`
        }
      >
        <item.icon className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105" />

        {!isCollapsed && (
          <span className="flex-1 truncate tracking-normal">{item.name}</span>
        )}

        {!isCollapsed && item.badge && (
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-500">
            {item.badge}
          </span>
        )}
      </NavLink>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.path} content={item.name} position="right">
          {linkContent}
        </Tooltip>
      );
    }

    return <div key={item.path}>{linkContent}</div>;
  };

  return (
    <>
      {isMobileOpen && (
        <div
          role="presentation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex shrink-0 select-none flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-[width,transform,background-color,border-color] duration-200 ease-in-out lg:static ${
          isMobileOpen
            ? 'pointer-events-auto translate-x-0'
            : '-translate-x-full pointer-events-none lg:pointer-events-auto lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
          <div className="flex items-center gap-3 overflow-hidden">

            <div className="flex min-w-0 flex-1 items-center overflow-hidden">
              <NavLink
                to="/dashboard"
                onClick={onCloseMobile}
                aria-label="WorkflowX home"
                className="flex min-w-0 items-center"
              >
                <img
                  src="/workflowx-logo.png"
                  alt="WorkflowX"
                  className={`object-contain object-left ${
                    isCollapsed ? 'h-9 w-9' : 'h-10 w-full'
                  }`}
                />
              </NavLink>
            </div>


            {!isCollapsed && (
              <div className="shrink-0">
                <p className="text-[10px] font-medium text-slate-400">
                  Work Management
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-3 py-4">
          {[
            { title: 'Main', items: mainNavItems },
            { title: 'Workspace', items: workspaceNavItems },
            { title: 'Management', items: managementNavItems },
            { title: 'Bottom', items: bottomNavItems },
          ].map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
              )}
              <nav className="space-y-1">
                {section.items.map(renderNavLink)}

                {section.title === 'Bottom' &&
                  (isCollapsed ? (
                    <Tooltip content="Logout" position="right">
                      <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
                      >
                        <LogOut className="h-4.5 w-4.5 shrink-0" />
                      </button>
                    </Tooltip>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4.5 w-4.5 shrink-0" />
                      <span className="truncate">Logout</span>
                    </button>
                  ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="hidden shrink-0 items-center justify-between border-t border-slate-800/80 bg-slate-900/50 p-3 lg:flex">
          {!isCollapsed && (
            <div className="px-2 text-[11px] font-medium text-slate-400">
              Collapse sidebar
            </div>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
