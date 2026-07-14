import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  skillCombinations,
  recommendations,
  skills,
  jobPostings,
  userProfiles,
} from "@db/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";

const MOCK_COMBINATIONS = [
  {
    combinationName: "Python + Healthcare Compliance APIs",
    skillIds: [1, 2],
    demandScore: 87,
    supplyScore: 23,
    arbitrageScore: 61.4,
    avgHourlyRateUsd: 180,
    jobCount30d: 47,
    freelancerCount30d: 4,
    priceRangeLow: 140,
    priceRangeHigh: 220,
    trendDirection: "rising" as const,
    dataSources: ["upwork", "linkedin"],
  },
  {
    combinationName: "React + Fintech + GraphQL",
    skillIds: [3, 4, 5],
    demandScore: 92,
    supplyScore: 41,
    arbitrageScore: 71.6,
    avgHourlyRateUsd: 165,
    jobCount30d: 83,
    freelancerCount30d: 18,
    priceRangeLow: 130,
    priceRangeHigh: 200,
    trendDirection: "rising" as const,
    dataSources: ["upwork", "indeed"],
  },
  {
    combinationName: "AI/ML + LegalTech NLP",
    skillIds: [6, 7],
    demandScore: 78,
    supplyScore: 15,
    arbitrageScore: 52.8,
    avgHourlyRateUsd: 210,
    jobCount30d: 32,
    freelancerCount30d: 3,
    priceRangeLow: 175,
    priceRangeHigh: 250,
    trendDirection: "rising" as const,
    dataSources: ["linkedin", "indeed"],
  },
  {
    combinationName: "Rust + Systems Programming + DevOps",
    skillIds: [8, 9],
    demandScore: 72,
    supplyScore: 19,
    arbitrageScore: 50.8,
    avgHourlyRateUsd: 195,
    jobCount30d: 28,
    freelancerCount30d: 5,
    priceRangeLow: 160,
    priceRangeHigh: 230,
    trendDirection: "stable" as const,
    dataSources: ["upwork", "fiverr"],
  },
  {
    combinationName: "Next.js + E-commerce + Stripe",
    skillIds: [3, 10, 11],
    demandScore: 85,
    supplyScore: 55,
    arbitrageScore: 73,
    avgHourlyRateUsd: 140,
    jobCount30d: 112,
    freelancerCount30d: 42,
    priceRangeLow: 110,
    priceRangeHigh: 170,
    trendDirection: "rising" as const,
    dataSources: ["upwork", "fiverr", "linkedin"],
  },
  {
    combinationName: "Svelte + D3.js + Data Visualization",
    skillIds: [12, 13],
    demandScore: 65,
    supplyScore: 12,
    arbitrageScore: 43.8,
    avgHourlyRateUsd: 175,
    jobCount30d: 24,
    freelancerCount30d: 3,
    priceRangeLow: 140,
    priceRangeHigh: 210,
    trendDirection: "rising" as const,
    dataSources: ["upwork", "indeed"],
  },
  {
    combinationName: "Go + Microservices + Kubernetes",
    skillIds: [14, 9],
    demandScore: 90,
    supplyScore: 38,
    arbitrageScore: 69.2,
    avgHourlyRateUsd: 185,
    jobCount30d: 67,
    freelancerCount30d: 15,
    priceRangeLow: 150,
    priceRangeHigh: 220,
    trendDirection: "stable" as const,
    dataSources: ["linkedin", "indeed"],
  },
  {
    combinationName: "TypeScript + WebRTC + Real-time Systems",
    skillIds: [15, 16],
    demandScore: 70,
    supplyScore: 14,
    arbitrageScore: 47.6,
    avgHourlyRateUsd: 200,
    jobCount30d: 21,
    freelancerCount30d: 2,
    priceRangeLow: 170,
    priceRangeHigh: 240,
    trendDirection: "rising" as const,
    dataSources: ["upwork"],
  },
  {
    combinationName: "Python + MLOps + AWS SageMaker",
    skillIds: [1, 17, 18],
    demandScore: 82,
    supplyScore: 29,
    arbitrageScore: 60.8,
    avgHourlyRateUsd: 190,
    jobCount30d: 55,
    freelancerCount30d: 9,
    priceRangeLow: 155,
    priceRangeHigh: 225,
    trendDirection: "rising" as const,
    dataSources: ["linkedin", "indeed"],
  },
  {
    combinationName: "Solidity + DeFi + Security Audits",
    skillIds: [19, 20],
    demandScore: 68,
    supplyScore: 21,
    arbitrageScore: 49.2,
    avgHourlyRateUsd: 225,
    jobCount30d: 19,
    freelancerCount30d: 4,
    priceRangeLow: 190,
    priceRangeHigh: 280,
    trendDirection: "falling" as const,
    dataSources: ["upwork", "fiverr"],
  },
];

