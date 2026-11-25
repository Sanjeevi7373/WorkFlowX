import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  UserRound,
  Bell,
  Building2,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import api from '@/services/api';

interface Preferences {
  theme: 'dark';
  emailNotifications: boolean;
  taskNotifications: boolean;
  projectNotifications: boolean;
  deadlineReminders: boolean;
  workspaceName: string;
  dateFormat: string;
}
const DEFAULTS: Preferences = {
  theme: 'dark',
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
  deadlineReminders: true,
  workspaceName: 'WorkFlowX',
  dateFormat: 'DD/MM/YYYY',
};

const STORAGE_KEY = 'workflowx_preferences';

export const SettingsPage: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULTS);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          ...DEFAULTS,
          ...parsed,
          theme: 'dark',
        });
      }
    } catch {
      // Keep defaults if stored preferences cannot be read.
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await api.get('/users/me');
        const user = response.data;

        if (active) {
          setProfile({
            name: user.name ?? user.fullName ?? '',
            email: user.email ?? '',
            role: user.role ?? '',
          });
        }
      } catch {
        if (active) {
          setProfileError(
            'Profile details could not be loaded from /api/users/me.'
          );
        }
      } finally {
        if (active) setLoadingProfile(false);
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
    setSaved(false);
  };

  const savePreferences = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setSaved(true);
    } catch {
      setSaved(false);
      window.alert('Could not save preferences in this browser.');
    }
  };

  const resetPreferences = () => {
    setPreferences(DEFAULTS);
    setSaved(false);
  };

  const toggleClass =
    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors';

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your account, notifications, and workspace preferences.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-800 p-5">
          <UserRound className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-white">Profile Information</h3>
            <p className="mt-1 text-sm text-slate-400">
              Account details from your WorkFlowX profile.
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-400">Name</p>
            <p className="mt-1 font-medium text-white">
              {loadingProfile ? 'Loading...' : profile.name || 'Not available'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-1 break-all font-medium text-white">
              {loadingProfile ? 'Loading...' : profile.email || 'Not available'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Role</p>
            <p className="mt-1 font-medium text-white">
              {loadingProfile ? 'Loading...' : profile.role || 'Not available'}
            </p>
          </div>

          {profileError && (
            <p className="text-sm text-amber-300 sm:col-span-2">
              {profileError}
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-800 p-5">
          <Bell className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-white">Notification Preferences</h3>
            <p className="mt-1 text-sm text-slate-400">
              Choose which notification categories you prefer.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800 px-5">
          {([
            ['emailNotifications', 'Email notifications', 'General email notification preference.'],
            ['taskNotifications', 'Task updates', 'Task assignments and status changes.'],
            ['projectNotifications', 'Project updates', 'Project progress and changes.'],
            ['deadlineReminders', 'Deadline reminders', 'Reminders for approaching deadlines.'],
          ] as const).map(([key, label, description]) => {
            const enabled = preferences[key];

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="mt-1 text-sm text-slate-400">{description}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={label}
                  onClick={() => updatePreference(key, !enabled)}
                  className={`${toggleClass} ${
                    enabled ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
        <p className="px-5 pb-5 text-xs text-slate-500">
          These are saved preferences only. They will not change server-side
          email delivery until the backend is wired to use them.
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-800 p-5">
          <Building2 className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-white">Workspace Preferences</h3>
            <p className="mt-1 text-sm text-slate-400">
              Customize workspace display settings.
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Workspace name
            <input
              value={preferences.workspaceName}
              onChange={(event) =>
                updatePreference('workspaceName', event.target.value)
              }
              maxLength={80}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Date format
            <select
              value={preferences.dateFormat}
              onChange={(event) =>
                updatePreference('dateFormat', event.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm">
          {saved ? (
            <span className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Preferences saved in this browser.
            </span>
          ) : (
            <span className="text-slate-400">
              Save your preference changes when you're ready.
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetPreferences}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={savePreferences}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500">
        <SettingsIcon className="mt-0.5 h-4 w-4 shrink-0" />
        Preferences are browser-local. Profile information is fetched from your
        authenticated backend account.
      </div>
    </div>
  );
};

export default SettingsPage;
