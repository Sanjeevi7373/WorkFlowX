export type DateRangeOption = 'Today' | 'This Week' | 'This Month' | 'This Quarter';

export interface DashboardStats {
  activeProjects: number;
  activeProjectsChange: number;
  pendingTasks: number;
  pendingTasksChange: number;
  completedThisWeek: number;
  completedThisWeekChange: number;
  overdueTasks: number;
  overdueTasksChange: number;
  lastUpdated: string;
}

export interface TaskTrendData {
  day: string;
  tasksCreated: number;
  tasksCompleted: number;
}

export interface TaskStatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface ProjectProgressData {
  id: string;
  name: string;
  manager: string;
  progress: number;
  deadline: string;
  status: 'On Track' | 'At Risk' | 'Delayed';
}

export interface MyTaskData {
  id: string;
  title: string;
  project: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'TODO' | 'In Progress' | 'Review' | 'Completed' | 'Overdue';
  dueDate: string;
  progress: number;
}

export interface TeamWorkloadData {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  activeTasks: number;
  completedTasks: number;
  workloadPercentage: number;
  workloadCategory: 'Normal' | 'High' | 'Heavy';
}

export interface RecentActivityData {
  id: string;
  user: string;
  avatar?: string;
  description: string;
  timestamp: string;
  type: 'task_completed' | 'status_change' | 'task_created' | 'deployment' | 'assignment';
}

export interface UpcomingDeadlineData {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'TODO' | 'In Progress' | 'Review';
  isDueSoon: boolean;
}

export interface OverdueTaskData {
  id: string;
  title: string;
  daysOverdue: number;
  project: string;
  priority: 'High' | 'Critical' | 'Medium';
}
