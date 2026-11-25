export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  projectName?: string;
  assigneeId?: string;
  assigneeName?: string;
  reporterId: string;
  reporterName?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
