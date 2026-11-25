export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  phone?: string;
  location?: string;
  bio?: string;
  title?: string;
}
