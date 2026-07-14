import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { incomeLogs } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const incomeRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(incomeLogs).where(eq(incomeLogs.userId, ctx.user.id)).orderBy(sql`${incomeLogs.loggedAt} DESC`);
  }),

  create: authedQuery
    .input(z.object({ amount: z.number().positive(), currency: z.string().default("USD"), source: z.string().min(1), hoursWorked: z.number().positive().optional(), recommendationId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(incomeLogs).values({ userId: ctx.user.id, recommendationId: input.recommendationId ?? null, amount: input.amount, currency: input.currency, source: input.source, hoursWorked: input.hoursWorked ?? null });
      return { id: Number(result[0].insertId), success: true };
    }),

  summary: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const logs = await db.select().from(incomeLogs).where(eq(incomeLogs.userId, ctx.user.id));
    const totalIncome = logs.reduce((sum, l) => sum + l.amount, 0);
    const totalHours = logs.reduce((sum, l) => sum + (l.hoursWorked ?? 0), 0);
    const avgHourlyRate = totalHours > 0 ? totalIncome / totalHours : 0;
    const monthlyMap = new Map<string, number>();
    for (const log of logs) { const key = new Date(log.loggedAt).toISOString().slice(0, 7); monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + log.amount); }
    const monthly = Array.from(monthlyMap.entries()).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month));
    return { totalIncome, totalHours, avgHourlyRate: Math.round(avgHourlyRate * 100) / 100, count: logs.length, monthly };
  }),

  delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(incomeLogs).where(eq(incomeLogs.id, input.id));
    return { success: true };
  }),
});
