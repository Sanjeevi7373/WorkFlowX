import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, Calendar, ArrowRight, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { ProjectProgressData } from '@/types/dashboard';

export interface ProjectProgressProps {
  projects: ProjectProgressData[];
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ projects }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: ProjectProgressData['status']) => {
    switch (status) {
      case 'On Track':
        return <Badge variant="success">On Track</Badge>;
      case 'At Risk':
        return <Badge variant="warning">At Risk</Badge>;
      case 'Delayed':
        return <Badge variant="danger">Delayed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getProgressBarVariant = (status: ProjectProgressData['status']) => {
    switch (status) {
      case 'On Track':
        return 'success';
      case 'At Risk':
        return 'warning';
      case 'Delayed':
        return 'danger';
      default:
        return 'indigo';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Key initiatives and milestone velocity</CardDescription>
        </div>
        <Link
          to="/projects"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate('/projects')}
            className="p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div className="min-w-0 truncate">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{project.manager}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.deadline}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {project.progress}%
                </span>
                {getStatusBadge(project.status)}
              </div>
            </div>

            <ProgressBar
              value={project.progress}
              variant={getProgressBarVariant(project.status)}
              size="sm"
              className="mt-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;
