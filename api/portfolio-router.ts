import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { portfolioProjects, skillCombinations } from "@db/schema";
import { eq } from "drizzle-orm";

const PORTFOLIO_TEMPLATES: Record<number, Omit<typeof portfolioProjects.$inferInsert, "skillCombinationId">> = {
  1: {
    title: "HIPAA-Compliant FHIR Data Bridge",
    description: "Build a production-ready FHIR API gateway that connects EHR systems with third-party applications while enforcing HIPAA compliance.",
    techStack: ["Python 3.12", "FastAPI", "PostgreSQL", "Redis", "Docker", "FHIR R4", "OAuth2/OIDC"],
    acceptanceCriteria: [
      "Implements all FHIR R4 resource endpoints (Patient, Observation, Encounter)",
      "Audit logging with immutable log chain for HIPAA compliance",
      "Field-level encryption for PHI data at rest",
      "Rate limiting: 1000 req/min per API key",
      "99.9% uptime with health check endpoints",
      "Comprehensive test suite: >90% coverage",
    ],
    estimatedHours: 80,
    difficulty: "intermediate",
    githubTemplateUrl: "https://github.com/topics/fhir-api",
  },
  2: {
    title: "Real-time Trading Dashboard with Risk Analytics",
    description: "A high-performance fintech dashboard for real-time portfolio monitoring, trade execution, and risk analytics.",
    techStack: ["React 18", "TypeScript", "GraphQL", "WebSocket", "D3.js", "Node.js", "Redis Streams"],
    acceptanceCriteria: [
      "Real-time price updates via WebSocket with <50ms latency",
      "Interactive candlestick charts with 1min/5min/1hr granularity",
      "Portfolio risk metrics: VaR, Sharpe ratio, max drawdown",
      "Trade execution form with pre-trade risk checks",
      "Responsive design: works on desktop + tablet",
      "Dark mode UI with professional trading aesthetic",
    ],
    estimatedHours: 120,
    difficulty: "advanced",
    githubTemplateUrl: "https://github.com/topics/trading-dashboard",
  },
  3: {
    title: "Legal Document Intelligence Pipeline",
    description: "An NLP pipeline that ingests legal contracts, extracts key clauses, identifies risks, and generates summary reports.",
    techStack: ["Python 3.12", "spaCy", "Transformers", "FastAPI", "PostgreSQL", "Celery", "MinIO"],
    acceptanceCriteria: [
      "Extracts 20+ clause types: termination, indemnity, governing law",
      "NER model with >92% F1 on legal entities",
      "Document comparison: diff two contracts side-by-side",
      "Risk scoring: flags high-risk clauses with explanations",
      "Batch processing: 100+ documents per hour",
      "REST API with OpenAPI documentation",
    ],
    estimatedHours: 160,
    difficulty: "advanced",
    githubTemplateUrl: "https://github.com/topics/legal-nlp",
  },
};

export const portfolioRouter = createRouter({
  getByCombination: publicQuery
    .input(z.object({ combinationId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(portfolioProjects).where(eq(portfolioProjects.skillCombinationId, input.combinationId)).limit(1);
      if (existing.length) return existing[0];
      const template = PORTFOLIO_TEMPLATES[input.combinationId];
      if (!template) {
        const combo = await db.select().from(skillCombinations).where(eq(skillCombinations.id, input.combinationId)).limit(1);
        const name = combo[0]?.combinationName ?? "Custom Project";
        return generateFallbackPortfolio(input.combinationId, name);
      }
      const result = await db.insert(portfolioProjects).values({ skillCombinationId: input.combinationId, ...template });
      return db.select().from(portfolioProjects).where(eq(portfolioProjects.id, Number(result[0].insertId))).limit(1).then((r) => r[0]);
    }),

  generate: authedQuery
    .input(z.object({ combinationId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(portfolioProjects).where(eq(portfolioProjects.skillCombinationId, input.combinationId)).limit(1);
      if (existing.length) return existing[0];
      const template = PORTFOLIO_TEMPLATES[input.combinationId] ?? generateFallbackTemplate("");
      const result = await db.insert(portfolioProjects).values({ skillCombinationId: input.combinationId, ...template });
      return db.select().from(portfolioProjects).where(eq(portfolioProjects.id, Number(result[0].insertId))).limit(1).then((r) => r[0]);
    }),
});

function generateFallbackPortfolio(combinationId: number, combinationName: string): typeof portfolioProjects.$inferSelect {
  return { id: 0, skillCombinationId: combinationId, title: `${combinationName} Portfolio Project`, description: `A production-grade portfolio project demonstrating ${combinationName} expertise.`, techStack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker"], acceptanceCriteria: ["Clean codebase", "Comprehensive tests", "Production-ready deployment config", "README with setup instructions"], estimatedHours: 60, difficulty: "intermediate", assetUrl: null, githubTemplateUrl: null, createdAt: new Date() };
}

function generateFallbackTemplate(combinationName: string): Omit<typeof portfolioProjects.$inferInsert, "skillCombinationId"> {
  return { title: `${combinationName} Showcase Platform`, description: `Build a full-stack application demonstrating mastery of ${combinationName}.`, techStack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"], acceptanceCriteria: ["End-to-end features", "Authentication", "Database design", "API documentation", "CI/CD pipeline"], estimatedHours: 80, difficulty: "intermediate", githubTemplateUrl: null };
}
