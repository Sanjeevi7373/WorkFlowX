import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  UsersRound,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Building2,
  UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import api from '@/services/api';

interface TeamManager {
  id: number | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface Team {
  id: number | string;
  name: string;
  description?: string | null;
  status?: string | null;
  manager?: TeamManager | null;
}

interface UserOption {
  id: number | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface TeamForm {
  name: string;
  description: string;
  status: string;
  managerId: string;
}

const emptyForm: TeamForm = {
  name: '',
  description: '',
  status: 'ACTIVE',
  managerId: '',
};

const managerName = (manager?: TeamManager | null) => {
  if (!manager) return 'Not assigned';

  return (
    manager.name ||
    [manager.firstName, manager.lastName].filter(Boolean).join(' ') ||
    manager.email ||
    'Not assigned'
  );
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as {
    response?: {
      data?: string | { message?: string; error?: string };
    };
  };

  const data = err.response?.data;

  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  return fallback;
};

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [form, setForm] = useState<TeamForm>(emptyForm);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const [teamResponse, userResponse] = await Promise.all([
        api.get<Team[]>('/teams'),
        api.get<UserOption[]>('/users'),
      ]);

      setTeams(
        Array.isArray(teamResponse.data) ? teamResponse.data : []
      );
      setUsers(
        Array.isArray(userResponse.data) ? userResponse.data : []
      );
    } catch (err) {
      console.error('Failed to load team management data:', err);
      setError(
        getErrorMessage(
          err,
          'Unable to load teams or users. Check your permissions and backend.'
        )
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return teams;

    return teams.filter((team) =>
      [
        team.name,
        team.description || '',
        team.status || '',
        managerName(team.manager),
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [teams, search]);

  const openCreateModal = () => {
    setEditingTeam(null);
    setForm(emptyForm);
    setError('');
    setNotice('');
    setModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setForm({
      name: team.name || '',
      description: team.description || '',
      status: team.status || 'ACTIVE',
      managerId: team.manager?.id != null
        ? String(team.manager.id)
        : '',
    });
    setError('');
    setNotice('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingTeam(null);
    setForm(emptyForm);
  };

  const updateForm = (field: keyof TeamForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (name.length < 2) {
      setError('Team name must contain at least 2 characters.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name,
      description,
      status: form.status,
      manager: form.managerId
        ? { id: Number(form.managerId) }
        : null,
    };

    try {
      if (editingTeam) {
        await api.put(`/teams/${editingTeam.id}`, payload);
        setNotice('Team updated successfully.');
      } else {
        await api.post('/teams', payload);
        setNotice('Team created successfully.');
      }

      setModalOpen(false);
      setEditingTeam(null);
      setForm(emptyForm);

      await fetchData(true);
    } catch (err) {
      console.error('Failed to save team:', err);
      setError(
        getErrorMessage(
          err,
          'Unable to save this team. Please check the backend and try again.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (team: Team) => {
    const confirmed = window.confirm(
      `Delete the team "${team.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(String(team.id));
    setError('');
    setNotice('');

    try {
      await api.delete(`/teams/${team.id}`);
      setTeams((current) =>
        current.filter((item) => String(item.id) !== String(team.id))
      );
      setNotice(`Team "${team.name}" deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete team:', err);
      setError(
        getErrorMessage(
          err,
          'Unable to delete this team. It may be referenced by existing projects.'
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  const managerOptions = users.filter((user) => {
    const role = String(user.role || '')
      .replace('ROLE_', '')
      .toUpperCase();

    return role === 'ADMIN' || role === 'MANAGER';
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Teams &amp; Departments
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Create teams, assign managers, and manage organizational units.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={openCreateModal}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </div>

      {/* Feedback */}
      {notice && (
        <div
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          {notice}
        </div>
      )}

      {error && !modalOpen && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                {loading
                  ? '—'
                  : teams.filter(
                      (team) =>
                        (team.status || '').toUpperCase() === 'ACTIVE'
                    ).length}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Building2 className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Team table */}
      <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60">
        <div className="flex flex-col gap-4 border-b border-slate-700 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="font-semibold text-white">
                Departments Structure
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Team records from your backend database.
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
              onClick={() => void fetchData(true)}
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

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-400">
              <RefreshCw className="h-5 w-5 animate-spin text-indigo-400" />
              Loading teams...
            </div>
          ) : error && teams.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-5 text-center">
              <AlertCircle className="h-8 w-8 text-rose-400" />
              <p className="max-w-lg text-sm text-rose-300">{error}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void fetchData()}
              >
                Try Again
              </Button>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-5 text-center">
              <UsersRound className="h-9 w-9 text-slate-600" />
              <p className="font-medium text-slate-200">
                {search ? 'No matching teams found' : 'No teams created yet'}
              </p>
              <p className="text-sm text-slate-400">
                {search
                  ? 'Try a different search term.'
                  : 'Select Create Team to add your first team.'}
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-800/70 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Team</th>
                  <th className="px-5 py-4 font-medium">Manager</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700/80">
                {filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="transition-colors hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-500/10 p-2">
                          <Building2 className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{team.name}</p>
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {team.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <UserRound className="h-4 w-4 text-slate-500" />
                        <span>{managerName(team.manager)}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                          (team.status || '').toUpperCase() === 'ACTIVE'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : 'border-slate-600 bg-slate-700/40 text-slate-300'
                        }`}
                      >
                        {team.status || 'Unknown'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(team)}
                          aria-label={`Edit ${team.name}`}
                          title="Edit team"
                          className="rounded-lg border border-slate-700 p-2 text-slate-300 transition-colors hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(team)}
                          disabled={deletingId === String(team.id)}
                          aria-label={`Delete ${team.name}`}
                          title="Delete team"
                          className="rounded-lg border border-slate-700 p-2 text-slate-300 transition-colors hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
                        >
                          {deletingId === String(team.id) ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && !error && teams.length > 0 && (
          <div className="border-t border-slate-700 px-5 py-3 text-xs text-slate-500">
            Showing {filteredTeams.length} of {teams.length} teams
          </div>
        )}
      </section>

      {/* Create/Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
            className="my-8 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">
              <div>
                <h3
                  id="team-modal-title"
                  className="text-lg font-bold text-white"
                >
                  {editingTeam ? 'Edit Team' : 'Create Team'}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Enter the team information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="team-name"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Team Name *
                </label>
                <input
                  id="team-name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                  placeholder="e.g. Development Team"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="team-description"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Description
                </label>
                <textarea
                  id="team-description"
                  rows={3}
                  maxLength={1000}
                  value={form.description}
                  onChange={(event) =>
                    updateForm('description', event.target.value)
                  }
                  placeholder="Describe this team's responsibilities..."
                  className="w-full resize-y rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="team-manager"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Team Manager
                </label>
                <select
                  id="team-manager"
                  value={form.managerId}
                  onChange={(event) =>
                    updateForm('managerId', event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="">No manager assigned</option>
                  {managerOptions.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.name ||
                        [user.firstName, user.lastName]
                          .filter(Boolean)
                          .join(' ') ||
                        user.email ||
                        `User ${user.id}`}
                    </option>
                  ))}
                </select>

                {managerOptions.length === 0 && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    No admin or manager users were returned by the users API.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="team-status"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Status
                </label>
                <select
                  id="team-status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm('status', event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-700 pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  className="gap-2"
                >
                  {saving && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                  {saving
                    ? 'Saving...'
                    : editingTeam
                      ? 'Save Changes'
                      : 'Create Team'}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminTeamsPage;