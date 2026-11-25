
import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckSquare,
  Plus,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string | null;
  project?: {
    id: number;
    name: string;
  };
  assignedTo?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface TaskForm {
  title: string;
  description: string;
  projectId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string;
}

const initialForm: TaskForm = {
  title: '',
  description: '',
  projectId: '',
  priority: 'MEDIUM',
  dueDate: '',
};

const statusStyles: Record<string, string> = {
  TODO: 'bg-slate-700 text-slate-200',
  IN_PROGRESS: 'bg-indigo-500/20 text-indigo-300',
  REVIEW: 'bg-amber-500/20 text-amber-300',
  COMPLETED: 'bg-emerald-500/20 text-emerald-300',
  CANCELLED: 'bg-red-500/20 text-red-300',
};

const priorityStyles: Record<string, string> = {
  LOW: 'text-slate-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-amber-400',
  CRITICAL: 'text-red-400',
};

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState<TaskForm>(initialForm);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get<Task[]>('/tasks');
      setTasks(response.data);
    } catch {
      setError(
        'Could not load tasks. Check your login and backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const updateForm = <K extends keyof TaskForm>(
    field: K,
    value: TaskForm[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createTask = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setSuccessMessage('');

    try {
      await api.post('/tasks', {
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: 'TODO',
        priority: form.priority,
        dueDate: form.dueDate || null,
        project: {
          id: Number(form.projectId),
        },
      });

      setForm({ ...initialForm });
      setShowForm(false);
      setSuccessMessage('Task created successfully.');

      await loadTasks();
    } catch {
      setFormError(
        'Task creation failed. Verify the project ID, JWT login, and backend logs.'
      );
    } finally {
      setSaving(false);
    }
  };

  const visibleTasks =
    statusFilter === 'ALL'
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Tasks
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Track, assign, and organize employee workflow tasks.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => void loadTasks()}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setShowForm((current) => !current);
              setFormError('');
              setSuccessMessage('');
            }}
          >
            {showForm ? (
              <X className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {showForm ? 'Cancel' : 'New Task'}
          </Button>
        </div>
      </div>

      {/* Task management card */}
      <Card>
        {/* Create task form */}
        {showForm && (
          <CardContent className="border-b border-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Create New Task
            </h3>

            <form
              onSubmit={createTask}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-1">
                <label
                  htmlFor="task-title"
                  className="text-sm text-slate-300"
                >
                  Task title *
                </label>
                <input
                  id="task-title"
                  required
                  maxLength={255}
                  value={form.title}
                  onChange={(event) =>
                    updateForm('title', event.target.value)
                  }
                  placeholder="Enter task title"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="task-project"
                  className="text-sm text-slate-300"
                >
                  Existing project ID *
                </label>
                <input
                  id="task-project"
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={form.projectId}
                  onChange={(event) =>
                    updateForm('projectId', event.target.value)
                  }
                  placeholder="Example: 3"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
                <p className="text-xs text-slate-500">
                  Enter an existing project ID from your database.
                </p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label
                  htmlFor="task-description"
                  className="text-sm text-slate-300"
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  maxLength={2000}
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateForm('description', event.target.value)
                  }
                  placeholder="Describe the task"
                  className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="task-priority"
                  className="text-sm text-slate-300"
                >
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={form.priority}
                  onChange={(event) =>
                    updateForm(
                      'priority',
                      event.target.value as TaskForm['priority']
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="task-due-date"
                  className="text-sm text-slate-300"
                >
                  Due date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    updateForm('dueDate', event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {formError && (
                <p
                  role="alert"
                  className="text-sm text-red-400 sm:col-span-2"
                >
                  {formError}
                </p>
              )}

              <div className="flex gap-3 sm:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? 'Creating...' : 'Create Task'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  disabled={saving}
                  onClick={() => {
                    setShowForm(false);
                    setFormError('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}

        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-400" />
            <CardTitle>Task Management</CardTitle>
          </div>
          <CardDescription>
            Tasks loaded from your Spring Boot API.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {successMessage && (
            <p
              role="status"
              className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-300"
            >
              {successMessage}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Showing {visibleTasks.length} of {tasks.length} tasks
            </p>

            <select
              aria-label="Filter tasks by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="ALL">All statuses</option>
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-slate-400">
              Loading tasks...
            </p>
          ) : error ? (
            <div className="py-10 text-center">
              <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() => void loadTasks()}
                >
                  Try again
                </Button>
              </div>
            </div>
          ) : visibleTasks.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">
              No tasks found for this filter.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="px-3 py-3 font-medium">Task</th>
                    <th className="px-3 py-3 font-medium">Project</th>
                    <th className="px-3 py-3 font-medium">Assignee</th>
                    <th className="px-3 py-3 font-medium">Priority</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Due date</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-slate-800 last:border-0"
                    >
                      <td className="px-3 py-4">
                        <p className="font-medium text-white">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {task.description}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-4 text-slate-300">
                        {task.project?.name ?? '—'}
                      </td>

                      <td className="px-3 py-4 text-slate-300">
                        {task.assignedTo
                          ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`.trim()
                          : 'Unassigned'}
                      </td>

                      <td
                        className={`px-3 py-4 font-medium ${priorityStyles[task.priority] ?? ''}`}
                      >
                        {task.priority}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status] ?? ''}`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-slate-300">
                        {task.dueDate ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
