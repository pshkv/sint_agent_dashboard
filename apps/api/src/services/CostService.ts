import { db } from '../db/index';
import { task_costs, tasks } from '../db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import type { RecordCostDTO, TaskCost, AnalyticsSummary, DailyCost, PriorityCost, ModelUsage } from '@sint-dashboard/shared';

export class CostService {
  async recordCost(data: RecordCostDTO): Promise<TaskCost> {
    const [cost] = await db.insert(task_costs).values(data).returning();
    return cost as TaskCost;
  }

  async getSummary(userId: string): Promise<AnalyticsSummary> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Today's cost
    const todayCostResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${task_costs.cost_usd}), 0)` })
      .from(task_costs)
      .innerJoin(tasks, eq(task_costs.task_id, tasks.id))
      .where(and(
        eq(tasks.user_id, userId),
        gte(task_costs.timestamp, today.toISOString())
      ));

    // Week's cost
    const weekCostResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${task_costs.cost_usd}), 0)` })
      .from(task_costs)
      .innerJoin(tasks, eq(task_costs.task_id, tasks.id))
      .where(and(
        eq(tasks.user_id, userId),
        gte(task_costs.timestamp, weekAgo.toISOString())
      ));

    // Active tasks
    const activeTasks = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(tasks)
      .where(and(
        eq(tasks.user_id, userId),
        eq(tasks.status, 'in_progress')
      ));

    // Completed tasks
    const completedTasks = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(tasks)
      .where(and(
        eq(tasks.user_id, userId),
        eq(tasks.status, 'done')
      ));

    return {
      today_cost: Number(todayCostResult[0]?.total || 0),
      week_cost: Number(weekCostResult[0]?.total || 0),
      active_tasks: Number(activeTasks[0]?.count || 0),
      completed_tasks: Number(completedTasks[0]?.count || 0),
    };
  }

  async getDailyCosts(userId: string, days: number = 7): Promise<DailyCost[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        date: sql<string>`DATE(${task_costs.timestamp})`,
        cost: sql<number>`COALESCE(SUM(${task_costs.cost_usd}), 0)`,
      })
      .from(task_costs)
      .innerJoin(tasks, eq(task_costs.task_id, tasks.id))
      .where(and(
        eq(tasks.user_id, userId),
        gte(task_costs.timestamp, startDate.toISOString())
      ))
      .groupBy(sql`DATE(${task_costs.timestamp})`)
      .orderBy(sql`DATE(${task_costs.timestamp})`);

    return result.map(r => ({
      date: r.date,
      cost: Number(r.cost),
    }));
  }

  async getCostsByPriority(userId: string): Promise<PriorityCost[]> {
    const result = await db
      .select({
        priority: tasks.priority,
        cost: sql<number>`COALESCE(SUM(${task_costs.cost_usd}), 0)`,
      })
      .from(task_costs)
      .innerJoin(tasks, eq(task_costs.task_id, tasks.id))
      .where(eq(tasks.user_id, userId))
      .groupBy(tasks.priority);

    return result.map(r => ({
      priority: r.priority as any,
      cost: Number(r.cost),
    }));
  }

  async getModelUsage(userId: string): Promise<ModelUsage[]> {
    const result = await db
      .select({
        model: task_costs.model,
        total_tokens: sql<number>`SUM(${task_costs.input_tokens} + ${task_costs.output_tokens})`,
        cost: sql<number>`COALESCE(SUM(${task_costs.cost_usd}), 0)`,
      })
      .from(task_costs)
      .innerJoin(tasks, eq(task_costs.task_id, tasks.id))
      .where(eq(tasks.user_id, userId))
      .groupBy(task_costs.model);

    const totalCost = result.reduce((sum, r) => sum + Number(r.cost), 0);

    return result.map(r => ({
      model: r.model,
      total_tokens: Number(r.total_tokens),
      cost: Number(r.cost),
      percentage: totalCost > 0 ? (Number(r.cost) / totalCost) * 100 : 0,
    }));
  }
}
