
import React, { useCallback, useEffect, useState } from 'react';
import {
  User,
  Shield,
  Mail,
  Building2,
  BriefcaseBusiness,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  Pencil,
  Save,
  X,
  CheckCircle,
} from 'lucide-react';
import api from '@/services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';

interface UserProfile {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  department?: string;
  createdAt?: string;
  status?: string;
}

interface ProfileForm {
  firstName: string;
  lastName: string;
  department: string;
}

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    department: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/users/me');
      const data: UserProfile = response.data;

      setProfile(data);
      setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        department: data.department || '',
      });
    } catch (err: any) {
      setError(
        err?.response?.status === 401
          ? 'Your session has expired. Please log in again.'
          : err?.response?.status === 403
            ? 'You do not have permission to view this profile.'
            : 'Unable to load your profile. Check that the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
      profile.email ||
      'User'
    : 'User';

  const initials =
    displayName
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'U';

  const role = profile?.role?.replace(/^ROLE_/, '') || 'USER';

  const formatDate = (value?: string) => {
    if (!value) return 'Not available';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString();
  };

  const handleEdit = () => {
    if (!profile) return;

    setForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      department: profile.department || '',
    });
    setError('');
    setSuccess('');
    setEditing(true);
  };

  const handleCancel = () => {
    setForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      department: profile?.department || '',
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }

    setSaving(true);

    try {
      const response = await api.put('/users/me', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        department: form.department.trim(),
      });

      setProfile(response.data);
      setForm({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        department: response.data.department || '',
      });
      setEditing(false);
      setSuccess('Profile updated successfully.');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (err?.response?.status === 401
            ? 'Your session has expired. Please log in again.'
            : err?.response?.status === 403
              ? 'You do not have permission to update this profile.'
              : 'Unable to save your profile. Please try again.')
      );
    } finally {
      setSaving(false);
    }
  };

  const detailRows = [
    { label: 'Email Address', value: profile?.email || 'Not available', icon: Mail },
    { label: 'Role', value: role, icon: Shield },
    { label: 'Department', value: profile?.department || 'Not assigned', icon: Building2 },
    { label: 'Job Title', value: 'Not configured', icon: BriefcaseBusiness },
    { label: 'Account Created', value: formatDate(profile?.createdAt), icon: CalendarDays },
  ];

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Profile
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            View and manage your personal information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadProfile()}
            disabled={loading || saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {!editing && (
            <button
              type="button"
              onClick={handleEdit}
              disabled={loading || !profile}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-300">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-indigo-300 bg-indigo-100 text-2xl font-bold text-indigo-700">
              {loading ? '…' : initials}
            </div>

            <h3 className="mt-4 break-words text-lg font-semibold text-white">
              {loading ? 'Loading profile…' : displayName}
            </h3>

            <p className="mt-1 break-all text-sm text-slate-400">
              {profile?.email || (loading ? '' : 'Email unavailable')}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              <Shield className="h-3.5 w-3.5" />
              {loading ? 'Loading role…' : role}
            </div>

            {profile?.status && (
              <p className="mt-4 text-xs text-slate-400">
                Account status: {profile.status}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" />
              <CardTitle>Account Details</CardTitle>
            </div>
            <CardDescription>
              {editing
                ? 'Update your name and department.'
                : 'Your authenticated account information.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-sm text-slate-400">
                Loading account details…
              </p>
            ) : !profile ? (
              <p className="py-8 text-center text-sm text-slate-400">
                Profile details are unavailable. Refresh to try again.
              </p>
            ) : editing ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="text-sm font-medium text-slate-300">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      required
                      maxLength={100}
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="text-sm font-medium text-slate-300">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      required
                      maxLength={100}
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="department" className="text-sm font-medium text-slate-300">
                      Department
                    </label>
                    <input
                      id="department"
                      name="department"
                      maxLength={100}
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className={inputClass}
                      placeholder="Enter your department"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Email, role, and account status cannot be changed here.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <User className="h-4 w-4 shrink-0 text-indigo-400" />
                    <span className="text-xs font-medium">Full Name</span>
                  </div>
                  <p className="mt-2 break-words text-sm font-medium text-slate-100">
                    {displayName}
                  </p>
                </div>

                {detailRows.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <div className="flex items-center gap-2 text-slate-400">
                      <Icon className="h-4 w-4 shrink-0 text-indigo-400" />
                      <span className="text-xs font-medium">{label}</span>
                    </div>
                    <p className="mt-2 break-words text-sm font-medium text-slate-100">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
