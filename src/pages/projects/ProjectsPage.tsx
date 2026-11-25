import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  CheckCircle2,
  FolderKanban,
  Users,
  ShieldAlert,
  ChevronRight,
  FilterX,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Toast } from '@/components/ui/Toast';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { projectService } from '@/services/projectService';
import type { Project, ProjectStatus, Priority } from '@/types';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load projects from service (local mock state persisted in storage)
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);

      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setToastMessage('Failed to load projects. Check your login and backend.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Search Query Filter (name, description, manager name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const managerFullName = `${project.manager.firstName} ${project.manager.lastName}`.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesDesc = project.description.toLowerCase().includes(query);
        const matchesManager = managerFullName.includes(query);

        if (!matchesName && !matchesDesc && !matchesManager) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        if (project.status !== statusFilter) {
          return false;
        }
      }

      // 3. Priority Filter
      if (priorityFilter !== 'ALL') {
        if (project.priority !== priorityFilter) {
          return false;
        }
      }

      return true;
    });
  }, [projects, searchQuery, statusFilter, priorityFilter]);

  // Format date helper: "2026-09-30" -> "Sep 30, 2026"
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const map: Record<ProjectStatus, { label: string; bg: string; text: string; border: string }> = {
      PLANNING: {
        label: 'Planning',
        bg: 'bg-indigo-50 dark:bg-indigo-950/60',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800',
      },
      ACTIVE: {
        label: 'Active',
        bg: 'bg-emerald-50 dark:bg-emerald-950/60',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
      },
      ON_HOLD: {
        label: 'On Hold',
        bg: 'bg-amber-50 dark:bg-amber-950/60',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
      },
      COMPLETED: {
        label: 'Completed',
        bg: 'bg-blue-50 dark:bg-blue-950/60',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
      },
      DELAYED: {
        label: 'Delayed',
        bg: 'bg-rose-50 dark:bg-rose-950/60',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
      },
      CANCELLED: {
        label: 'Cancelled',
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-700',
      },
    };

    const s = map[status] || map.PLANNING;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${s.bg} ${s.text} ${s.border}`}
      >
        {s.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: Priority) => {
    const map: Record<Priority, { label: string; text: string; bg: string }> = {
      LOW: { label: 'Low', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
      MEDIUM: { label: 'Medium', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/50' },
      HIGH: { label: 'High', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50' },
      CRITICAL: { label: 'Critical', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/50' },
    };
    const p = map[priority] || map.MEDIUM;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${p.bg} ${p.text}`}>
        <ShieldAlert className="h-3 w-3" />
        {p.label}
      </span>
    );
  };

  const handleProjectCreated = async (newProject: Project) => {
    setProjects((prev) => [
      newProject,
      ...prev.filter((project) => project.id !== newProject.id),
    ]);

    setToastMessage('Project created successfully');

    try {
      const updatedProjects = await projectService.getProjects();
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  const isFiltered = searchQuery !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast
        isOpen={!!toastMessage}
        message={toastMessage || ''}
        type="success"
        onClose={() => setToastMessage(null)}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage company projects, milestones, and deliverables.
          </p>
        </div>

        {/* New Project Button - Prominent, enabled, cursor-pointer */}
        <Button
          id="new-project-button"
          type="button"
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 cursor-pointer font-semibold shadow-sm px-4 py-2 text-sm self-start sm:self-auto hover:bg-indigo-700 active:scale-98 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* CONTROLS & FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="search-projects-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, description, manager..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters & View Switch */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="status-filter" className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Status:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="DELAYED">Delayed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="priority-filter" className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Priority:
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* View Switch: Grid vs List */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700 shrink-0">
              <button
                type="button"
                id="grid-view-toggle"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                id="list-view-toggle"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredProjects.length}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{projects.length}</strong> projects
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading project directory...</p>
        </div>
      )}

      {/* EMPTY RESULTS STATE */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-xs">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit mx-auto mb-3 text-slate-400 dark:text-slate-500">
            <FolderKanban className="h-8 w-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No projects found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {isFiltered
              ? 'No projects match your current search or filter criteria. Try adjusting or resetting filters.'
              : 'No projects have been created yet. Click "+ New Project" to get started.'}
          </p>
          {isFiltered ? (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={resetFilters} className="cursor-pointer">
                Reset all filters
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="cursor-pointer gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Project</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {!isLoading && filteredProjects.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/projects/${project.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/projects/${project.id}`);
                }
              }}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md hover:border-indigo-400/50 dark:hover:border-indigo-500/40 transition-all duration-150 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <div>
                {/* Card Top: Status & Priority Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getStatusBadge(project.status)}
                  {getPriorityBadge(project.priority)}
                </div>

                {/* Project Title & Key */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  {project.key && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      {project.key}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed min-h-[2rem]">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tasks & Team Summary */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">
                      Tasks: <strong>{project.completedTaskCount}</strong> / {project.taskCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate" title={project.team.name}>
                      {project.team.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Manager & Deadline */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {/* Manager */}
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar
                    name={`${project.manager.firstName} ${project.manager.lastName}`}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {project.manager.firstName} {project.manager.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">Manager</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                    <Calendar className="h-3 w-3" />
                    <span>Deadline</span>
                  </p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {formatDate(project.endDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW (TABLE) */}
      {!isLoading && filteredProjects.length > 0 && viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Manager</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 min-w-[120px]">Progress</th>
                  <th className="py-3 px-4">Tasks</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    {/* Project */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                          <FolderKanban className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                            {project.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {project.team.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Manager */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={`${project.manager.firstName} ${project.manager.lastName}`}
                          size="sm"
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {project.manager.firstName} {project.manager.lastName}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(project.priority)}
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Tasks */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      <strong>{project.completedTaskCount}</strong> / {project.taskCount}
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                      {formatDate(project.endDate)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${project.id}`);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>View</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
