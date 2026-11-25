import api from './api';

export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalTeams: number;
  unreadNotifications: number;
}

export interface TaskStatusSummary {
  status: string;
  count: number;
}

export interface ProjectProgressSummary {
  projectId: number;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
}
export interface UpcomingDeadlineSummary {
  taskId: number;
  taskTitle: string;
  projectName: string;
  dueDate: string;
  priority: string;
}
export interface MyTaskSummary {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
}
export interface TeamWorkloadSummary {
  userId: number;
  userName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}
export interface RecentActivitySummary {
  id: number;
  type: string;
  message: string;
  userName: string;
  createdAt: string;
}
export interface OverdueTaskSummary {
  taskId: number;
  taskTitle: string;
  projectName: string;
  dueDate: string;
  priority: string;
}
export interface TaskTrendSummary {
  date: string;
  tasksCreated: number;
  tasksCompleted: number;
}

class DashboardService {

  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummary>(
      '/dashboard/summary'
    );

    return response.data;
  }

  async getTaskStatusSummary(): Promise<TaskStatusSummary[]> {
    const response = await api.get<TaskStatusSummary[]>(
      '/dashboard/task-status'
    );

    return response.data;
  }

  async getProjectProgressSummary(): Promise<ProjectProgressSummary[]> {
    const response = await api.get<ProjectProgressSummary[]>(
      '/dashboard/project-progress'
    );

    return response.data;
  }
  async getUpcomingDeadlines(): Promise<UpcomingDeadlineSummary[]> {
    const response = await api.get<UpcomingDeadlineSummary[]>(
      '/dashboard/upcoming-deadlines'
    );

    return response.data;
  }
  async getMyTasks(): Promise<MyTaskSummary[]> {
    const response = await api.get<MyTaskSummary[]>(
      '/tasks/my'
    );

    return response.data;
  }
  async getTeamWorkloadSummary(): Promise<TeamWorkloadSummary[]> {
    const response = await api.get<TeamWorkloadSummary[]>(
      '/dashboard/team-workload'
    );

    return response.data;
  }
  async getRecentActivity(): Promise<RecentActivitySummary[]> {
    const response = await api.get<RecentActivitySummary[]>(
      '/dashboard/recent-activity'
    );

    return response.data;
  }
  async getOverdueTasks(): Promise<OverdueTaskSummary[]> {
    const response = await api.get<OverdueTaskSummary[]>(
      '/dashboard/overdue-tasks'
    );

    return response.data;
  }
  async getTaskTrendSummary(): Promise<TaskTrendSummary[]> {
    const response = await api.get<TaskTrendSummary[]>(
      '/dashboard/task-trend'
    );

    return response.data;
  }
}

export const dashboardService =
  new DashboardService();

export default dashboardService;