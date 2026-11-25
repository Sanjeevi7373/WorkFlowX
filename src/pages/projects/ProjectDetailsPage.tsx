
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FolderKanban,
  Layers,
  RefreshCw,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types';

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProject = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        if (!projectId) {
          setProject(null);
          setLoadError('No project ID was provided.');
          return;
        }

        const found = await projectService.getProjectById(projectId);

        if (cancelled) return;

        if (!found) {
          setProject(null);
          setLoadError('The requested project does not exist.');
        } else {
          setProject(found);
        }
      } catch (error) {
        console.error('Failed to load project details:', error);

        if (!cancelled) {
          setProject(null);
          setLoadError(
            'Unable to load project details. Check your login and backend connection.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const formatDate = (value?: string | null) => {
    if (!value) return 'Not set';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: Project['status']) => {
    const styles: Record<string, string> = {
      PLANNING:
        'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      ACTIVE:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      IN_PROGRESS:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      ON_HOLD:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      COMPLETED:
        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      DELAYED:
        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
      CANCELLED:
        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    };

    const labels: Record<string, string> = {
      PLANNING: 'Planning',
      ACTIVE: 'Active',
      IN_PROGRESS: 'In Progress',
      ON_HOLD: 'On Hold',
      COMPLETED: 'Completed',
      DELAYED: 'Delayed',
      CANCELLED: 'Cancelled',
    };

    const value = String(status || 'PLANNING');

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
          styles[value] || styles.PLANNING
        }`}
      >
        {labels[value] || value.replace(/_/g, ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority: Project['priority']) => {
    const styles: Record<string, string> = {
      LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      MEDIUM:
        'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
      HIGH:
        'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
      CRITICAL:
        'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
    };

    const value = String(priority || 'MEDIUM');

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
          styles[value] || styles.MEDIUM
        }`}
      >
        <ShieldAlert className="h-3.5 w-3.5" />
        {value.charAt(0) + value.slice(1).toLowerCase()} Priority
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          Loading project details...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-2xl w-fit mx-auto mb-4 text-rose-600 dark:text-rose-400">
          <FolderKanban className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {loadError.includes('does not exist')
            ? 'Project Not Found'
            : 'Unable to Open Project'}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          {loadError || 'The requested project could not be loaded.'}
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const manager = project.manager;
  const team = project.team;

  const progress = Math.min(
    100,
    Math.max(0, Number(project.progress) || 0)
  );

  const taskCount = Number(project.taskCount) || 0;
  const completedTaskCount = Number(project.completedTaskCount) || 0;
  const remainingTasks = Math.max(0, taskCount - completedTaskCount);

  const managerName = manager
    ? [manager.firstName, manager.lastName].filter(Boolean).join(' ') ||
      manager.email ||
      'Project Creator'
    : 'Project Creator';

  return (
    <div className="space-y-6">
      {/* Navigation and project header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Projects
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {project.name}
              </h1>

              {project.key && (
                <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {project.key}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(project.status)}
            {getPriorityBadge(project.priority)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <CardTitle>Project Progress & Completion</CardTitle>
              </div>

              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {progress}% Complete
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Total Tasks
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {taskCount}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Completed
                  </p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {completedTaskCount}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Remaining
                  </p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {remainingTasks}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Task counts and progress will reflect real task data when
                supplied by the backend.
              </p>
            </CardContent>
          </Card>

          {/* Project information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Project ID
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {project.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Priority
                </p>
                <div>{getPriorityBadge(project.priority)}</div>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Created
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDate(project.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Last Updated
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDate(project.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manager, team, and timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Project Creator / Manager</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar name={managerName} size="md" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {managerName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {manager?.email || 'Creator details unavailable'}
                  </p>
                  {manager?.department && (
                    <span className="inline-block mt-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      {manager.department}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Assigned Team</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Users className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {team?.name || 'Not assigned'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {team?.memberCount ?? 0} Team Members
                  </p>
                </div>
              </div>

              {team?.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5 leading-relaxed">
                  {team.description}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Start Date
                </span>

                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                  {formatDate(project.startDate)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Target Deadline
                </span>

                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                  {formatDate(project.endDate)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Status
                </span>
                {getStatusBadge(project.status)}
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Project details are loaded from the Spring Boot REST API. Team
              assignment and task statistics require corresponding backend
              data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
