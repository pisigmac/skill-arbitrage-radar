import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { data: opportunities, isLoading } = trpc.arbitrage.list.useQuery({ limit: 10, minArbitrageScore: 40 });
  const { data: recommendations } = trpc.arbitrage.recommend.useQuery({ limit: 5 }, { enabled: isAuthenticated });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  const displayItems = isAuthenticated && recommendations?.length
    ? recommendations.map((r) => ({ ...r.combination, rank: r.rank, matchScore: r.matchScore, rationale: r.rationale }))
    : (opportunities ?? []).map((o, i) => ({ ...o, rank: i + 1, matchScore: null, rationale: null }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          {isAuthenticated ? "Your Arbitrage Opportunities" : "Top Skill Arbitrage Opportunities"}
        </h1>
        <p className="text-sm text-[#1A1A1A]/60 max-w-2xl">
          {isAuthenticated
            ? "Personalized recommendations based on your skill profile. Higher scores mean better demand-to-supply ratios."
            : "Discover high-demand, low-supply skill combinations. Sign in to get personalized recommendations."}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Active Niches" value={opportunities?.length ?? 0} icon={<Zap className="h-4 w-4 text-[#059669]" />} />
        <StatCard label="Avg Rate" value={`$${Math.round((opportunities?.reduce((s, o) => s + (o.avgHourlyRateUsd ?? 0), 0) ?? 0) / (opportunities?.length || 1))}/hr`} icon={<Sparkles className="h-4 w-4 text-[#059669]" />} />
        <StatCard label="Data Sources" value={5} icon={<Shield className="h-4 w-4 text-[#059669]" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {displayItems.map((item) => <ArbitrageCard key={item.id} item={item} />)}
      </div>

      {!isAuthenticated && (
        <div className="flex justify-center pt-4">
          <Link to="/login"><Button className="bg-[#0F172A] hover:bg-[#0F172A]/90">Sign In for Personalized Recommendations <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#1A1A1A]/10 bg-white px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#059669]/10">{icon}</div>
      <div>
        <p className="text-lg font-semibold text-[#0F172A]">{value}</p>
        <p className="text-xs text-[#1A1A1A]/50">{label}</p>
      </div>
    </div>
  );
}

function ArbitrageCard({ item }: { item: any }) {
  const score = item.arbitrageScore;
  const scoreColor = score >= 70 ? "bg-[#059669] text-white" : score >= 50 ? "bg-amber-500 text-white" : "bg-[#1A1A1A]/10 text-[#1A1A1A]";
  const TrendIcon = item.trendDirection === "rising" ? TrendingUp : item.trendDirection === "falling" ? TrendingDown : Minus;

  return (
    <Card className="group border border-[#1A1A1A]/10 bg-white hover:border-[#059669]/30 transition-all hover:shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`text-xs ${scoreColor}`}>{score.toFixed(1)}</Badge>
              {item.rank && <span className="text-xs text-[#1A1A1A]/40">#{item.rank}</span>}
            </div>
            <h3 className="text-sm font-semibold text-[#0F172A] leading-tight">{item.combinationName}</h3>
          </div>
          <TrendIcon className={`h-4 w-4 ${item.trendDirection === "rising" ? "text-[#059669]" : item.trendDirection === "falling" ? "text-red-500" : "text-[#1A1A1A]/30"}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-[#F5F0EB] px-2 py-1.5"><p className="text-sm font-semibold text-[#0F172A]">${item.avgHourlyRateUsd ?? "—"}</p><p className="text-[10px] text-[#1A1A1A]/50">/hr avg</p></div>
          <div className="rounded-md bg-[#F5F0EB] px-2 py-1.5"><p className="text-sm font-semibold text-[#0F172A]">{item.jobCount30d}</p><p className="text-[10px] text-[#1A1A1A]/50">jobs/mo</p></div>
          <div className="rounded-md bg-[#F5F0EB] px-2 py-1.5"><p className="text-sm font-semibold text-[#0F172A]">{item.freelancerCount30d}</p><p className="text-[10px] text-[#1A1A1A]/50">competitors</p></div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2"><span className="text-[10px] w-12 text-[#1A1A1A]/50">Demand</span><div className="flex-1 h-1.5 rounded-full bg-[#F5F0EB] overflow-hidden"><div className="h-full rounded-full bg-[#059669]" style={{ width: `${item.demandScore}%` }} /></div><span className="text-[10px] w-6 text-right">{item.demandScore}</span></div>
          <div className="flex items-center gap-2"><span className="text-[10px] w-12 text-[#1A1A1A]/50">Supply</span><div className="flex-1 h-1.5 rounded-full bg-[#F5F0EB] overflow-hidden"><div className="h-full rounded-full bg-[#1A1A1A]/20" style={{ width: `${item.supplyScore}%` }} /></div><span className="text-[10px] w-6 text-right">{item.supplyScore}</span></div>
        </div>
        {(item.priceRangeLow || item.priceRangeHigh) && <p className="text-xs text-[#1A1A1A]/50">Range: ${item.priceRangeLow ?? 0} — ${item.priceRangeHigh ?? 0}/hr</p>}
        <Link to={`/opportunity/${item.id}`}><Button variant="ghost" size="sm" className="w-full h-7 text-xs text-[#059669] hover:text-[#059669] hover:bg-[#059669]/5">View Details <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
      </CardContent>
    </Card>
  );
}
