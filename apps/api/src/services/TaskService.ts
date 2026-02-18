import { db } from '../db/index';
import { tasks } from '../db/schema';
import { eq, and, inArray, desc, like, or } from 'drizzle-orm';
import type { CreateTaskDTO, UpdateTaskDTO, Task, TaskStatus } from '@sint-dashboard/shared';

export class TaskService {
  async createTask(userId: string, data: CreateTaskDTO): Promise<Task> {
    const [task] = await db.insert(tasks).values({
      ...data,
      user_id: userId,
      tags: JSON.stringify(data.tags || []),
    }).returning();
    
    return this.deserializeTask(task);
  }

  async getTasks(userId: string, filters?: {
    status?: TaskStatus[];
    priority?: string[];
    agent?: string;
  }): Promise<Task[]> {
    const conditions = [eq(tasks.user_id, userId)];
    
    if (filters?.status?.length) {
      conditions.push(inArray(tasks.status, filters.status));
    }
    
    if (filters?.priority?.length) {
      conditions.push(inArray(tasks.priority, filters.priority as ("P0" | "P1" | "P2" | "P3")[]));
    }
    
    if (filters?.agent) {
      conditions.push(eq(tasks.assigned_agent, filters.agent));
    }
    
    const result = await db.select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(desc(tasks.created_at));
    
    return result.map(t => this.deserializeTask(t));
  }

  async getTaskById(userId: string, taskId: string): Promise<Task | null> {
    const [task] = await db.select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)))
      .limit(1);
    
    return task ? this.deserializeTask(task) : null;
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskDTO): Promise<Task | null> {
    const updateData = {
      ...data,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
    };
    
    const [updated] = await db.update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)))
      .returning();
    
    return updated ? this.deserializeTask(updated) : null;
  }

  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    const result = await db.delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)));
    
    return result.changes > 0;
  }

  async moveTask(userId: string, taskId: string, status: TaskStatus): Promise<Task | null> {
    const updateData: any = { status };
    
    if (status === 'in_progress') {
      const task = await this.getTaskById(userId, taskId);
      if (task && !task.started_at) {
        updateData.started_at = new Date().toISOString();
      }
    }
    
    if (status === 'done') {
      updateData.completed_at = new Date().toISOString();
    }
    
    return this.updateTask(userId, taskId, updateData);
  }

  private deserializeTask(task: any): Task {
    return {
      ...task,
      tags: JSON.parse(task.tags || '[]'),
    };
  }
}
