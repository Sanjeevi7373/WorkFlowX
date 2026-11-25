import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ClockAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { OverdueTaskData } from '@/types/dashboard';

export interface NeedsAttentionProps {
  overdueTasks: OverdueTaskData[];
  totalOverdueCount?: number;
}

export const NeedsAttention: React.FC<NeedsAttentionProps> = ({
  overdueTasks,
  totalOverdueCount = 5,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-rose-200/80 dark:border-rose-900/40 bg-gradient-to-r from-white via-white to-rose-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-3 border-b border-rose-100 dark:border-rose-950/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-rose-950 dark:text-rose-200">
                Needs Attention
              </CardTitle>
              <Badge variant="danger">{totalOverdueCount} Overdue</Badge>
            </div>
            <CardDescription className="text-rose-700/70 dark:text-rose-400/70">
              Tasks that have exceeded their target delivery date
            </CardDescription>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/tasks')}
          className="border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1.5 self-start sm:self-auto"
        >
          <span>View all overdue tasks</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {overdueTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              onClick={() => navigate('/tasks')}
              className="p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-white dark:bg-slate-800/80 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1">
                    <ClockAlert className="h-3.5 w-3.5" />
                    <span>{task.daysOverdue} {task.daysOverdue === 1 ? 'day' : 'days'} overdue</span>
                  </span>
                  <Badge variant={task.priority === 'Critical' ? 'danger' : 'warning'}>
                    {task.priority}
                  </Badge>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 leading-relaxed">
                  {task.title}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="truncate">{task.project}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
                  Review &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NeedsAttention;
