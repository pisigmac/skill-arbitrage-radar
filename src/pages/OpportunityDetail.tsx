import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, ArrowLeft, Briefcase, Mail, CheckCircle } from "lucide-react";

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const comboId = Number(id);
  const { data: opportunity, isLoading } = trpc.arbitrage.getById.useQuery({ id: comboId });
  const { data: portfolio } = trpc.portfolio.getByCombination.useQuery({ combinationId: comboId });
  const { data: templates } = trpc.outreach.getByCombination.useQuery({ combinationId: comboId });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64" /></div>;
  if (!opportunity) return <div className="text-center py-20"><p className="text-sm text-[#1A1A1A]/60">Opportunity not found.</p><Link to="/" className="text-sm text-[#059669] hover:underline">Back to Dashboard</Link></div>;

  const TrendIcon = opportunity.trendDirection === "rising" ? TrendingUp : opportunity.trendDirection === "falling" ? TrendingDown : Minus;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="sm" className="h-7 px-2"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">{opportunity.combinationName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={opportunity.arbitrageScore >= 70 ? "bg-[#059669] text-white" : "bg-amber-500 text-white"}>Score: {opportunity.arbitrageScore.toFixed(1)}</Badge>
            <div className="flex items-center gap-1 text-xs text-[#1A1A1A]/50"><TrendIcon className={`h-3 w-3 ${opportunity.trendDirection === "rising" ? "text-[#059669]" : opportunity.trendDirection === "falling" ? "text-red-500" : ""}`} />{opportunity.trendDirection}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Avg Hourly Rate" value={`$${opportunity.avgHourlyRateUsd ?? 0}`} />
        <MetricCard label="Jobs (30d)" value={String(opportunity.jobCount30d)} />
        <MetricCard label="Competitors" value={String(opportunity.freelancerCount30d)} />
        <MetricCard label="Price Range" value={`$${opportunity.priceRangeLow ?? 0}-$${opportunity.priceRangeHigh ?? 0}`} />
      </div>

      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="bg-white border border-[#1A1A1A]/10">
          <TabsTrigger value="portfolio" className="text-xs"><Briefcase className="h-3 w-3 mr-1" />Portfolio Project</TabsTrigger>
          <TabsTrigger value="outreach" className="text-xs"><Mail className="h-3 w-3 mr-1" />Outreach Templates</TabsTrigger>
          <TabsTrigger value="jobs" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Recent Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          {portfolio ? (
            <Card className="border border-[#1A1A1A]/10 bg-white">
              <CardHeader><CardTitle className="text-base">{portfolio.title}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[#1A1A1A]/70">{portfolio.description}</p>
                {portfolio.techStack && (
                  <div>
                    <h4 className="text-xs font-semibold text-[#0F172A] mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(portfolio.techStack as string[]).map((tech) => <Badge key={tech} variant="secondary" className="text-[10px] bg-[#F5F0EB] text-[#1A1A1A]/70">{tech}</Badge>)}
                    </div>
                  </div>
                )}
                {portfolio.acceptanceCriteria && (
                  <div>
                    <h4 className="text-xs font-semibold text-[#0F172A] mb-2">Acceptance Criteria</h4>
                    <ul className="space-y-1.5">
                      {(portfolio.acceptanceCriteria as string[]).map((criterion, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#1A1A1A]/70"><CheckCircle className="h-3.5 w-3.5 text-[#059669] mt-0.5 shrink-0" />{criterion}</li>)}
                    </ul>
                  </div>
                )}
                <div className="flex items-center gap-4 pt-2 text-xs text-[#1A1A1A]/50"><span>Est. {portfolio.estimatedHours} hours</span><span className="capitalize">{portfolio.difficulty} level</span></div>
              </CardContent>
            </Card>
          ) : <p className="text-sm text-[#1A1A1A]/50">No portfolio project available.</p>}
        </TabsContent>

        <TabsContent value="outreach">
          {templates?.length ? (
            <div className="space-y-3">
              {templates.map((template) => (
                <Card key={template.id} className="border border-[#1A1A1A]/10 bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] capitalize">{template.channel.replace("_", " ")}</Badge>
                      <span className="text-[10px] text-[#1A1A1A]/40">Variant {template.variantName}</span>
                    </div>
                    {template.subjectLine && <p className="text-xs font-medium text-[#0F172A] pt-1">{template.subjectLine}</p>}
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs text-[#1A1A1A]/70 whitespace-pre-wrap bg-[#F5F0EB] p-3 rounded-md overflow-auto">{template.templateBody}</pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : <p className="text-sm text-[#1A1A1A]/50">No outreach templates available.</p>}
        </TabsContent>

        <TabsContent value="jobs">
          {opportunity.recentJobs?.length ? (
            <div className="space-y-2">
              {opportunity.recentJobs.map((job) => (
                <Card key={job.id} className="border border-[#1A1A1A]/10 bg-white">
                  <CardContent className="py-3">
                    <p className="text-sm font-medium text-[#0F172A]">{job.title}</p>
                    <p className="text-xs text-[#1A1A1A]/50 mt-0.5">{job.source} · {job.remote ? "Remote" : job.location}{job.budgetMin && ` · $${job.budgetMin}-${job.budgetMax}`}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : <p className="text-sm text-[#1A1A1A]/50">No recent job postings.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[#1A1A1A]/10 bg-white px-4 py-3"><p className="text-lg font-semibold text-[#0F172A]">{value}</p><p className="text-[10px] text-[#1A1A1A]/50">{label}</p></div>;
}
