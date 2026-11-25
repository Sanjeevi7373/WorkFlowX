import type { User, UserRole } from '@/types';
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  companyName: string;
  role: UserRole;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const STORAGE_TOKEN_KEY = 'workflowx_token';
const STORAGE_USER_KEY = 'workflowx_user';

interface BackendLoginResponse {
  token: string;
}

class AuthService {

  async login(credentials: LoginCredentials): Promise<AuthResponse> {

    const response = await api.post<BackendLoginResponse>(
      '/auth/login',
      {
        email: credentials.email,
        password: credentials.password,
      }
    );

    const token = response.data.token;

    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    /*
     * The backend login currently returns only the JWT.
     * We will fetch the logged-in user's details separately
     * in the next step.
     */
    const userResponse = await api.get<User>('/users/me');

    const user = userResponse.data;

    localStorage.setItem(
      STORAGE_USER_KEY,
      JSON.stringify(user)
    );

    return {
      token,
      user,
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {

    const nameParts = data.fullName.trim().split(/\s+/);

    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';

    await api.post('/auth/register', {
      email: data.email,
      firstName,
      lastName,
      password: data.password,
      department: data.companyName,
    });

    /*
     * Registration API currently returns only a success message.
     * We will log the user in automatically after registration.
     */
    const loginResponse = await this.login({
      email: data.email,
      password: data.password,
    });

    return loginResponse;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  }

  getCurrentUser(): User | null {
    try {
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);

      if (storedUser) {
        return JSON.parse(storedUser) as User;
      }

      return null;
    } catch {
      return null;
    }
  }

  hasToken(): boolean {
    return !!localStorage.getItem(STORAGE_TOKEN_KEY);
  }
}

export const authService = new AuthService();

export default authService;