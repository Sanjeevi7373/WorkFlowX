import type {
  DashboardStats,
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

/**
 * KPI Statistics for different date range filters
 */
export const mockDashboardStatsByRange: Record<DateRangeOption, DashboardStats> = {
  'This Week': {
    activeProjects: 12,
    activeProjectsChange: 8.2,
    pendingTasks: 48,
    pendingTasksChange: 5.4,
    completedThisWeek: 31,
    completedThisWeekChange: 14.8,
    overdueTasks: 5,
    overdueTasksChange: -12.5,
    lastUpdated: '2 min ago',
  },
  Today: {
    activeProjects: 12,
    activeProjectsChange: 0.0,
    pendingTasks: 48,
    pendingTasksChange: 2.1,
    completedThisWeek: 7,
    completedThisWeekChange: 12.0,
    overdueTasks: 5,
    overdueTasksChange: 0.0,
    lastUpdated: 'Just now',
  },
  'This Month': {
    activeProjects: 14,
    activeProjectsChange: 16.7,
    pendingTasks: 48,
    pendingTasksChange: -3.2,
    completedThisWeek: 124,
    completedThisWeekChange: 22.4,
    overdueTasks: 5,
    overdueTasksChange: -28.6,
    lastUpdated: '5 min ago',
  },
  'This Quarter': {
    activeProjects: 18,
    activeProjectsChange: 25.0,
    pendingTasks: 48,
    pendingTasksChange: -8.5,
    completedThisWeek: 380,
    completedThisWeekChange: 31.2,
    overdueTasks: 5,
    overdueTasksChange: -40.0,
    lastUpdated: '10 min ago',
  },
};

/**
 * Task Completion Trend (Mon to Sun)
 */
export const mockTaskTrendData: TaskTrendData[] = [
  { day: 'Mon', tasksCreated: 14, tasksCompleted: 10 },
  { day: 'Tue', tasksCreated: 18, tasksCompleted: 15 },
  { day: 'Wed', tasksCreated: 12, tasksCompleted: 16 },
  { day: 'Thu', tasksCreated: 22, tasksCompleted: 19 },
  { day: 'Fri', tasksCreated: 19, tasksCompleted: 24 },
  { day: 'Sat', tasksCreated: 6, tasksCompleted: 8 },
  { day: 'Sun', tasksCreated: 4, tasksCompleted: 5 },
];

/**
 * Task Status Distribution (Donut Chart)
 */
export const mockTaskStatusData: TaskStatusData[] = [
  { name: 'To Do', value: 24, color: '#64748b' },        // slate-500
  { name: 'In Progress', value: 36, color: '#3b82f6' }, // blue-500
  { name: 'Review', value: 18, color: '#8b5cf6' },      // violet-500
  { name: 'Completed', value: 52, color: '#10b981' },   // emerald-500
  { name: 'Overdue', value: 5, color: '#ef4444' },       // red-500
];

/**
 * Key Active Projects Progress
 */
export const mockProjectProgressData: ProjectProgressData[] = [
  {
    id: 'proj-1',
    name: 'E-Commerce Platform',
    manager: 'Arun Kumar',
    progress: 72,
    deadline: 'Oct 15, 2026',
    status: 'On Track',
  },
  {
    id: 'proj-2',
    name: 'Mobile Banking App',
    manager: 'Priya Sharma',
    progress: 61,
    deadline: 'Nov 02, 2026',
    status: 'At Risk',
  },
  {
    id: 'proj-3',
    name: 'CRM Modernization',
    manager: 'Sanjeevi Kumar',
    progress: 84,
    deadline: 'Sep 30, 2026',
    status: 'On Track',
  },
  {
    id: 'proj-4',
    name: 'Customer Support Portal',
    manager: 'Sanjay Raj',
    progress: 45,
    deadline: 'Dec 10, 2026',
    status: 'Delayed',
  },
  {
    id: 'proj-5',
    name: 'Cloud Infrastructure 2.0',
    manager: 'Deepak',
    progress: 90,
    deadline: 'Oct 05, 2026',
    status: 'On Track',
  },
];

/**
 * Tasks Assigned to Current User (Sanjeevi Kumar)
 */
export const mockMyTasksData: MyTaskData[] = [
  {
    id: 'task-101',
    title: 'Implement Payment Gateway API',
    project: 'E-Commerce Platform',
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Sep 28',
    progress: 65,
  },
  {
    id: 'task-102',
    title: 'Design Authentication UI',
    project: 'CRM Modernization',
    priority: 'Medium',
    status: 'Review',
    dueDate: 'Sep 27',
    progress: 90,
  },
  {
    id: 'task-103',
    title: 'Fix Notification Service',
    project: 'Mobile Banking App',
    priority: 'Critical',
    status: 'TODO',
    dueDate: 'Sep 26',
    progress: 0,
  },
  {
    id: 'task-104',
    title: 'Create User Dashboard',
    project: 'Customer Support Portal',
    priority: 'Medium',
    status: 'Completed',
    dueDate: 'Sep 24',
    progress: 100,
  },
  {
    id: 'task-105',
    title: 'Spring Security Role Authorizer',
    project: 'Cloud Infrastructure 2.0',
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Oct 02',
    progress: 40,
  },
];

/**
 * Team Workload Data (10-15 realistic team members)
 */
export const mockTeamWorkloadData: TeamWorkloadData[] = [
  {
    id: 'emp-1',
    name: 'Arun Kumar',
    role: 'Backend Lead',
    activeTasks: 6,
    completedTasks: 14,
    workloadPercentage: 75,
    workloadCategory: 'High',
  },
  {
    id: 'emp-2',
    name: 'Priya Sharma',
    role: 'Frontend Developer',
    activeTasks: 4,
    completedTasks: 18,
    workloadPercentage: 55,
    workloadCategory: 'Normal',
  },
  {
    id: 'emp-3',
    name: 'Sanjay Raj',
    role: 'QA Engineer',
    activeTasks: 8,
    completedTasks: 11,
    workloadPercentage: 90,
    workloadCategory: 'Heavy',
  },
  {
    id: 'emp-4',
    name: 'Deepak',
    role: 'DevOps Engineer',
    activeTasks: 3,
    completedTasks: 15,
    workloadPercentage: 42,
    workloadCategory: 'Normal',
  },
  {
    id: 'emp-5',
    name: 'Sneha Patel',
    role: 'UI/UX Designer',
    activeTasks: 5,
    completedTasks: 12,
    workloadPercentage: 68,
    workloadCategory: 'High',
  },
  {
    id: 'emp-6',
    name: 'Karthik V',
    role: 'Full Stack Engineer',
    activeTasks: 7,
    completedTasks: 9,
    workloadPercentage: 82,
    workloadCategory: 'Heavy',
  },
];

/**
 * Recent Workspace Activity Feed (10+ realistic events)
 */
export const mockRecentActivityData: RecentActivityData[] = [
  {
    id: 'act-1',
    user: 'Arun Kumar',
    description: 'completed Payment API Integration',
    timestamp: '2 minutes ago',
    type: 'task_completed',
  },
  {
    id: 'act-2',
    user: 'Priya Sharma',
    description: 'moved Login UI to Review',
    timestamp: '18 minutes ago',
    type: 'status_change',
  },
  {
    id: 'act-3',
    user: 'Sanjay Raj',
    description: 'created a new QA regression test suite',
    timestamp: '1 hour ago',
    type: 'task_created',
  },
  {
    id: 'act-4',
    user: 'Deepak',
    description: 'deployed version 2.1.0 to staging cluster',
    timestamp: '3 hours ago',
    type: 'deployment',
  },
  {
    id: 'act-5',
    user: 'Sanjeevi Kumar',
    description: 'assigned 3 tasks to the Backend Team',
    timestamp: 'Yesterday',
    type: 'assignment',
  },
  {
    id: 'act-6',
    user: 'Sneha Patel',
    description: 'uploaded high-fidelity wireframes for Mobile Banking',
    timestamp: 'Yesterday',
    type: 'task_completed',
  },
  {
    id: 'act-7',
    user: 'Karthik V',
    description: 'resolved Redis connection pool latency issue',
    timestamp: '2 days ago',
    type: 'task_completed',
  },
];

/**
 * Upcoming Deadlines
 */
export const mockUpcomingDeadlinesData: UpcomingDeadlineData[] = [
  {
    id: 'dl-1',
    title: 'Payment Gateway API',
    project: 'E-Commerce Platform',
    dueDate: 'Due today',
    priority: 'Critical',
    status: 'In Progress',
    isDueSoon: true,
  },
  {
    id: 'dl-2',
    title: 'Authentication Module',
    project: 'CRM Modernization',
    dueDate: 'Due tomorrow',
    priority: 'High',
    status: 'Review',
    isDueSoon: true,
  },
  {
    id: 'dl-3',
    title: 'Mobile App Release candidate',
    project: 'Mobile Banking App',
    dueDate: 'Sep 29',
    priority: 'Medium',
    status: 'TODO',
    isDueSoon: false,
  },
  {
    id: 'dl-4',
    title: 'CRM Production Deployment',
    project: 'CRM Modernization',
    dueDate: 'Oct 01',
    priority: 'High',
    status: 'TODO',
    isDueSoon: false,
  },
];

/**
 * Overdue Tasks ("Needs Attention")
 */
export const mockOverdueTasksData: OverdueTaskData[] = [
  {
    id: 'ov-1',
    title: 'Payment webhook integration failure recovery',
    daysOverdue: 3,
    project: 'E-Commerce Platform',
    priority: 'Critical',
  },
  {
    id: 'ov-2',
    title: 'QA regression testing for sprint 14',
    daysOverdue: 2,
    project: 'Mobile Banking App',
    priority: 'High',
  },
  {
    id: 'ov-3',
    title: 'Database migration index optimization',
    daysOverdue: 1,
    project: 'Cloud Infrastructure 2.0',
    priority: 'High',
  },
];
