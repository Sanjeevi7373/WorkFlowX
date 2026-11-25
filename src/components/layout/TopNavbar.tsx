
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu, Search, Bell, CheckCircle2, Clock, AlertCircle,
  FileCheck, ChevronDown, User, Settings, LogOut, X,
  CalendarDays, FolderKanban, Users, BarChart3, LoaderCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import {
  Dropdown, DropdownItem, DropdownHeader, DropdownDivider,
} from '@/components/ui/Dropdown';
import { IconButton } from '@/components/ui/IconButton';
import { getPageMeta } from '@/utils/pageTitles';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

export interface TopNavbarProps {
  onOpenMobileSidebar: () => void;
}

interface NotificationItem {
  id: string | number;
  title: string;
  timestamp: string;
  isUnread: boolean;
  icon: LucideIcon;
  iconColor: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  department?: string;
}

const pages = [
  { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { title: 'Projects', path: '/projects', icon: FolderKanban },
  { title: 'Tasks', path: '/tasks', icon: CheckCircle2 },
  { title: 'Teams', path: '/teams', icon: Users },
  { title: 'Calendar', path: '/calendar', icon: CalendarDays },
  { title: 'Notifications', path: '/notifications', icon: Bell },
  { title: 'Reports', path: '/reports', icon: BarChart3 },
  { title: 'Profile', path: '/profile', icon: User },
  { title: 'Settings', path: '/settings', icon: Settings },
];

const formatTimestamp = (value?: string) => {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString();
};

const mapNotification = (item: any, index: number): NotificationItem => {
  const title =
    item.title ??
    item.message ??
    item.content ??
    item.description ??
    'New notification';

  const text = String(title).toLowerCase();
  let icon = Bell;
  let iconColor = 'text-indigo-600 bg-indigo-50';

  if (text.includes('task') || text.includes('assign')) {
    icon = Clock;
    iconColor = 'text-indigo-600 bg-indigo-50';
  } else if (text.includes('due') || text.includes('overdue')) {
    icon = AlertCircle;
    iconColor = 'text-amber-600 bg-amber-50';
  } else if (text.includes('project') || text.includes('deadline')) {
    icon = FileCheck;
    iconColor = 'text-blue-600 bg-blue-50';
  } else if (text.includes('complete') || text.includes('success')) {
    icon = CheckCircle2;
    iconColor = 'text-emerald-600 bg-emerald-50';
  }

  const unreadValue = item.isRead ?? item.read;
  const isUnread =
    item.isUnread !== undefined
      ? Boolean(item.isUnread)
      : unreadValue !== undefined
        ? !Boolean(unreadValue)
        : false;

  return {
    id: item.id ?? index,
    title: String(title),
    timestamp: formatTimestamp(
      item.createdAt ?? item.timestamp ?? item.date
    ),
    isUnread,
    icon,
    iconColor,
  };
};

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenMobileSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const meta = getPageMeta(location.pathname);

  const colors = {
    header: 'bg-slate-900 border-slate-800',
    text: 'text-slate-200',
    muted: 'text-slate-400',
    heading: 'text-white',
    hover: 'hover:bg-slate-800 hover:text-white',
    input: 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400',
    divider: 'border-slate-700',
    panel: 'bg-slate-900 border-slate-700',
    result: 'bg-slate-900 border-slate-700 hover:bg-slate-800',
  };

  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
      profile.email ||
      'User'
    : 'Loading profile…';

  const unreadCount = notifications.filter((item) => item.isUnread).length;

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return pages
      .filter((page) => page.title.toLowerCase().includes(query))
      .slice(0, 6);
  }, [searchQuery]);

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationError('');

    try {
      const response = await api.get('/notifications');
      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.notifications)
            ? data.notifications
            : [];

      setNotifications(list.map(mapNotification));
    } catch {
      setNotificationError('Unable to load notifications.');
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();

    api.get('/users/me')
      .then((response) => setProfile(response.data))
      .catch(() => setProfile(null));
  }, [loadNotifications]);

  useEffect(() => {
    setSearchQuery('');
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderSearch = (mobile = false) => (
    <div className={`relative ${mobile ? 'flex-1' : 'w-56 lg:w-72'}`}>
      <Search className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${colors.muted}`} />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setSearchQuery('');
          if (event.key === 'Enter' && filteredPages.length > 0) {
            navigate(filteredPages[0].path);
          }
        }}
        placeholder="Search pages..."
        aria-label="Search WorkflowX pages"
        aria-expanded={Boolean(searchQuery.trim())}
        className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs outline-none transition-colors focus:border-indigo-500 ${colors.input}`}
      />

      {searchQuery.trim() && (
        <div className={`absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border shadow-xl ${colors.panel}`}>
          <div className={`border-b px-3 py-2 text-xs ${colors.muted} ${colors.divider}`}>
            Search pages
          </div>

          {filteredPages.length > 0 ? (
            filteredPages.map((page) => {
              const PageIcon = page.icon;
              return (
                <button
                  type="button"
                  key={page.path}
                  onClick={() => {
                    navigate(page.path);
                    setSearchQuery('');
                    setIsMobileSearchOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left text-sm ${colors.text} ${colors.hover}`}
                >
                  <PageIcon className="h-4 w-4 text-indigo-400" />
                  <span>{page.title}</span>
                </button>
              );
            })
          ) : (
            <p className={`px-3 py-4 text-sm ${colors.muted}`}>
              No matching pages found.
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className={`relative z-20 flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6 ${colors.header}`}>
      <div className="flex min-w-0 items-center gap-3">
        <IconButton
          icon={<Menu className="h-5 w-5" />}
          label="Open navigation"
          onClick={onOpenMobileSidebar}
          className={`lg:hidden ${colors.text}`}
        />

        <div className="min-w-0">
          <div className={`flex items-center gap-1.5 truncate text-[11px] font-medium ${colors.muted}`}>
            {meta.breadcrumb.map((crumb, index) => (
              <React.Fragment key={`${crumb}-${index}`}>
                {index > 0 && <span>/</span>}
                <span className={index === meta.breadcrumb.length - 1 ? `font-semibold ${colors.text}` : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
          <h1 className={`truncate text-lg font-bold leading-tight tracking-tight ${colors.heading}`}>
            {meta.title}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          {renderSearch()}
        </div>

        <IconButton
          icon={<Search className="h-4.5 w-4.5" />}
          label="Search"
          onClick={() => setIsMobileSearchOpen((open) => !open)}
          className={`md:hidden ${colors.text}`}
        />

        <Dropdown
          align="right"
          className={`w-80 p-0 shadow-2xl sm:w-96 ${colors.panel}`}
          trigger={
            <button
              type="button"
              aria-label={`Open notifications, ${unreadCount} unread`}
              onClick={() => void loadNotifications()}
              className={`relative rounded-lg p-2 transition-colors ${colors.text} ${colors.hover}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          }
        >
          <div className={`flex items-center justify-between border-b px-4 py-3 ${colors.divider}`}>
            <span className={`text-sm font-semibold ${colors.heading}`}>Notifications</span>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600">
              {unreadCount} New
            </span>
          </div>

          <div className={`max-h-72 divide-y overflow-y-auto ${colors.divider}`}>
            {notificationsLoading ? (
              <div className={`flex items-center justify-center gap-2 p-6 text-sm ${colors.muted}`}>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading notifications…
              </div>
            ) : notificationError ? (
              <div className="p-4 text-center">
                <p className="text-sm text-red-400">{notificationError}</p>
                <button
                  type="button"
                  onClick={() => void loadNotifications()}
                  className="mt-2 text-xs font-semibold text-indigo-400"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <p className={`p-6 text-center text-sm ${colors.muted}`}>
                You have no notifications.
              </p>
            ) : (
              notifications.slice(0, 6).map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3.5 transition-colors ${
                      item.isUnread
                        ? 'bg-indigo-950/20 hover:bg-slate-800'
                        : colors.hover
                    }`}
                  >
                    <div className={`shrink-0 rounded-lg p-2 ${item.iconColor}`}>
                      <ItemIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`line-clamp-2 text-xs font-medium leading-relaxed ${colors.text}`}>
                        {item.title}
                      </p>
                      <p className={`mt-1 text-[10px] ${colors.muted}`}>
                        {item.timestamp}
                      </p>
                    </div>
                    {item.isUnread && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className={`border-t p-2 text-center ${colors.divider}`}>
            <Link
              to="/notifications"
              className="block py-1.5 text-xs font-semibold text-indigo-500 transition-colors hover:text-indigo-400"
            >
              View all notifications →
            </Link>
          </div>
        </Dropdown>

        <Dropdown
          align="right"
          className={`w-60 shadow-2xl ${colors.panel}`}
          trigger={
            <button
              type="button"
              aria-label="Open user menu"
              className={`flex select-none items-center gap-2.5 rounded-lg p-1 transition-colors ${colors.hover}`}
            >
              <Avatar name={profile ? displayName : 'User'} size="sm" status="online" />
              <div className="hidden text-left sm:block">
                <p className={`text-xs font-semibold leading-tight ${colors.text}`}>
                  {displayName}
                </p>
                <p className={`text-[10px] leading-tight ${colors.muted}`}>
                  {profile?.role?.replace(/^ROLE_/, '') || 'WorkflowX Member'}
                </p>
              </div>
              <ChevronDown className={`hidden h-3.5 w-3.5 sm:block ${colors.muted}`} />
            </button>
          }
        >
          <DropdownHeader>
            <p className={`font-semibold ${colors.heading}`}>{displayName}</p>
            <p className={`truncate text-[11px] ${colors.muted}`}>
              {profile?.email || 'Email unavailable'}
            </p>
            {profile?.department && (
              <p className={`mt-1 text-[11px] ${colors.muted}`}>
                {profile.department}
              </p>
            )}
          </DropdownHeader>

          <div className="py-1">
            <DropdownItem icon={<User className="h-4 w-4" />} onClick={() => navigate('/profile')}>
              Profile
            </DropdownItem>
            <DropdownItem icon={<Settings className="h-4 w-4" />} onClick={() => navigate('/settings')}>
              Settings
            </DropdownItem>
          </div>

          <DropdownDivider />

          <div className="py-1">
            <DropdownItem danger icon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
              Logout
            </DropdownItem>
          </div>
        </Dropdown>
      </div>

      {isMobileSearchOpen && (
        <div className={`absolute left-0 right-0 top-16 z-50 flex items-start gap-2 border-b p-3 shadow-md md:hidden ${colors.header}`}>
          {renderSearch(true)}
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(false);
              setSearchQuery('');
            }}
            aria-label="Close search"
            className={`rounded-md p-1.5 ${colors.muted} ${colors.hover}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
};

export default TopNavbar;
