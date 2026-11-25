import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  UsersRound,
  UserRound,
  AlertCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import api from '@/services/api';

interface TeamManager {
  id?: number | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
}

interface Team {
  id: number | string;
  name: string;
  description?: string | null;
  status?: string | null;
  manager?: TeamManager | null;
  createdAt?: string;
  updatedAt?: string;
}

const getManagerName = (manager?: TeamManager | null): string => {
  if (!manager) return 'No manager assigned';

  const fullName = [manager.firstName, manager.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return manager.name || fullName || manager.email || 'No manager assigned';
};

const getStatusStyles = (status?: string | null) => {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVE':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'INACTIVE':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    case 'COMPLETED':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }
};

export const TeamPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchTeams = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const response = await api.get<Team[]>('/teams');
      const data = Array.isArray(response.data) ? response.data : [];
      setTeams(data);
    } catch (err) {
      console.error('Failed to load teams:', err);
      setError(
        'Unable to load teams. Check your login permissions and make sure the backend is running.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return teams;

    return teams.filter((team) => {
      const managerName = getManagerName(team.manager);

      return [
        team.name,
        team.description || '',
        team.status || '',
        managerName,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [teams, search]);

  const activeTeams = teams.filter(
    (team) => (team.status || '').toUpperCase() === 'ACTIVE'
  ).length;

  return (
    <div className="space-y-6 text-slate-100">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Directory</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage team information, managers, and team status.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          disabled
          className="gap-2"
          title="Team member invitations are not implemented yet"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Member</span>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Teams</p>
              <p className="mt-2 text-3xl font-bold">
                {loading ? '—' : teams.length}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-500/10 p-3">
              <UsersRound className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Teams</p>
              <p className="mt-2 text-3xl font-bold">
                {loading ? '—' : activeTeams}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Directory */}
      <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60">
        <div className="flex flex-col gap-4 border-b border-slate-700 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-2">
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Team Directory</h3>
              <p className="mt-1 text-xs text-slate-400">
                Team information loaded from the backend.
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
                placeholder="Search teams..."
                aria-label="Search teams"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-56"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => void fetchTeams(true)}
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

        <div className="p-5">
          {loading ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="h-7 w-7 animate-spin text-indigo-400" />
              <p className="text-sm">Loading teams...</p>
            </div>
          ) : error ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
              <AlertCircle className="h-8 w-8 text-rose-400" />
              <p className="max-w-md text-sm text-rose-300">{error}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void fetchTeams()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
              <UsersRound className="h-10 w-10 text-slate-600" />
              <h4 className="font-semibold text-slate-200">
                {search ? 'No matching teams' : 'No teams found'}
              </h4>
              <p className="max-w-sm text-sm text-slate-400">
                {search
                  ? 'Try another search term.'
                  : 'Create a team in your backend to see it listed here.'}
              </p>
              {search && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSearch('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredTeams.map((team) => (
                <article
                  key={team.id}
                  className="rounded-xl border border-slate-700 bg-slate-800/50 p-5 transition-colors hover:border-indigo-500/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                        <Building2 className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-semibold text-white">
                          {team.name}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400">
                          Team ID: {team.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(team.status)}`}
                    >
                      {team.status || 'Status unknown'}
                    </span>
                  </div>

                  <p className="mt-4 min-h-10 text-sm leading-5 text-slate-400">
                    {team.description || 'No description provided.'}
                  </p>

                  <div className="mt-4 flex items-center gap-3 border-t border-slate-700 pt-4">
                    <div className="rounded-full bg-slate-700 p-2">
                      <UserRound className="h-4 w-4 text-slate-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Team Manager</p>
                      <p className="truncate text-sm font-medium text-slate-200">
                        {getManagerName(team.manager)}
                      </p>
                      {team.manager?.email && (
                        <p className="truncate text-xs text-slate-400">
                          {team.manager.email}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && teams.length > 0 && (
            <p className="mt-5 text-xs text-slate-500">
              Showing {filteredTeams.length} of {teams.length} teams
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamPage;