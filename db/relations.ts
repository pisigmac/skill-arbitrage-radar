import { relations } from "drizzle-orm";
import { users, userProfiles, skillCombinations, recommendations, portfolioProjects, outreachTemplates, executionTasks, incomeLogs } from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
  recommendations: many(recommendations),
  tasks: many(executionTasks),
  incomeLogs: many(incomeLogs),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const skillCombinationsRelations = relations(skillCombinations, ({ many }) => ({
  recommendations: many(recommendations),
  portfolioProjects: many(portfolioProjects),
  outreachTemplates: many(outreachTemplates),
}));

export const recommendationsRelations = relations(recommendations, ({ one, many }) => ({
  user: one(users, { fields: [recommendations.userId], references: [users.id] }),
  skillCombination: one(skillCombinations, { fields: [recommendations.skillCombinationId], references: [skillCombinations.id] }),
  tasks: many(executionTasks),
  incomeLogs: many(incomeLogs),
}));

export const portfolioProjectsRelations = relations(portfolioProjects, ({ one }) => ({
  skillCombination: one(skillCombinations, { fields: [portfolioProjects.skillCombinationId], references: [skillCombinations.id] }),
}));

export const outreachTemplatesRelations = relations(outreachTemplates, ({ one }) => ({
  skillCombination: one(skillCombinations, { fields: [outreachTemplates.skillCombinationId], references: [skillCombinations.id] }),
}));

export const executionTasksRelations = relations(executionTasks, ({ one }) => ({
  user: one(users, { fields: [executionTasks.userId], references: [users.id] }),
  recommendation: one(recommendations, { fields: [executionTasks.recommendationId], references: [recommendations.id] }),
}));

export const incomeLogsRelations = relations(incomeLogs, ({ one }) => ({
  user: one(users, { fields: [incomeLogs.userId], references: [users.id] }),
  recommendation: one(recommendations, { fields: [incomeLogs.recommendationId], references: [recommendations.id] }),
}));
