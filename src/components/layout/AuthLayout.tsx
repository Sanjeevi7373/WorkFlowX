import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthBranding } from '@/components/auth/AuthBranding';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row overflow-x-hidden">
      {/* LEFT COLUMN: Brand & Product Introduction (Desktop & Tablet) */}
      <div className="w-full lg:w-1/2 xl:w-5/12 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <AuthBranding />
      </div>

      {/* RIGHT COLUMN: Form Card Area */}
      <div className="w-full lg:w-1/2 xl:w-7/12 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Outlet for LoginForm, RegisterForm, or ForgotPasswordForm */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
