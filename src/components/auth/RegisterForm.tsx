import React, { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

// Zod validation schema for registration
const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Please enter your full name.'),
    email: z
      .string()
      .min(1, 'Please enter a valid email address.')
      .email('Please enter a valid email address.'),
    companyName: z.string().min(2, 'Please enter your company or organization name.'),
    role: z.enum(['EMPLOYEE', 'MANAGER', 'ADMIN'] as const),
    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      role: 'EMPLOYEE',
      password: '',
      confirmPassword: '',
      agreeTerms: false as unknown as true,
    },
  });

  const passwordValue = useWatch({ control, name: 'password' }) || '';

  // Password strength calculation (Requirement 7)
  const passwordStrength = useMemo(() => {
    if (!passwordValue) return { score: 0, label: 'None', color: 'bg-slate-200' };

    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[a-z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;

    if (score <= 2) {
      return { score: 1, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600 dark:text-rose-400' };
    } else if (score <= 4) {
      return { score: 2, label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' };
    } else {
      return { score: 3, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' };
    }
  }, [passwordValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    try {
      await registerAuth({
        fullName: data.fullName,
        email: data.email,
        companyName: data.companyName,
        role: data.role as UserRole,
        password: data.password,
      });
      setIsSuccess(true);
    } catch {
      setAuthError('Registration failed. Please check your information and try again.');
    }
  };

  // Success view (Requirement 10)
  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center transition-colors">
        <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Account created successfully
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
          Your WorkFlowX workspace is ready. You can now sign in with your enterprise credentials.
        </p>

        <div className="mt-6">
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/login')}
            className="w-full py-2.5 text-sm font-semibold"
          >
            Continue to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-colors">
      {/* Header */}
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Create your workspace
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Start managing your team&apos;s work with WorkFlowX
        </p>
      </div>

      {/* Global Auth Error Alert if any */}
      {authError && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g. Sanjeevi Kumar"
              aria-invalid={errors.fullName ? 'true' : 'false'}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white placeholder-slate-400 ${
                errors.fullName
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
              }`}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Work Email */}
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

        {/* Company Name & Role in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="companyName"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Company Name
            </label>
            <div className="relative">
              <Building className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="companyName"
                type="text"
                placeholder="Acme Corp"
                aria-invalid={errors.companyName ? 'true' : 'false'}
                aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white placeholder-slate-400 ${
                  errors.companyName
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
                }`}
                {...register('companyName')}
              />
            </div>
            {errors.companyName && (
              <p id="companyName-error" className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              {...register('role')}
            >
              <option value="EMPLOYEE">Employee (Default)</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`w-full pl-9 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white placeholder-slate-400 ${
                errors.password
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.password.message}
            </p>
          )}

          {/* Password Strength Indicator (Requirement 7) */}
          {passwordValue.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Password strength:</span>
                <span className={`font-semibold ${passwordStrength.textColor}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="flex gap-1.5 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full flex-1 transition-all duration-200 ${
                    passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <div
                  className={`h-full flex-1 transition-all duration-200 ${
                    passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <div
                  className={`h-full flex-1 transition-all duration-200 ${
                    passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              className={`w-full pl-9 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white placeholder-slate-400 ${
                errors.confirmPassword
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
              }`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms and Conditions Checkbox (Requirement 9) */}
        <div className="pt-1">
          <div className="flex items-start">
            <input
              id="agreeTerms"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5"
              {...register('agreeTerms')}
            />
            <label
              htmlFor="agreeTerms"
              className="ml-2 block text-xs text-slate-600 dark:text-slate-400 leading-normal cursor-pointer select-none"
            >
              I agree to the{' '}
              <a href="#terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full py-2.5 text-sm font-semibold"
          >
            {isSubmitting ? 'Creating workspace...' : 'Create Account'}
          </Button>
        </div>
      </form>

      {/* Bottom Link: Login */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
