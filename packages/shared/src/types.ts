export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export type TaskStatus = 
  | 'backlog' 
  | 'in_progress' 
  | 'review' 
  | 'done' 
  | 'paused' 
  | 'failed';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  assigned_agent: string;
  estimated_hours: number | null;
  actual_hours: number | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  tags: string[];
  session_key: string | null;
  user_id: string;
}

export interface TaskCost {
  id: string;
  task_id: string;
  timestamp: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  session_key: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  assigned_agent?: string;
  estimated_hours?: number;
  tags?: string[];
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  assigned_agent?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string[];
  started_at?: string;
  completed_at?: string;
}

export interface RecordCostDTO {
  task_id: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  session_key?: string;
}

export interface AnalyticsSummary {
  today_cost: number;
  week_cost: number;
  active_tasks: number;
  completed_tasks: number;
}

export interface DailyCost {
  date: string;
  cost: number;
}

export interface PriorityCost {
  priority: Priority;
  cost: number;
}

export interface ModelUsage {
  model: string;
  total_tokens: number;
  cost: number;
  percentage: number;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface SignupDTO {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type WSEvent = 
  | { type: 'task_created'; data: Task }
  | { type: 'task_updated'; data: Task }
  | { type: 'task_moved'; data: Task }
  | { type: 'cost_recorded'; data: TaskCost };