export const arbitrageRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(10),
          minArbitrageScore: z.number().min(0).max(100).default(40),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 10;
      const minScore = input?.minArbitrageScore ?? 40;
      await ensureSeedData(db);
      const results = await db
        .select()
        .from(skillCombinations)
        .where(gte(skillCombinations.arbitrageScore, minScore))
        .orderBy(desc(skillCombinations.arbitrageScore))
        .limit(limit);
      return results;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      await ensureSeedData(db);
      const combo = await db.select().from(skillCombinations).where(eq(skillCombinations.id, input.id)).limit(1);
      if (!combo.length) return null;
      const skillIds: number[] = (combo[0].skillIds as number[]) ?? [];
      const skillList = skillIds.length
        ? await db.select().from(skills).where(sql`${skills.id} IN (${skillIds.join(",")})`)
        : [];
      const jobs = await db.select().from(jobPostings).where(eq(jobPostings.source, "upwork")).limit(5);
      return { ...combo[0], skills: skillList, recentJobs: jobs };
    }),

  recommend: authedQuery
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const limit = input?.limit ?? 5;
      await ensureSeedData(db);
      const profileRows = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      const profile = profileRows[0];
      const topCombos = await db.select().from(skillCombinations).orderBy(desc(skillCombinations.arbitrageScore)).limit(limit);
      await db.delete(recommendations).where(eq(recommendations.userId, ctx.user.id));
      const results = [];
      for (let i = 0; i < topCombos.length; i++) {
        const combo = topCombos[i];
        const userSkills: string[] = (profile?.skills as string[]) ?? [];
        const matchScore = calculateMatchScore(userSkills, combo.combinationName);
        const rationale = generateRationale(combo, matchScore);
        await db.insert(recommendations).values({
          userId: ctx.user.id,
          skillCombinationId: combo.id,
          rank: i + 1,
          matchScore,
          projectedMonthlyIncome: combo.avgHourlyRateUsd ? combo.avgHourlyRateUsd * 160 : null,
          timeToFirstIncomeDays: Math.round((100 - matchScore) / 5),
          rationale,
        });
        results.push({ rank: i + 1, matchScore, projectedMonthlyIncome: combo.avgHourlyRateUsd ? combo.avgHourlyRateUsd * 160 : null, timeToFirstIncomeDays: Math.round((100 - matchScore) / 5), rationale, combination: combo });
      }
      return results;
    }),

  save: authedQuery.input(z.object({ id: z.number(), save: z.boolean() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    await db.update(recommendations).set({ isSaved: input.save }).where(and(eq(recommendations.id, input.id), eq(recommendations.userId, ctx.user.id)));
    return { success: true };
  }),

  dismiss: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    await db.update(recommendations).set({ isDismissed: true }).where(and(eq(recommendations.id, input.id), eq(recommendations.userId, ctx.user.id)));
    return { success: true };
  }),

  saved: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(recommendations).where(and(eq(recommendations.userId, ctx.user.id), eq(recommendations.isSaved, true))).orderBy(recommendations.rank);
  }),
});

