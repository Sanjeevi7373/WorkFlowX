import type { User, Project, Task, Team, Notification } from '@/types';

export const mockCurrentUser: User = {
  id: 'usr-1',
  email: 'admin@workflowx.io',
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN',
  status: 'ACTIVE',
  department: 'Operations',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Backend Core & Cloud Engineering',
    description: 'Specialized in Java Spring Boot, MySQL, and cloud infrastructure.',
    leadId: 'usr-1',
    leadName: 'Admin User',
    memberCount: 5,
    memberIds: ['usr-1'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Enterprise Cloud Migration',
    key: 'ECM',
    description: 'Transition legacy infrastructure to Spring Boot microservices.',
    status: 'ACTIVE',
    priority: 'HIGH',
    manager: mockCurrentUser,
    team: mockTeams[0],
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    progress: 45,
    taskCount: 20,
    completedTaskCount: 9,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Setup Spring Security and JWT Filter',
    description: 'Implement JWT authentication provider and role-based route guards in Spring Boot.',
    status: 'TODO',
    priority: 'HIGH',
    projectId: 'proj-1',
    projectName: 'Enterprise Cloud Migration',
    assigneeId: 'usr-1',
    assigneeName: 'Admin User',
    reporterId: 'usr-1',
    reporterName: 'Admin User',
    dueDate: '2026-03-15',
    estimatedHours: 8,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-1',
    title: 'Welcome to WorkFlowX',
    message: 'Frontend workspace initialized successfully. Ready for Spring Boot backend connection.',
    type: 'SYSTEM_ALERT',
    isRead: false,
    createdAt: '2026-02-01T00:00:00Z',
  },
];
