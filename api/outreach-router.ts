import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { outreachTemplates, skillCombinations } from "@db/schema";
import { eq } from "drizzle-orm";

const TEMPLATES: Record<number, Array<Omit<typeof outreachTemplates.$inferInsert, "skillCombinationId">>> = {
  1: [
    { channel: "email", subjectLine: "Quick question about your FHIR integration", templateBody: `Subject: Quick question about your FHIR integration\n\nHi {{name}},\n\nI noticed {{company}} is expanding its digital health platform. Most teams struggle connecting legacy EHR data to modern apps while staying HIPAA-compliant.\n\nI built a FHIR R4 gateway that handles exactly this. Recent client saw a 60% reduction in integration time.\n\nWorth a 10-minute chat this week?\n\nBest,\n{{sender_name}}`, variantName: "A" },
    { channel: "linkedin_dm", subjectLine: null, templateBody: `Hi {{name}}, saw {{company}} is hiring for healthcare API work. I specialize in FHIR integrations with HIPAA compliance — just helped a clinic chain cut their EHR connection time by 60%.\n\nAny interest in seeing a quick demo?`, variantName: "B" },
  ],
  2: [
    { channel: "email", subjectLine: "Your trading infra — one gap costing you latency", templateBody: `Subject: Your trading infra — one gap costing you latency\n\nHi {{name}},\n\nHigh-frequency trading teams lose money on sub-100ms delays. I've built real-time GraphQL subscriptions over WebSocket that process 10K+ events/sec with <50ms p99 latency.\n\nBuilt for a fintech that needed live risk analytics. Cut their data lag from 2 seconds to 40ms.\n\nHappy to share the architecture doc — want me to send it over?\n\n{{sender_name}}`, variantName: "A" },
    { channel: "upwork_proposal", subjectLine: null, templateBody: `Hi there,\n\nI saw your posting for a real-time fintech dashboard. This is exactly my niche — I specialize in React + GraphQL + WebSocket stacks for financial data.\n\nRecent work: Built a trading dashboard processing 10K events/sec with sub-50ms latency. The client saw 3x faster trade execution decisions.\n\nReady to start Monday. Let's discuss your specific requirements.\n\n— {{sender_name}}`, variantName: "B" },
  ],
};

export const outreachRouter = createRouter({
  getByCombination: publicQuery
    .input(z.object({ combinationId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(outreachTemplates).where(eq(outreachTemplates.skillCombinationId, input.combinationId));
      if (existing.length) return existing;
      const combo = await db.select().from(skillCombinations).where(eq(skillCombinations.id, input.combinationId)).limit(1);
      const templates = TEMPLATES[input.combinationId] ?? generateFallbackTemplates(combo[0]?.combinationName ?? "");
      for (const t of templates) {
        await db.insert(outreachTemplates).values({ skillCombinationId: input.combinationId, ...t });
      }
      return db.select().from(outreachTemplates).where(eq(outreachTemplates.skillCombinationId, input.combinationId));
    }),

  trackOpen: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    const existing = await db.select().from(outreachTemplates).where(eq(outreachTemplates.id, input.id)).limit(1);
    if (!existing.length) return { success: false };
    const current = existing[0].openRate ?? 0;
    await db.update(outreachTemplates).set({ openRate: Math.min(100, current + 1) }).where(eq(outreachTemplates.id, input.id));
    return { success: true };
  }),

  trackResponse: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    const existing = await db.select().from(outreachTemplates).where(eq(outreachTemplates.id, input.id)).limit(1);
    if (!existing.length) return { success: false };
    const current = existing[0].responseRate ?? 0;
    await db.update(outreachTemplates).set({ responseRate: Math.min(100, current + 1) }).where(eq(outreachTemplates.id, input.id));
    return { success: true };
  }),
});

function generateFallbackTemplates(combinationName: string): Array<Omit<typeof outreachTemplates.$inferInsert, "skillCombinationId">> {
  return [
    { channel: "email", subjectLine: `Quick question about your ${combinationName} needs`, templateBody: `Hi {{name}},\n\nI specialize in ${combinationName} — noticed {{company}} is growing in this area.\n\nI recently helped a similar company solve their core challenges, saving them 40% on development costs.\n\nWorth a quick 10-minute call to see if there's a fit?\n\nBest,\n{{sender_name}}`, variantName: "A" },
    { channel: "linkedin_dm", subjectLine: null, templateBody: `Hi {{name}}, I saw {{company}} is working on ${combinationName} projects. That's exactly what I do — helped a similar company cut costs by 40%.\n\nMind if I share a quick case study?`, variantName: "B" },
  ];
}
