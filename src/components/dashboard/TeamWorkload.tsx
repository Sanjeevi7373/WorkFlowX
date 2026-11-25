import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import type { TeamWorkloadData } from '@/types/dashboard';

export interface TeamWorkloadProps {
  members: TeamWorkloadData[];
}

export const TeamWorkload: React.FC<TeamWorkloadProps> = ({ members }) => {
  const getWorkloadVariant = (percentage: number) => {
    if (percentage > 80) return 'danger';
    if (percentage > 60) return 'warning';
    return 'success';
  };

  const getWorkloadBadge = (category: TeamWorkloadData['workloadCategory']) => {
    switch (category) {
      case 'Heavy':
        return <Badge variant="danger">Heavy</Badge>;
      case 'High':
        return <Badge variant="warning">High</Badge>;
      case 'Normal':
      default:
        return <Badge variant="success">Normal</Badge>;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <CardTitle>Team Workload</CardTitle>
          <CardDescription>Capacity and active task allocations</CardDescription>
        </div>
        <Link
          to="/team"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>View team</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={member.name} size="sm" />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {member.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {member.activeTasks}
                  </span>{' '}
                  active
                </span>
                {getWorkloadBadge(member.workloadCategory)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ProgressBar
                value={member.workloadPercentage}
                variant={getWorkloadVariant(member.workloadPercentage)}
                size="xs"
                className="flex-1"
              />
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 tabular-nums w-8 text-right">
                {member.workloadPercentage}%
              </span>
            </div>
          </div>
        ))}

        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          <span>Workload reflects assigned volume, not performance evaluations.</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamWorkload;
