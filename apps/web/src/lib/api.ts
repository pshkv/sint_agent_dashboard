import type { 
  Task, 
  CreateTaskDTO, 
  UpdateTaskDTO, 
  TaskStatus,
  LoginDTO,
  SignupDTO,
  AuthResponse,
  User,
  AnalyticsSummary,
  DailyCost,
  PriorityCost,
  ModelUsage
} from '@sint-dashboard/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let authToken: string | null = localStorage.getItem('auth_token');

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('auth_token');
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Auth
export const api = {
  auth: {
    login: (data: LoginDTO) => 
      fetchAPI('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }) as Promise<AuthResponse>,
    
    signup: (data: SignupDTO) => 
      fetchAPI('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }) as Promise<AuthResponse>,
    
    me: () => 
      fetchAPI('/api/auth/me') as Promise<User>,
  },

  // Tasks
  tasks: {
    list: (filters?: { status?: TaskStatus[]; priority?: string[]; agent?: string }) => {
      const params = new URLSearchParams();
      if (filters?.status) filters.status.forEach(s => params.append('status', s));
      if (filters?.priority) filters.priority.forEach(p => params.append('priority', p));
      if (filters?.agent) params.append('agent', filters.agent);
      
      const query = params.toString();
      return fetchAPI(`/api/tasks${query ? `?${query}` : ''}`) as Promise<Task[]>;
    },
    
    create: (data: CreateTaskDTO) => 
      fetchAPI('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }) as Promise<Task>,
    
    get: (id: string) => 
      fetchAPI(`/api/tasks/${id}`) as Promise<Task>,
    
    update: (id: string, data: UpdateTaskDTO) => 
      fetchAPI(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }) as Promise<Task>,
    
    delete: (id: string) => 
      fetchAPI(`/api/tasks/${id}`, { method: 'DELETE' }),
    
    move: (id: string, status: TaskStatus) => 
      fetchAPI(`/api/tasks/${id}/move`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      }) as Promise<Task>,
  },

  // Analytics
  analytics: {
    summary: () => 
      fetchAPI('/api/analytics/summary') as Promise<AnalyticsSummary>,
    
    daily: (days: number = 7) => 
      fetchAPI(`/api/analytics/daily?days=${days}`) as Promise<DailyCost[]>,
    
    byPriority: () => 
      fetchAPI('/api/analytics/by-priority') as Promise<PriorityCost[]>,
    
    byModel: () => 
      fetchAPI('/api/analytics/by-model') as Promise<ModelUsage[]>,
  },
};
