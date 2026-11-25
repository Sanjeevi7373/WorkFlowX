import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Calendar,
  FolderKanban,
  Users,
  ShieldAlert,
  FileText,
  UserCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { projectService } from '@/services/projectService';
import api from '@/services/api';
import type { Project, Priority } from '@/types';

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
}

interface ManagerOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
}

interface TeamOption {
  id: string;
  name: string;
}

const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .min(3, 'Project name must be at least 3 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .min(10, 'Description must be at least 10 characters'),
    managerId: z.string().min(1, 'Please select a project manager'),
    teamId: z.string().min(1, 'Please select a team'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    {
      message: 'End date must not be before start date',
      path: ['endDate'],
    }
  );

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const getInitialStartDate = (): string => {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().split('T')[0];
};

const getInitialEndDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 60);
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().split('T')[0];
};

const fieldClass = (hasError = false) =>
  `w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white ${
    hasError
      ? 'border-rose-400 focus:border-rose-500'
      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600'
  }`;

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [managers, setManagers] = useState<ManagerOption[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      managerId: '',
      teamId: '',
      priority: 'MEDIUM',
      startDate: getInitialStartDate(),
      endDate: getInitialEndDate(),
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const loadOptions = async () => {
      setLoadingOptions(true);
      setOptionsError('');

      try {
        const [usersResponse, teamsResponse] = await Promise.all([
          api.get<ManagerOption[]>('/users'),
          api.get<TeamOption[]>('/teams'),
        ]);

        if (cancelled) return;

        const users = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : [];

        const loadedManagers = users.filter((user) => {
          const role = String(user.role || '')
            .replace('ROLE_', '')
            .toUpperCase();

          return role === 'ADMIN' || role === 'MANAGER';
        });

        const loadedTeams = Array.isArray(teamsResponse.data)
          ? teamsResponse.data
          : [];

        setManagers(
          loadedManagers.map((user) => ({
            ...user,
            id: String(user.id),
          }))
        );

        setTeams(
          loadedTeams.map((team) => ({
            ...team,
            id: String(team.id),
          }))
        );

        if (loadedManagers.length === 0 || loadedTeams.length === 0) {
          setOptionsError(
            'No managers or teams were found. Create a manager account and a team first, then reopen this form.'
          );
        }
      } catch (error) {
        console.error('Failed to load managers and teams:', error);

        if (!cancelled) {
          setManagers([]);
          setTeams([]);
          setOptionsError(
            'Could not load managers or teams. Check your login permissions and backend.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingOptions(false);
        }
      }
    };

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        description: '',
        managerId: '',
        teamId: '',
        priority: 'MEDIUM',
        startDate: getInitialStartDate(),
        endDate: getInitialEndDate(),
      });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      const created = await projectService.createProject({
        name: data.name,
        description: data.description,
        priority: data.priority as Priority,
        startDate: data.startDate,
        endDate: data.endDate,
        managerId: data.managerId,
        teamId: data.teamId,
      });

      onProjectCreated(created);
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
      setOptionsError(
        'Project creation failed. Please check the backend and try again.'
      );
    }
  };

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <FolderKanban className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white tracking-tight"
              >
                Create New Project
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Set up initial milestones and assign team ownership.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4"
          noValidate
        >
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Initial Project Status:
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[11px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
              PLANNING
            </span>
          </div>

          <div>
            <label
              htmlFor="projectName"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Project Name <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <FolderKanban className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="projectName"
                type="text"
                placeholder="e.g. NextGen Microservices Migration"
                aria-invalid={!!errors.name}
                className={`${fieldClass(!!errors.name)} pr-3.5`}
                {...register('name')}
              />
            </div>

            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Description <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <FileText className="h-4 w-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
              <textarea
                id="description"
                rows={3}
                placeholder="Briefly describe the objectives, scope, and key deliverables..."
                aria-invalid={!!errors.description}
                className={`${fieldClass(!!errors.description)} resize-y`}
                {...register('description')}
              />
            </div>

            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="managerId"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Project Manager <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <UserCheck className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  id="managerId"
                  disabled={loadingOptions}
                  aria-invalid={!!errors.managerId}
                  className={`${fieldClass(!!errors.managerId)} pr-8 cursor-pointer disabled:cursor-wait disabled:opacity-60`}
                  {...register('managerId')}
                >
                  <option value="">
                    {loadingOptions
                      ? 'Loading managers...'
                      : 'Select a manager'}
                  </option>

                  {managers.map((manager) => (
                    <option
                      key={manager.id}
                      value={manager.id}
                      className="bg-white dark:bg-slate-800"
                    >
                      {`${manager.firstName || ''} ${manager.lastName || ''}`.trim() ||
                        manager.email}
                      {manager.department
                        ? ` (${manager.department})`
                        : ''}
                    </option>
                  ))}
                </select>
              </div>

              {errors.managerId && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.managerId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="teamId"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Assigned Team <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <Users className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  id="teamId"
                  disabled={loadingOptions}
                  aria-invalid={!!errors.teamId}
                  className={`${fieldClass(!!errors.teamId)} pr-8 cursor-pointer disabled:cursor-wait disabled:opacity-60`}
                  {...register('teamId')}
                >
                  <option value="">
                    {loadingOptions ? 'Loading teams...' : 'Select a team'}
                  </option>

                  {teams.map((team) => (
                    <option
                      key={team.id}
                      value={team.id}
                      className="bg-white dark:bg-slate-800"
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {errors.teamId && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.teamId.message}
                </p>
              )}
            </div>
          </div>

          {optionsError && (
            <p
              role="alert"
              className="text-xs text-rose-600 dark:text-rose-400 font-medium"
            >
              {optionsError}
            </p>
          )}

          <div>
            <label
              htmlFor="priority"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Priority <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <ShieldAlert className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                id="priority"
                className={`${fieldClass()} pr-8 cursor-pointer`}
                {...register('priority')}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Start Date <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="startDate"
                  type="date"
                  aria-invalid={!!errors.startDate}
                  className={`${fieldClass(!!errors.startDate)} cursor-pointer`}
                  {...register('startDate')}
                />
              </div>

              {errors.startDate && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                End Date (Deadline) <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="endDate"
                  type="date"
                  aria-invalid={!!errors.endDate}
                  className={`${fieldClass(!!errors.endDate)} cursor-pointer`}
                  {...register('endDate')}
                />
              </div>

              {errors.endDate && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={loadingOptions || managers.length === 0 || teams.length === 0}
              className="cursor-pointer font-semibold shadow-sm"
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;