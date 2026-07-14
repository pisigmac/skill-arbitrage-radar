import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { executionTasks } from "@db/schema";
import { eq, and } from "drizzle-orm";

const DEFAULT_TASKS = [
  { title: "Set up development environment", description: "Install required tools, create project repo, configure CI/CD", priority: "high" as const },
  { title: "Complete skill assessment", description: "Identify gaps between current skills and target niche requirements", priority: "high" as const },
  { title: "Study niche-specific documentation", description: "Read industry standards, compliance requirements, best practices", priority: "high" as const },
  { title: "Build portfolio project MVP", description: "Complete core features of the portfolio project", priority: "high" as const },
  { title: "Write comprehensive README", description: "Document setup, architecture, and key decisions", priority: "medium" as const },
  { title: "Deploy portfolio project", description: "Host on Vercel/Netlify/AWS with custom domain", priority: "medium" as const },
  { title: "Create case study blog post", description: "Write about the problem, solution, and results", priority: "medium" as const },
  { title: "Optimize LinkedIn profile", description: "Update headline, summary, and featured sections", priority: "medium" as const },
  { title: "Send 10 outreach messages", description: "Use templates to contact potential clients", priority: "high" as const },
  { title: "Schedule 2 informational interviews", description: "Talk to people already working in the niche", priority: "medium" as const },
  { title: "Join niche community/Slack/Discord", description: "Engage with professionals in the target space", priority: "low" as const },
  { title: "Set up income tracking spreadsheet", description: "Prepare system to log earnings and hours", priority: "low" as const },
  { title: "Follow up on outreach (Day 3)", description: "Send follow-up to non-responders", priority: "high" as const },
  { title: "Complete portfolio polish", description: "Add animations, responsive design, accessibility", priority: "medium" as const },
  { title: "Second follow-up (Day 7)", description: "Final follow-up with value-add content", priority: "medium" as const },
];

export const executionRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(executionTasks).where(eq(executionTasks.userId, ctx.user.id)).orderBy(executionTasks.createdAt);
  }),

  create: authedQuery
    .input(z.object({ title: z.string().min(1).max(255), description: z.string().optional(), priority: z.enum(["low", "medium", "high", "critical"]).default("medium"), recommendationId: z.number().optional(), dueDate: z.string().datetime().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(executionTasks).values({ userId: ctx.user.id, recommendationId: input.recommendationId ?? null, title: input.title, description: input.description ?? null, priority: input.priority, dueDate: input.dueDate ? new Date(input.dueDate) : null });
      return { id: Number(result[0].insertId), success: true };
    }),

  updateStatus: authedQuery
    .input(z.object({ id: z.number(), status: z.enum(["backlog", "in_progress", "done", "blocked"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const updates: Record<string, unknown> = { status: input.status };
      if (input.status === "done") updates.completedAt = new Date();
      await db.update(executionTasks).set(updates).where(and(eq(executionTasks.id, input.id), eq(executionTasks.userId, ctx.user.id)));
      return { success: true };
    }),

  delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    await db.delete(executionTasks).where(and(eq(executionTasks.id, input.id), eq(executionTasks.userId, ctx.user.id)));
    return { success: true };
  }),

  initDefaults: authedQuery.input(z.object({ recommendationId: z.number() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const existing = await db.select().from(executionTasks).where(and(eq(executionTasks.userId, ctx.user.id), eq(executionTasks.recommendationId, input.recommendationId)));
    if (existing.length) return { created: 0, message: "Tasks already exist" };
    let count = 0;
    for (const task of DEFAULT_TASKS) {
      await db.insert(executionTasks).values({ userId: ctx.user.id, recommendationId: input.recommendationId, title: task.title, description: task.description, priority: task.priority, status: "backlog" });
      count++;
    }
    return { created: count, message: `${count} default tasks created` };
  }),
});