async function ensureSeedData(db: ReturnType<typeof getDb>) {
  const existing = await db.select({ count: sql<number>`count(*)` }).from(skillCombinations);
  if (existing[0].count > 0) return;
  const skillData = [
    { name: "Python", category: "programming", demandScore: 95, supplyScore: 70, avgHourlyRateUsd: 75, jobCount30d: 1200 },
    { name: "Healthcare Compliance APIs", category: "compliance", demandScore: 45, supplyScore: 8, avgHourlyRateUsd: 180, jobCount30d: 47 },
    { name: "React", category: "programming", demandScore: 93, supplyScore: 72, avgHourlyRateUsd: 70, jobCount30d: 1500 },
    { name: "Fintech", category: "domain", demandScore: 70, supplyScore: 30, avgHourlyRateUsd: 150, jobCount30d: 200 },
    { name: "GraphQL", category: "programming", demandScore: 65, supplyScore: 25, avgHourlyRateUsd: 85, jobCount30d: 180 },
    { name: "AI/ML", category: "programming", demandScore: 88, supplyScore: 45, avgHourlyRateUsd: 120, jobCount30d: 800 },
    { name: "LegalTech NLP", category: "domain", demandScore: 40, supplyScore: 5, avgHourlyRateUsd: 200, jobCount30d: 32 },
    { name: "Rust", category: "programming", demandScore: 60, supplyScore: 12, avgHourlyRateUsd: 130, jobCount30d: 90 },
    { name: "DevOps", category: "infrastructure", demandScore: 85, supplyScore: 55, avgHourlyRateUsd: 95, jobCount30d: 600 },
    { name: "E-commerce", category: "domain", demandScore: 80, supplyScore: 60, avgHourlyRateUsd: 85, jobCount30d: 400 },
    { name: "Stripe", category: "integration", demandScore: 55, supplyScore: 20, avgHourlyRateUsd: 110, jobCount30d: 150 },
    { name: "Svelte", category: "programming", demandScore: 45, supplyScore: 10, avgHourlyRateUsd: 100, jobCount30d: 70 },
    { name: "D3.js", category: "programming", demandScore: 40, supplyScore: 8, avgHourlyRateUsd: 115, jobCount30d: 50 },
    { name: "Go", category: "programming", demandScore: 78, supplyScore: 35, avgHourlyRateUsd: 120, jobCount30d: 350 },
    { name: "TypeScript", category: "programming", demandScore: 92, supplyScore: 68, avgHourlyRateUsd: 72, jobCount30d: 1400 },
    { name: "WebRTC", category: "programming", demandScore: 38, supplyScore: 6, avgHourlyRateUsd: 160, jobCount30d: 30 },
    { name: "MLOps", category: "infrastructure", demandScore: 65, supplyScore: 15, avgHourlyRateUsd: 140, jobCount30d: 120 },
    { name: "AWS SageMaker", category: "cloud", demandScore: 50, supplyScore: 12, avgHourlyRateUsd: 135, jobCount30d: 80 },
    { name: "Solidity", category: "programming", demandScore: 50, supplyScore: 18, avgHourlyRateUsd: 180, jobCount30d: 60 },
    { name: "DeFi", category: "domain", demandScore: 42, supplyScore: 10, avgHourlyRateUsd: 220, jobCount30d: 25 },
  ];
  for (const s of skillData) await db.insert(skills).values(s);
  for (const combo of MOCK_COMBINATIONS) await db.insert(skillCombinations).values(combo);
  const jobData = [
    { externalId: "upwork-001", source: "upwork", title: "Healthcare API Integration Specialist", skills: ["Python", "Healthcare Compliance APIs"], budgetMin: 5000, budgetMax: 12000, budgetType: "fixed" as const, remote: true },
    { externalId: "upwork-002", source: "upwork", title: "Fintech Frontend Developer (React/GraphQL)", skills: ["React", "Fintech", "GraphQL"], budgetMin: 75, budgetMax: 150, budgetType: "hourly" as const, remote: true },
    { externalId: "li-001", source: "linkedin", title: "Senior AI/ML Engineer - LegalTech", skills: ["AI/ML", "LegalTech NLP"], budgetMin: 160000, budgetMax: 220000, budgetType: "fixed" as const, remote: true },
    { externalId: "li-002", source: "linkedin", title: "Rust Systems Engineer", skills: ["Rust", "DevOps"], budgetMin: 140000, budgetMax: 190000, budgetType: "fixed" as const, remote: true },
    { externalId: "upwork-003", source: "upwork", title: "Next.js E-commerce Developer", skills: ["React", "E-commerce", "Stripe"], budgetMin: 3000, budgetMax: 8000, budgetType: "fixed" as const, remote: true },
  ];
  for (const job of jobData) {
    await db.insert(jobPostings).values({ ...job, description: `Looking for an experienced ${job.title}.`, location: "Remote" });
  }
}

function calculateMatchScore(userSkills: string[], combinationName: string): number {
  if (!userSkills.length) return 50;
  const comboLower = combinationName.toLowerCase();
  const matches = userSkills.filter((s) => comboLower.includes(s.toLowerCase()));
  return Math.min(95, 40 + matches.length * 20);
}

function generateRationale(
  combo: { combinationName: string; demandScore: number; supplyScore: number; avgHourlyRateUsd: number | null; jobCount30d: number; freelancerCount30d: number; trendDirection: string; priceRangeLow: number | null; priceRangeHigh: number | null },
  matchScore: number
): string {
  const rate = combo.avgHourlyRateUsd ?? 0;
  return `This ${combo.combinationName} niche shows exceptional arbitrage potential with a demand score of ${combo.demandScore}/100 against only ${combo.supplyScore}/100 supply competition. At $${rate}/hr, it pays ${rate > 0 ? Math.round((rate / 75) * 100) / 100 : 0}x the average developer rate. ${combo.jobCount30d} jobs posted in the last 30 days with only ${combo.freelancerCount30d} active freelancers creates a severe supply shortage. The trend is ${combo.trendDirection}, indicating growing demand. Your skill match score of ${matchScore}/100 suggests ${matchScore > 70 ? "strong" : matchScore > 50 ? "moderate" : "developing"} alignment with this niche.`;
}
