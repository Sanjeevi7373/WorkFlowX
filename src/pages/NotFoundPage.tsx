import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
      <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-2xl mb-4 border border-indigo-500/30">
        404
      </div>
      <h1 className="text-2xl font-bold text-white tracking-tight">Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-sm mt-2 mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">Return to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
