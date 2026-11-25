
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  RefreshCw,
  Search,
  CheckCheck,
  Circle,
  Clock,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import api from '@/services/api';

interface NotificationItem {
  id: number | string;
  title?: string;
  message?: string;
  content?: string;
  description?: string;
  type?: string;
  status?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  timestamp?: string;
}

const getMessage = (item: NotificationItem) =>
  item.message ?? item.content ?? item.description ?? '';

const isUnread = (item: NotificationItem) => {
  if (typeof item.read === 'boolean') return !item.read;
  if (typeof item.isRead === 'boolean') return !item.isRead;

  const status = (item.status ?? '').toUpperCase();
  return ['UNREAD', 'NEW'].includes(status);
};

const getDate = (item: NotificationItem) =>
  item.createdAt ?? item.timestamp ?? '';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/notifications');
      const data = response.data;

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.notifications)
            ? data.notifications
            : null;

      if (!items) {
        setNotifications([]);
        setError(
          'The notifications API did not return a list. Check the backend response format.'
        );
        return;
      }

      setNotifications(items);
    } catch (err: any) {
      setError(
        err?.response?.status === 403
          ? 'You do not have permission to view these notifications.'
          : err?.response?.status === 401
            ? 'Your session may have expired. Please log in again.'
            : 'Could not load notifications. Check that the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(isUnread).length;

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesSearch = [
        item.title ?? '',
        getMessage(item),
        item.type ?? '',
        item.status ?? '',
      ].some((value) => value.toLowerCase().includes(query));

      const matchesFilter =
        filter === 'ALL' ||
        (filter === 'UNREAD' && isUnread(item)) ||
        (filter === 'READ' && !isUnread(item));

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Review system alerts, task assignments, and project updates.
          </p>
        </div>

        <button
          onClick={() => void fetchNotifications()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Notifications</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Unread</p>
          <p className="mt-2 text-3xl font-bold text-indigo-400">
            {unreadCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Read</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {notifications.length - unreadCount}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-400" />
            <h3 className="font-semibold text-white">All Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Notifications loaded from your protected /api/notifications endpoint.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="ALL">All notifications</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
            </select>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <Inbox className="mx-auto h-10 w-10 text-slate-600" />
              <p className="mt-3 font-medium text-slate-200">
                {notifications.length === 0
                  ? 'No notifications found'
                  : 'No matching notifications'}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {notifications.length === 0
                  ? 'New system notifications will appear here when available.'
                  : 'Try another search term or filter.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredNotifications.map((item) => {
                const unread = isUnread(item);
                const message = getMessage(item);
                const date = getDate(item);

                return (
                  <article
                    key={item.id}
                    className={`flex gap-3 rounded-lg px-3 py-4 ${
                      unread ? 'bg-indigo-500/5' : ''
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      {unread ? (
                        <Circle className="h-3 w-3 fill-indigo-400 text-indigo-400" />
                      ) : (
                        <CheckCheck className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium text-white">
                          {item.title ?? item.type ?? 'Notification'}
                        </h4>
                        {unread && (
                          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-300">
                            Unread
                          </span>
                        )}
                        {item.type && (
                          <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
                            {item.type}
                          </span>
                        )}
                      </div>

                      {message && (
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">
                          {message}
                        </p>
                      )}

                      {date && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {Number.isNaN(new Date(date).getTime())
                            ? date
                            : new Date(date).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && filteredNotifications.length > 0 && (
            <p className="text-xs text-slate-500">
              Showing {filteredNotifications.length} of {notifications.length} notifications.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default NotificationsPage;
