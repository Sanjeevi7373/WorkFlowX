import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, GitCommit, Rocket, UserPlus, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import type { RecentActivityData } from '@/types/dashboard';

export interface RecentActivityProps {
  activities: RecentActivityData[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: RecentActivityData['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'status_change':
        return <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
      case 'task_created':
        return <GitCommit className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'deployment':
        return <Rocket className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />;
      case 'assignment':
        return <UserPlus className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  const getActivityIconBg = (type: RecentActivityData['type']) => {
    switch (type) {
      case 'task_completed':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60';
      case 'status_change':
        return 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60';
      case 'task_created':
        return 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60';
      case 'deployment':
        return 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60';
      case 'assignment':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Live workspace updates and operations logs</CardDescription>
        </div>
        <Link
          to="/notifications"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>All activity</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
    <CardContent className="p-4 sm:p-5 flex-1">
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No recent activity yet.
        </p>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              <div
                className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full border flex items-center justify-center ${getActivityIconBg(
                  act.type
                )}`}
              >
                {getActivityIcon(act.type)}
              </div>

              <div className="text-xs">
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-white mr-1">
                    {act.user}
                  </span>
                  <span>{act.description}</span>
                </p>

                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block mt-0.5">
                  {act.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
    </Card>
  );
};

export default RecentActivity;
