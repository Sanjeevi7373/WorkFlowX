import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { UpcomingDeadlineData } from '@/types/dashboard';

export interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadlineData[];
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ deadlines }) => {
  const navigate = useNavigate();

  const getPriorityBadge = (priority: UpcomingDeadlineData['priority']) => {
    switch (priority) {
      case 'Critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'High':
        return <Badge variant="warning">High</Badge>;
      case 'Medium':
        return <Badge variant="info">Medium</Badge>;
      case 'Low':
      default:
        return <Badge variant="default">Low</Badge>;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Critical deliverables and milestone cutoffs</CardDescription>
        </div>
        <Link
          to="/calendar"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>View calendar</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
        {deadlines.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate('/calendar')}
            className={`p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
              item.isDueSoon ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    item.isDueSoon
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.isDueSoon ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.project}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    item.isDueSoon
                      ? 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.dueDate}
                </span>
                {getPriorityBadge(item.priority)}
              </div>
            </div>
          </div>
        ))}

        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>Dates sync with sprint milestones</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
