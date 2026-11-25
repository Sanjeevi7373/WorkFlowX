import type { User } from './user';
import type { Team } from './team';

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Project {
  id: string;
  name: string;
  key?: string;
  description: string;
  manager: User;
  team: Team;
  priority: Priority;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  progress: number;
  taskCount: number;
  completedTaskCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  priority: Priority;
  startDate: string;
  endDate: string;
}
