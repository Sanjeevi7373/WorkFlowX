import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  UserCheck,
  UserPlus,
  Search,
  RefreshCw,
  Mail,
  ShieldCheck,
  AlertCircle,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import api from '@/services/api';

interface AdminUser {
  id: number | string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email: string;
  role?: string | null;
  status?: string | null;
  department?: string | null;
  createdAt?: string | null;
}

const getUserName = (user: AdminUser): string => {
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return user.name || fullName || user.email || `User ${user.id}`;
};

const normalizeRole = (role?: string | null): string => {
  return (role || 'UNKNOWN').replace('ROLE_', '').toUpperCase();
};

const roleStyles = (role?: string | null): string => {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return 'border-violet-500/30 bg-violet-500/10 text-violet-300';
    case 'MANAGER':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
    case 'EMPLOYEE':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    default:
      return 'border-slate-600 bg-slate-700/40 text-slate-300';
  }
};

const statusStyles = (status?: string | null): string => {
  switch ((status || 'UNKNOWN').toUpperCase()) {
    case 'ACTIVE':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    case 'INACTIVE':
      return 'border-slate-600 bg-slate-700/40 text-slate-300';
    case 'PENDING':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    default:
      return 'border-slate-600 bg-slate-700/40 text-slate-300';
  }
};

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const response = await api.get<AdminUser[]>('/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load users:', err);

      const status = (
        err as { response?: { status?: number } }
      )?.response?.status;

      if (status === 403) {
        setError(
          'Access denied. Sign in with an Admin account to view all users.'
        );
      } else {
        setError(
          'Unable to load users. Check your backend connection and login permissions.'
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [
          getUserName(user),
          user.email || '',
          user.department || '',
          normalizeRole(user.role),
        ].some((value) => value.toLowerCase().includes(query));

      const matchesRole =
        roleFilter === 'ALL' ||
        normalizeRole(user.role) === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter(
    (user) => normalizeRole(user.role) === 'ADMIN'
  ).length;

  const managerCount = users.filter(
    (user) => normalizeRole(user.role) === 'MANAGER'
  ).length;

  const employeeCount = users.filter(
    (user) => normalizeRole(user.role) === 'EMPLOYEE'
  ).length;

  return (
    <div className="space-y-6 text-slate-100">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            User Management
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            View employee accounts, roles, departments, and account information.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          disabled
          className="gap-2"
          title="User creation must be enabled in the backend first"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Users"
          value={loading ? '—' : users.length}
          icon={<Users className="h-5 w-5 text-indigo-400" />}
        />
        <SummaryCard
          label="Administrators"
          value={loading ? '—' : adminCount}
          icon={<ShieldCheck className="h-5 w-5 text-violet-400" />}
        />
        <SummaryCard
          label="Managers"
          value={loading ? '—' : managerCount}
          icon={<UserCheck className="h-5 w-5 text-blue-400" />}
        />
        <SummaryCard
          label="Employees"
          value={loading ? '—' : employeeCount}
          icon={<Users className="h-5 w-5 text-emerald-400" />}
        />
      </div>

      {/* User directory */}
      <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60">
        <div className="flex flex-col gap-4 border-b border-slate-700 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-2">
              <UserCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Enterprise Users</h3>
              <p className="mt-1 text-xs text-slate-400">
                User records loaded from the backend.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users..."
                aria-label="Search users"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-60"
              />
            </div>

            <select
              aria-label="Filter users by role"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>

            <Button
              type="button"
              variant="outline"
              onClick={() => void fetchUsers(true)}
              disabled={loading || refreshing}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-400">
            <RefreshCw className="h-5 w-5 animate-spin text-indigo-400" />
            Loading users...
          </div>
        ) : error && users.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-5 text-center">
            <AlertCircle className="h-8 w-8 text-rose-400" />
            <p className="max-w-lg text-sm text-rose-300">{error}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void fetchUsers()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-5 text-center">
            <Users className="h-9 w-9 text-slate-600" />
            <p className="font-medium text-slate-200">
              {search || roleFilter !== 'ALL'
                ? 'No matching users found'
                : 'No users found'}
            </p>
            <p className="text-sm text-slate-400">
              Change your search or role filter and try again.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-800/70 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-medium">User</th>
                  <th className="px-5 py-4 font-medium">Department</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700/80">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-indigo-300">
                          {getUserName(user).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {getUserName(user)}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail className="h-3.5 w-3.5" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {user.department || 'Not specified'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${roleStyles(user.role)}`}
                      >
                        {normalizeRole(user.role)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles(user.status)}`}
                      >
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="border-t border-slate-700 px-5 py-3 text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </section>
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="rounded-xl bg-slate-800 p-3">{icon}</div>
    </div>
  </div>
);

export default AdminUsersPage;