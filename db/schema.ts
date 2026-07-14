import { mysqlTable, mysqlEnum, serial, varchar, text, timestamp, int, float, json, bigint, index, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscription_tier", ["free", "pro", "enterprise"]).default("free").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const userProfiles = mysqlTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" }),
  skills: json("skills").$type<string[]>().notNull(),
  experienceLevel: mysqlEnum("experience_level", ["beginner", "intermediate", "advanced"]).notNull().default("beginner"),
  timeAvailableHoursPerWeek: int("time_available_hours_per_week"),
  constraints: json("constraints").$type<Record<string, unknown>>(),
  targetIncomeMonthly: int("target_income_monthly"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const skills = mysqlTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  parentSkillId: bigint("parent_skill_id", { mode: "number", unsigned: true }),
  demandScore: float("demand_score").default(0).notNull(),
  supplyScore: float("supply_score").default(0).notNull(),
  avgHourlyRateUsd: float("avg_hourly_rate_usd"),
  jobCount30d: int("job_count_30d").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_skills_category").on(table.category), index("idx_skills_demand").on(table.demandScore)]);

export const skillCombinations = mysqlTable("skill_combinations", {
  id: serial("id").primaryKey(),
  skillIds: json("skill_ids").$type<number[]>().notNull(),
  combinationName: varchar("combination_name", { length: 255 }).notNull(),
  demandScore: float("demand_score").default(0).notNull(),
  supplyScore: float("supply_score").default(0).notNull(),
  arbitrageScore: float("arbitrage_score").default(0).notNull(),
  avgHourlyRateUsd: float("avg_hourly_rate_usd").notNull().default(0),
  jobCount30d: int("job_count_30d").default(0).notNull(),
  freelancerCount30d: int("freelancer_count_30d").default(0).notNull(),
  priceRangeLow: float("price_range_low").notNull().default(0),
  priceRangeHigh: float("price_range_high").notNull().default(0),
  trendDirection: mysqlEnum("trend_direction", ["rising", "stable", "falling"]).default("stable").notNull(),
  dataSources: json("data_sources").$type<string[]>(),
  lastScrapedAt: timestamp("last_scraped_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_combinations_arbitrage").on(table.arbitrageScore), index("idx_combinations_trend").on(table.trendDirection)]);

export const jobPostings = mysqlTable("job_postings", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 255 }).notNull().unique(),
  source: varchar("source", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  skills: json("skills").$type<string[]>(),
  budgetMin: float("budget_min"),
  budgetMax: float("budget_max"),
  budgetType: mysqlEnum("budget_type", ["fixed", "hourly"]),
  location: varchar("location", { length: 255 }),
  remote: boolean("remote").default(false).notNull(),
  postedAt: timestamp("posted_at"),
  url: text("url"),
  rawData: json("raw_data").$type<Record<string, unknown>>(),
  scrapedAt: timestamp("scraped_at").defaultNow().notNull(),
}, (table) => [index("idx_jobs_source").on(table.source), index("idx_jobs_scraped").on(table.scrapedAt)]);

export const recommendations = mysqlTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" }),
  skillCombinationId: bigint("skill_combination_id", { mode: "number", unsigned: true }).notNull().references(() => skillCombinations.id, { onDelete: "cascade" }),
  rank: int("rank").notNull(),
  matchScore: float("match_score").notNull(),
  projectedMonthlyIncome: float("projected_monthly_income"),
  timeToFirstIncomeDays: int("time_to_first_income_days"),
  rationale: text("rationale"),
  isSaved: boolean("is_saved").default(false).notNull(),
  isDismissed: boolean("is_dismissed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_recommendations_user").on(table.userId), index("idx_recommendations_saved").on(table.isSaved)]);

export const portfolioProjects = mysqlTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  skillCombinationId: bigint("skill_combination_id", { mode: "number", unsigned: true }).notNull().references(() => skillCombinations.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  techStack: json("tech_stack").$type<string[]>(),
  acceptanceCriteria: json("acceptance_criteria").$type<string[]>(),
  estimatedHours: int("estimated_hours"),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]),
  assetUrl: text("asset_url"),
  githubTemplateUrl: text("github_template_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const outreachTemplates = mysqlTable("outreach_templates", {
  id: serial("id").primaryKey(),
  skillCombinationId: bigint("skill_combination_id", { mode: "number", unsigned: true }).notNull().references(() => skillCombinations.id, { onDelete: "cascade" }),
  channel: mysqlEnum("channel", ["email", "linkedin_dm", "twitter_dm", "upwork_proposal"]).notNull(),
  templateBody: text("template_body").notNull(),
  subjectLine: varchar("subject_line", { length: 255 }),
  openRate: float("open_rate"),
  responseRate: float("response_rate"),
  variantName: varchar("variant_name", { length: 50 }).default("A"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const executionTasks = mysqlTable("execution_tasks", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" }),
  recommendationId: bigint("recommendation_id", { mode: "number", unsigned: true }).references(() => recommendations.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["backlog", "in_progress", "done", "blocked"]).default("backlog").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_tasks_user_status").on(table.userId, table.status)]);

export const incomeLogs = mysqlTable("income_logs", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" }),
  recommendationId: bigint("recommendation_id", { mode: "number", unsigned: true }).references(() => recommendations.id, { onDelete: "set null" }),
  amount: float("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  hoursWorked: float("hours_worked"),
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
}, (table) => [index("idx_income_user").on(table.userId)]);

export const scrapingLogs = mysqlTable("scraping_logs", {
  id: serial("id").primaryKey(),
  source: varchar("source", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["started", "success", "partial", "failed"]).notNull(),
  itemsScraped: int("items_scraped").default(0).notNull(),
  itemsInserted: int("items_inserted").default(0).notNull(),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => [index("idx_scraping_source").on(table.source)]);
