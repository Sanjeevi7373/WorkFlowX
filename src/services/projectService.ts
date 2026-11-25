
import  api  from '@/services/api';
import type { Project, CreateProjectInput, User, Team } from '@/types';

export const availableManagers: User[] = [];
export const availableTeams: Team[] = [];

interface BackendProject {
  id: number | string;
  name: string;
  description?: string | null;
  status?: string;
  priority?: string;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    id?: number | string;
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    department?: string;
  } | null;
}

const mapStatus = (status?: string): Project['status'] => {
  switch (status) {
    case 'IN_PROGRESS':
    case 'ACTIVE':
      return 'ACTIVE';
    case 'ON_HOLD':
      return 'ON_HOLD';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'CANCELLED':
      return 'CANCELLED';
    case 'DELAYED':
      return 'DELAYED';
    default:
      return 'PLANNING';
  }
};

const mapPriority = (priority?: string): Project['priority'] => {
  switch (priority) {
    case 'LOW':
    case 'HIGH':
    case 'CRITICAL':
      return priority;
    default:
      return 'MEDIUM';
  }
};

const normalizeProject = (data: BackendProject): Project => {
  const creator = data.createdBy;
  const creatorName =
    creator?.name ||
    [creator?.firstName, creator?.lastName].filter(Boolean).join(' ') ||
    creator?.email ||
    'Project Creator';

  const manager = {
    id: String(creator?.id ?? ''),
    email: creator?.email ?? '',
    firstName: creator?.firstName || creatorName,
    lastName: creator?.lastName || '',
    role: 'MANAGER',
    status: 'ACTIVE',
    department: creator?.department || 'Not specified',
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  } as User;

  const team = {
    id: '',
    name: 'Not assigned',
    description: '',
    leadId: '',
    leadName: creatorName,
    memberCount: 0,
    memberIds: [],
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  } as Team;

  return {
    id: String(data.id),
    name: data.name,
    key: `PRJ-${data.id}`,
    description: data.description || '',
    status: mapStatus(data.status),
    priority: mapPriority(data.priority),
    manager,
    team,
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    progress: data.status === 'COMPLETED' ? 100 : 0,
    taskCount: 0,
    completedTaskCount: 0,
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  };
};

class ProjectService {
  async getProjects(): Promise<Project[]> {
    const response = await api.get<BackendProject[]>('/projects');
    return response.data.map(normalizeProject);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    try {
      const response = await api.get<BackendProject>(
        `/projects/${encodeURIComponent(id)}`
      );
      return normalizeProject(response.data);
    } catch (error: unknown) {
      const status = (
        error as { response?: { status?: number } }
      )?.response?.status;

      if (status === 404) return undefined;
      throw error;
    }
  }

  async createProject(input: CreateProjectInput & {
    managerId: string;
    teamId: string;
  }): Promise<Project> {
    const response = await api.post<BackendProject>('/projects', {
      name: input.name.trim(),
      description: input.description.trim(),
      status: 'PLANNING',
      priority: input.priority,
      startDate: input.startDate,
      endDate: input.endDate,

      manager: {
        id: Number(input.managerId),
      },

      team: {
        id: Number(input.teamId),
      },
    });

    return normalizeProject(response.data);
  }
}

export const projectService = new ProjectService();
export default projectService;
