import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Radar, TrendingUp, Target, Mail, Kanban, DollarSign, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: opportunities, isLoading } = trpc.arbitrage.list.useQuery({ limit: 6, minArbitrageScore: 50 });

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4 py-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#059669]/10">
            <Radar className="h-6 w-6 text-[#059669]" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">Turn Skills Into Income</h1>
        <p className="text-sm text-[#1A1A1A]/60 max-w-lg mx-auto leading-relaxed">
          Skill Arbitrage Radar identifies high-demand, low-supply skill combinations across freelance marketplaces. Stop guessing. Start earning.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <Link to="/dashboard"><Button className="bg-[#0F172A] hover:bg-[#0F172A]/90 h-9 px-5">View Opportunities <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          ) : (
            <>
              <Link to="/login"><Button className="bg-[#0F172A] hover:bg-[#0F172A]/90 h-9 px-5">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/dashboard"><Button variant="outline" className="h-9 px-5">Browse Public Data</Button></Link>
            </>
          )}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard icon={<Target className="h-5 w-5 text-[#059669]" />} title="Arbitrage Engine" description="Find skill combinations with the highest demand-to-supply ratio. Data-driven recommendations, not guesswork." />
        <FeatureCard icon={<BarChart3 className="h-5 w-5 text-[#059669]" />} title="Live Market Data" description="Real-time scraping from Upwork, Fiverr, LinkedIn, and Indeed. Fresh data updated every 4-8 hours." />
        <FeatureCard icon={<Zap className="h-5 w-5 text-[#059669]" />} title="Portfolio Generator" description="Get specific, buildable portfolio projects tailored to each arbitrage niche. Includes tech stack and acceptance criteria." />
        <FeatureCard icon={<Mail className="h-5 w-5 text-[#059669]" />} title="Outreach System" description="Pre-written cold email and LinkedIn templates with A/B variants. Track open rates and responses." />
        <FeatureCard icon={<Kanban className="h-5 w-5 text-[#059669]" />} title="Execution Kanban" description="Task board with pre-populated Day 1-30 plans. Drag, drop, and track your progress to first income." />
        <FeatureCard icon={<DollarSign className="h-5 w-5 text-[#059669]" />} title="Income Tracker" description="Log actual earnings and compare against projections. Monthly reports show what's heating up." />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A]">Top Arbitrage Opportunities</h2>
          <Link to="/dashboard" className="text-xs text-[#059669] hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
        </div>
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {opportunities?.slice(0, 4).map((item) => (
              <Card key={item.id} className="border border-[#1A1A1A]/10 bg-white hover:border-[#059669]/30 transition-all">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-[#059669] text-white text-[10px]">{item.arbitrageScore.toFixed(1)}</Badge>
                      <h3 className="text-sm font-semibold text-[#0F172A] mt-1.5">{item.combinationName}</h3>
                    </div>
                    <TrendingUp className="h-4 w-4 text-[#059669]" />
                  </div>
                  <div className="flex gap-4 text-xs text-[#1A1A1A]/60">
                    <span>${item.avgHourlyRateUsd ?? 0}/hr</span>
                    <span>{item.jobCount30d} jobs/mo</span>
                    <span>{item.freelancerCount30d} competitors</span>
                  </div>
                  <Link to={`/opportunity/${item.id}`}><Button variant="ghost" size="sm" className="w-full h-7 text-xs text-[#059669] hover:bg-[#059669]/5">View Details <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0F172A] text-center">How It Works</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step: "1", label: "Set Your Skills", desc: "Tell us what you know and your experience level" },
            { step: "2", label: "Discover Arbitrage", desc: "We find high-demand, low-supply niches for you" },
            { step: "3", label: "Build Portfolio", desc: "Follow our project specs to create proof of work" },
            { step: "4", label: "Land Clients", desc: "Use our outreach templates and track earnings" },
          ].map((s) => (
            <div key={s.step} className="text-center space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F172A] text-white text-xs font-bold mx-auto">{s.step}</div>
              <p className="text-sm font-medium text-[#0F172A]">{s.label}</p>
              <p className="text-[11px] text-[#1A1A1A]/50 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#1A1A1A]/10 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-[#059669]" />
            <span className="text-xs text-[#1A1A1A]/60">Skill Arbitrage Radar</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[#1A1A1A]/40">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" />Data from 5 sources</span>
            <span>&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border border-[#1A1A1A]/10 bg-white">
      <CardContent className="p-4 space-y-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#059669]/10">{icon}</div>
        <h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>
        <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
