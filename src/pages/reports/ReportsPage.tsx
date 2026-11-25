
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Download,
  RefreshCw,
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import api from '@/services/api';

interface Project {
  id: number;
  name?: string;
  status?: string;
  progress?: number;
}

interface Task {
  id: number;
  title?: string;
  name?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  deadline?: string;
  assignedTo?: { name?: string; email?: string } | null;
}

const normalize = (value?: string) =>
  (value ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_');

const isCompleted = (status?: string) =>
  ['COMPLETED', 'DONE', 'FINISHED', 'CLOSED'].includes(normalize(status));

const isInProgress = (status?: string) =>
  ['IN_PROGRESS', 'INPROGRESS', 'ACTIVE', 'ONGOING'].includes(normalize(status));

const isOverdue = (task: Task) => {
  const due = task.dueDate ?? task.deadline;
  return Boolean(
    due &&
    !isCompleted(task.status) &&
    due.slice(0, 10) < new Date().toLocaleDateString('en-CA')
  );
};

const escapeCsv = (value: unknown) =>
  `"${String(value ?? '').replace(/"/g, '""')}"`;

export const ReportsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('ALL');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [projectResponse, taskResponse] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
      ]);

      const projectData = projectResponse.data;
      const taskData = taskResponse.data;

      setProjects(
        Array.isArray(projectData)
          ? projectData
          : Array.isArray(projectData?.content)
            ? projectData.content
            : []
      );

      setTasks(
        Array.isArray(taskData)
          ? taskData
          : Array.isArray(taskData?.content)
            ? taskData.content
            : []
      );
    } catch (err: any) {
      setError(
        err?.response?.status === 403
          ? 'Your account does not have permission to access all report data.'
          : err?.response?.status === 401
            ? 'Your session has expired. Please log in again.'
            : 'Could not load reports. Check that the projects and tasks APIs are available.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const filteredTasks = useMemo(() => {
    if (period === 'ALL') return tasks;

    const days = Number(period);
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - days);

    return tasks.filter((task) => {
      const date = task.dueDate ?? task.deadline;
      if (!date) return false;

      const parsed = new Date(date);
      return !Number.isNaN(parsed.getTime()) &&
        parsed >= start &&
        parsed <= new Date(now.getTime() + 86400000);
    });
  }, [tasks, period]);

  const completedCount = filteredTasks.filter((task) =>
    isCompleted(task.status)
  ).length;

  const inProgressCount = filteredTasks.filter((task) =>
    isInProgress(task.status)
  ).length;

  const overdueCount = filteredTasks.filter(isOverdue).length;

  const completionRate = filteredTasks.length
    ? Math.round((completedCount / filteredTasks.length) * 100)
    : 0;

  const statusGroups = [
    {
      label: 'Completed',
      count: completedCount,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
    },
    {
      label: 'In Progress',
      count: inProgressCount,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400',
    },
    {
      label: 'Pending / Other',
      count: Math.max(
        filteredTasks.length - completedCount - inProgressCount,
        0
      ),
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
    },
  ];

  const priorityGroups = ['HIGH', 'MEDIUM', 'LOW'].map((priority) => ({
    priority,
    count: filteredTasks.filter(
      (task) => normalize(task.priority) === priority
    ).length,
  }));

  const exportCsv = () => {
    const headers = [
      'Task ID',
      'Task',
      'Status',
      'Priority',
      'Due Date',
      'Assigned To',
      'Overdue',
    ];

    const rows = filteredTasks.map((task) => [
      task.id,
      task.title ?? task.name ?? '',
      task.status ?? '',
      task.priority ?? '',
      task.dueDate ?? task.deadline ?? '',
      task.assignedTo?.name ?? task.assignedTo?.email ?? '',
      isOverdue(task) ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflowx-task-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const maxPriority = Math.max(
    ...priorityGroups.map((item) => item.count),
    1
  );

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Project progress, task completion, and delivery performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          >
            <option value="ALL">All tasks</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <button
            onClick={() => void fetchReports()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={exportCsv}
            disabled={loading || filteredTasks.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Projects"
          value={projects.length}
          icon={<FolderKanban className="h-5 w-5" />}
          color="text-indigo-400"
        />
        <MetricCard
          title="Total Tasks"
          value={filteredTasks.length}
          icon={<ListTodo className="h-5 w-5" />}
          color="text-sky-400"
        />
        <MetricCard
          title="Completed Tasks"
          value={completedCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="text-emerald-400"
        />
        <MetricCard
          title="Overdue Tasks"
          value={overdueCount}
          icon={<Clock className="h-5 w-5" />}
          color="text-red-400"
        />
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center text-slate-400">
          Loading reports...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Task Status</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Distribution of {filteredTasks.length} tasks
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-indigo-400" />
            </div>

            <div className="mt-6 space-y-5">
              {statusGroups.map((group) => {
                const percentage = filteredTasks.length
                  ? Math.round((group.count / filteredTasks.length) * 100)
                  : 0;

                return (
                  <div key={group.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{group.label}</span>
                      <span className={group.textColor}>
                        {group.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${group.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Completion rate</span>
                <span className="text-xl font-bold text-emerald-400">
                  {completionRate}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-semibold text-white">Tasks by Priority</h3>
            <p className="mt-1 text-sm text-slate-400">
              Current priority distribution
            </p>

            <div className="mt-6 space-y-5">
              {priorityGroups.map((item) => {
                const color =
                  item.priority === 'HIGH'
                    ? 'bg-red-500'
                    : item.priority === 'MEDIUM'
                      ? 'bg-amber-500'
                      : 'bg-sky-500';

                return (
                  <div key={item.priority}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-300">
                        {item.priority.charAt(0) +
                          item.priority.slice(1).toLowerCase()}
                      </span>
                      <span className="text-slate-300">{item.count}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{
                          width: `${(item.count / maxPriority) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4">
              <p className="text-sm text-slate-400">
                Priority totals reflect the tasks returned by the current API.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 xl:col-span-2">
            <h3 className="font-semibold text-white">Project Overview</h3>
            <p className="mt-1 text-sm text-slate-400">
              Current project progress from the backend
            </p>

            {projects.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No projects available.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase text-slate-500">
                      <th className="px-3 py-3">Project</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => {
                      const progress = Math.min(
                        100,
                        Math.max(0, Number(project.progress ?? 0))
                      );

                      return (
                        <tr
                          key={project.id}
                          className="border-b border-slate-800/70"
                        >
                          <td className="px-3 py-4 font-medium text-slate-200">
                            {project.name ?? `Project #${project.id}`}
                          </td>
                          <td className="px-3 py-4 text-slate-300">
                            {project.status ?? '—'}
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-800">
                                <div
                                  className="h-full rounded-full bg-indigo-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-slate-400">
                                {progress}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Reports are calculated from the projects and tasks currently accessible
        to your account. Task date filtering uses the available due-date fields.
      </p>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
}) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-400">{title}</p>
      <span className={color}>{icon}</span>
    </div>
    <p className="mt-3 text-3xl font-bold text-white">{value}</p>
  </div>
);

export default ReportsPage;
