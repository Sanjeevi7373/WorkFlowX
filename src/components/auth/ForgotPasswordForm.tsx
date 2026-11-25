import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { AlertCircle } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter a valid email address.')
    .email('Please enter a valid email address.'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [requestError, setRequestError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setRequestError('');

    try {
      await api.post('/auth/forgot-password', {
        email: data.email.trim(),
      });

      setSubmittedEmail(data.email.trim());
      setIsSuccess(true);
    } catch {
      setRequestError(
        'We could not process your request. Please check your connection and try again.'
      );
    }
  };

  // Success view (Requirement 11)
  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center transition-colors">
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Check your email
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          If an account exists for <span className="font-semibold text-slate-700 dark:text-slate-200">{submittedEmail}</span>, password reset instructions have been sent.
        </p>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/login')}
            className="w-full py-2.5 text-sm font-semibold"
          >
            Back to Sign In
          </Button>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Didn&apos;t receive email? Try another address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-colors">
      {/* Header with mini logo */}
      <div className="text-left mb-6">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm">
          <Workflow className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Forgot your password?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your work email and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Work Email
          </label>
          <div className="relative">
            <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white placeholder-slate-400 ${
                errors.email
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>
              {requestError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700 dark:text-rose-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{requestError}</span>
        </div>
      )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full py-2.5 text-sm font-semibold"
          >
            {isSubmitting ? 'Sending instructions...' : 'Send Reset Link'}
          </Button>
        </div>
      </form>

      {/* Back to Login Link */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
