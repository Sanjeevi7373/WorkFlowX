
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '@/services/api';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing its token. Please request a new link.');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      setError('Password must contain between 8 and 72 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'The reset link is invalid or expired. Please request a new one.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
            <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Choose a new password for your WorkflowX account.
          </p>
        </div>

        {success ? (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-4"
          >
            <CheckCircle className="mb-2 h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <p className="font-semibold text-slate-900 dark:text-white">
              Password updated successfully
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              You can now sign in using your new password.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Go to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter a new password"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Use 8–72 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your new password"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-3 text-sm text-rose-700 dark:text-rose-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Updating password...' : 'Update password'}
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
