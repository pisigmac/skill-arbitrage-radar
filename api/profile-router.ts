import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { userProfiles } from "@db/schema";
import { eq } from "drizzle-orm";

export const profileRouter = createRouter({
  get: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
    return rows[0] ?? null;
  }),

  upsert: authedQuery
    .input(
      z.object({
        skills: z.array(z.string()).min(1, "At least one skill required"),
        experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
        timeAvailableHoursPerWeek: z.number().min(1).max(168).optional(),
        constraints: z.record(z.unknown()).optional(),
        targetIncomeMonthly: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      const existing = rows[0];

      if (existing) {
        await db
          .update(userProfiles)
          .set({
            skills: input.skills,
            experienceLevel: input.experienceLevel,
            timeAvailableHoursPerWeek: input.timeAvailableHoursPerWeek ?? null,
            constraints: input.constraints ?? {},
            targetIncomeMonthly: input.targetIncomeMonthly ?? null,
          })
          .where(eq(userProfiles.id, existing.id));
        return { ...existing, ...input };
      }

      await db.insert(userProfiles).values({
        userId: ctx.user.id,
        skills: input.skills,
        experienceLevel: input.experienceLevel,
        timeAvailableHoursPerWeek: input.timeAvailableHoursPerWeek ?? null,
        constraints: input.constraints ?? {},
        targetIncomeMonthly: input.targetIncomeMonthly ?? null,
      });

      const newRows = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      return newRows[0];
    }),
});
