import React, { useState, useEffect } from 'react';

import {
  FolderKanban,
  Clock3,
  CircleCheck,
  AlertTriangle,
  Calendar,
  RefreshCw,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/services/dashboardService';

import { StatCard } from '@/components/dashboard/StatCard';
import { TaskCompletionChart } from '@/components/dashboard/TaskCompletionChart';
import { TaskStatusChart } from '@/components/dashboard/TaskStatusChart';
import { ProjectProgress } from '@/components/dashboard/ProjectProgress';
import { MyTasks } from '@/components/dashboard/MyTasks';
import { TeamWorkload } from '@/components/dashboard/TeamWorkload';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { NeedsAttention } from '@/components/dashboard/NeedsAttention';

import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

import type {
  TaskTrendData,
  TaskStatusData,
  ProjectProgressData,
  MyTaskData,
  TeamWorkloadData,
  RecentActivityData,
  UpcomingDeadlineData,
  OverdueTaskData,
  DateRangeOption,
} from '@/types/dashboard';

import type { DashboardSummary } from '@/services/dashboardService';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [dateRange, setDateRange] =
    useState<DateRangeOption>('This Week');

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [isRefreshing, setIsRefreshing] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  // =========================================================
  // Dashboard Data State
  // =========================================================

  const [stats, setStats] =
    useState<DashboardSummary | null>(null);

  const [trendData, setTrendData] =
    useState<TaskTrendData[]>([]);

  const [statusData, setStatusData] =
    useState<TaskStatusData[]>([]);

  const [projects, setProjects] =
    useState<ProjectProgressData[]>([]);

  const [myTasks, setMyTasks] =
    useState<MyTaskData[]>([]);

  const [workload, setWorkload] =
    useState<TeamWorkloadData[]>([]);

  const [activities, setActivities] =
    useState<RecentActivityData[]>([]);

  const [deadlines, setDeadlines] =
    useState<UpcomingDeadlineData[]>([]);

  const [overdueTasks, setOverdueTasks] =
    useState<OverdueTaskData[]>([]);

  // =========================================================
  // Load Dashboard Data
  // =========================================================

  useEffect(() => {
    let ignore = false;

    const loadDashboardData = async () => {
      try {
        setError(null);

        const [
          fetchedStats,
          fetchedStatus,
          fetchedProjectProgress,
          fetchedDeadlines,
          fetchedMyTasks,
          fetchedWorkload,
          fetchedActivities,
          fetchedOverdueTasks,
          fetchedTrend,
        ] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getTaskStatusSummary(),
          dashboardService.getProjectProgressSummary(),
          dashboardService.getUpcomingDeadlines(),
          dashboardService.getMyTasks(),
          dashboardService.getTeamWorkloadSummary(),
          dashboardService.getRecentActivity(),
          dashboardService.getOverdueTasks(),
          dashboardService.getTaskTrendSummary(),
        ]);

        if (!ignore) {
          setStats(fetchedStats);
          // =====================================================
          // Task Status
          // =====================================================

          setStatusData(
            fetchedStatus.map((item) => ({
              name: item.status,
              value: item.count,
              color:
                item.status === 'TODO'
                  ? '#94a3b8'
                  : item.status === 'IN_PROGRESS'
                  ? '#3b82f6'
                  : item.status === 'REVIEW'
                  ? '#f59e0b'
                  : item.status === 'COMPLETED'
                  ? '#10b981'
                  : '#ef4444',
            }))
          );

          // =====================================================
          // Project Progress
          // =====================================================

          setProjects(
            fetchedProjectProgress.map((project) => ({
              id: String(project.projectId),
              name: project.projectName,
              manager: '—',
              deadline: '—',
              status:
                project.progress >= 70
                  ? 'On Track'
                  : project.progress >= 40
                  ? 'At Risk'
                  : 'Delayed',
              progress: project.progress,
            }))
          );

          // =====================================================
          // Other sections will be connected to their real
          // backend APIs later.
          // =====================================================

          setTrendData(
            fetchedTrend.map((item) => {
              let day = item.date;
              if (item.date) {
                const parts = item.date.split('-');
                if (parts.length === 3) {
                  const dateObj = new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    Number(parts[2])
                  );
                  if (!isNaN(dateObj.getTime())) {
                    day = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  }
                }
              }

              return {
                day,
                tasksCreated: item.tasksCreated,
                tasksCompleted: item.tasksCompleted,
              };
            })
          );

          setMyTasks(
            fetchedMyTasks.map((task) => {
              const priorityUpper = (task.priority || '').toUpperCase();
              const priority: MyTaskData['priority'] =
                priorityUpper === 'CRITICAL'
                  ? 'Critical'
                  : priorityUpper === 'HIGH'
                  ? 'High'
                  : priorityUpper === 'LOW'
                  ? 'Low'
                  : 'Medium';

              const statusUpper = (task.status || '').toUpperCase();
              const status: MyTaskData['status'] =
                statusUpper === 'IN_PROGRESS'
                  ? 'In Progress'
                  : statusUpper === 'REVIEW'
                  ? 'Review'
                  : statusUpper === 'COMPLETED'
                  ? 'Completed'
                  : statusUpper === 'OVERDUE'
                  ? 'Overdue'
                  : 'TODO';

              return {
                id: String(task.id),
                title: task.title,
                status,
                priority,
                dueDate: task.dueDate || '—',
                project: '—',
                progress: status === 'Completed' ? 100 : status === 'In Progress' ? 50 : 0,
              };
            })
          );

          setWorkload(
            fetchedWorkload.map((member) => {
              const activeTasks = member.pendingTasks;
              const workloadPercentage = Math.min(
                100,
                Math.round((activeTasks / 8) * 100)
              );
              const workloadCategory: TeamWorkloadData['workloadCategory'] =
                workloadPercentage > 80
                  ? 'Heavy'
                  : workloadPercentage > 60
                  ? 'High'
                  : 'Normal';

              return {
                id: String(member.userId),
                name: member.userName,
                role: 'Team Member',
                activeTasks,
                completedTasks: member.completedTasks,
                workloadPercentage,
                workloadCategory,
              };
            })
          );

          setActivities(
            fetchedActivities.map((activity) => {
              const typeUpper = (activity.type || '').toUpperCase();
              const type: RecentActivityData['type'] =
                typeUpper === 'TASK' || typeUpper === 'TASK_COMPLETED'
                  ? 'task_completed'
                  : typeUpper === 'PROJECT' || typeUpper === 'STATUS_CHANGE'
                  ? 'status_change'
                  : typeUpper === 'TEAM' || typeUpper === 'ASSIGNMENT'
                  ? 'assignment'
                  : typeUpper === 'SYSTEM' || typeUpper === 'DEPLOYMENT'
                  ? 'deployment'
                  : 'task_created';

              return {
                id: String(activity.id),
                user: activity.userName,
                description: activity.message,
                timestamp: activity.createdAt
                  ? new Date(activity.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Just now',
                type,
              };
            })
          );

          setDeadlines(
            fetchedDeadlines.map((deadline) => {
              const priorityUpper = (deadline.priority || '').toUpperCase();
              const priority: UpcomingDeadlineData['priority'] =
                priorityUpper === 'CRITICAL'
                  ? 'Critical'
                  : priorityUpper === 'HIGH'
                  ? 'High'
                  : priorityUpper === 'LOW'
                  ? 'Low'
                  : 'Medium';

              return {
                id: String(deadline.taskId),
                title: deadline.taskTitle,
                project: deadline.projectName,
                dueDate: deadline.dueDate,
                priority,
                status: 'In Progress',
                isDueSoon: true,
              };
            })
          );

          setOverdueTasks(
            fetchedOverdueTasks.map((task) => {
              const priorityUpper = (task.priority || '').toUpperCase();
              const priority: OverdueTaskData['priority'] =
                priorityUpper === 'CRITICAL'
                  ? 'Critical'
                  : priorityUpper === 'MEDIUM'
                  ? 'Medium'
                  : 'High';

              let daysOverdue = 1;
              if (task.dueDate) {
                const dueTime = new Date(task.dueDate).getTime();
                const nowTime = new Date().getTime();
                const diffDays = Math.ceil(
                  (nowTime - dueTime) / (1000 * 60 * 60 * 24)
                );
                daysOverdue = diffDays > 0 ? diffDays : 1;
              }

              return {
                id: String(task.taskId),
                title: task.taskTitle,
                project: task.projectName,
                daysOverdue,
                priority,
              };
            })
          );

          setIsLoading(false);

          setIsRefreshing(false);
        }
      } catch (error) {
        console.error(
          'Failed to load dashboard data:',
          error
        );

        if (!ignore) {
          setError(
            'Unable to load dashboard metrics. Please check your network and try again.'
          );

          setIsLoading(false);

          setIsRefreshing(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  // =========================================================
  // Refresh Dashboard
  // =========================================================

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
  };

  // =========================================================
  // User Name
  // =========================================================

  const displayName =
    user?.firstName || 'User';

  // =========================================================
  // Error State
  // =========================================================

  if (error && !stats) {
    return (
      <div className="py-12">
        <ErrorState
          title="Failed to load dashboard data"
          description={error}
          onRetry={() => {
            setIsLoading(true);
            setError(null);
            setRefreshKey((prev) => prev + 1);
          }}
        />
      </div>
    );
  }

  // =========================================================
  // Dashboard UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          ROW 1: Greeting + Date Filter
          ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70 dark:border-slate-800">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Good morning, {displayName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here&apos;s what&apos;s happening across your workspace today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">

          {/* Date Filter */}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">

            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />

            <select
              value={dateRange}
              onChange={(e) => {
                setIsLoading(true);

                setDateRange(
                  e.target.value as DateRangeOption
                );
              }}
              aria-label="Filter dashboard by date range"
              className="text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Today">
                Today
              </option>

              <option value="This Week">
                This Week
              </option>

              <option value="This Month">
                This Month
              </option>

              <option value="This Quarter">
                This Quarter
              </option>
            </select>

          </div>

          {/* Refresh Button */}

          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh dashboard data"
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing
                  ? 'animate-spin'
                  : ''
              }`}
            />
          </button>

          {/* Backend Status */}

          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Live data from WorkflowX backend
          </span>

        </div>
      </div>

      {/* =====================================================
          ROW 2: KPI Cards
          ===================================================== */}

      {isLoading ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />

        </div>

      ) : stats ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Active Projects */}

          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            description="Currently in progress"
            icon={FolderKanban}
            iconBg="bg-indigo-50 dark:bg-indigo-950/50"
            iconColor="text-indigo-600 dark:text-indigo-400"
          />

          {/* Pending Tasks */}

          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            description="TODO, in progress & review"
            icon={Clock3}
            iconBg="bg-blue-50 dark:bg-blue-950/50"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          {/* Completed Projects */}

          <StatCard
            title="Completed Projects"
            value={stats.completedProjects}
            description="Projects completed"
            icon={CircleCheck}
            iconBg="bg-emerald-50 dark:bg-emerald-950/50"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />

          {/* Unread Notifications */}

          <StatCard
            title="Unread Notifications"
            value={stats.unreadNotifications}
            description="Needs your attention"
            icon={AlertTriangle}
            iconBg="bg-rose-50 dark:bg-rose-950/50"
            iconColor="text-rose-600 dark:text-rose-400"
          />

        </div>

      ) : null}

      {/* =====================================================
          ROW 3: Task Charts
          ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">

          {isLoading ? (

            <Skeleton className="h-80 w-full rounded-xl" />

          ) : (

            <TaskCompletionChart
              data={trendData}
            />

          )}

        </div>

        <div className="lg:col-span-1">

          {isLoading ? (

            <Skeleton className="h-80 w-full rounded-xl" />

          ) : (

            <TaskStatusChart
              data={statusData}
            />

          )}

        </div>

      </div>

      {/* =====================================================
          ROW 4: Project Progress + Upcoming Deadlines
          ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {isLoading ? (

          <>
            <Skeleton className="h-80 w-full rounded-xl" />

            <Skeleton className="h-80 w-full rounded-xl" />
          </>

        ) : (

          <>

            <ProjectProgress
              projects={projects}
            />

            <UpcomingDeadlines
              deadlines={deadlines}
            />

          </>

        )}

      </div>

      {/* =====================================================
          ROW 5: My Tasks
          ===================================================== */}

      <div>

        {isLoading ? (

          <Skeleton className="h-72 w-full rounded-xl" />

        ) : (

          <MyTasks
            tasks={myTasks}
          />

        )}

      </div>

      {/* =====================================================
          ROW 6: Team Workload + Recent Activity
          ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {isLoading ? (

          <>
            <Skeleton className="h-80 w-full rounded-xl" />

            <Skeleton className="h-80 w-full rounded-xl" />
          </>

        ) : (

          <>

            <TeamWorkload
              members={workload}
            />

            <RecentActivity
              activities={activities}
            />

          </>

        )}

      </div>

      {/* =====================================================
          ROW 7: Needs Attention
          ===================================================== */}

      <div>

        {isLoading ? (

          <Skeleton
            className="h-32 w-full rounded-xl"
          />

        ) : (

          <NeedsAttention
            overdueTasks={overdueTasks}
            totalOverdueCount={0}
          />

        )}

      </div>

    </div>
  );
};

export default Dashboard;