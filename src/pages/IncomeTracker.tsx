import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, TrendingUp, Clock, Plus, Trash2 } from "lucide-react";

export default function IncomeTracker() {
  const { isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const utils = trpc.useUtils();
  const { data: logs, isLoading } = trpc.income.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: summary } = trpc.income.summary.useQuery(undefined, { enabled: isAuthenticated });
  const createLog = trpc.income.create.useMutation({ onSuccess: () => { utils.income.list.invalidate(); utils.income.summary.invalidate(); setOpen(false); setForm({ amount: "", source: "", hoursWorked: "", currency: "USD" }); } });
  const deleteLog = trpc.income.delete.useMutation({ onSuccess: () => { utils.income.list.invalidate(); utils.income.summary.invalidate(); } });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", source: "", hoursWorked: "", currency: "USD" });

  if (!isAuthenticated) return null;
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-3 gap-4"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Income Tracker</h1>
          <p className="text-xs text-[#1A1A1A]/50 mt-0.5">Log and analyze your arbitrage earnings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" className="h-7 text-xs bg-[#0F172A]"><Plus className="h-3 w-3 mr-1" />Log Income</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="text-sm">Log Income</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Amount (e.g., 2500)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="text-sm" />
              <Input placeholder="Source (client or platform)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="text-sm" />
              <Input placeholder="Hours worked (optional)" type="number" value={form.hoursWorked} onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })} className="text-sm" />
              <Button size="sm" className="w-full bg-[#0F172A]" onClick={() => createLog.mutate({ amount: Number(form.amount), source: form.source, currency: form.currency, hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : undefined })} disabled={!form.amount || !form.source || createLog.isPending}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Total Income" value={`$${summary?.totalIncome.toFixed(2) ?? "0.00"}`} icon={<DollarSign className="h-4 w-4 text-[#059669]" />} />
        <SummaryCard label="Avg Hourly Rate" value={`$${summary?.avgHourlyRate ?? "0.00"}`} icon={<TrendingUp className="h-4 w-4 text-[#059669]" />} />
        <SummaryCard label="Total Hours" value={String(summary?.totalHours ?? 0)} icon={<Clock className="h-4 w-4 text-[#059669]" />} />
      </div>

      {summary?.monthly && summary.monthly.length > 0 && (
        <Card className="border border-[#1A1A1A]/10 bg-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.monthly.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-xs w-16 text-[#1A1A1A]/60">{m.month}</span>
                  <div className="flex-1 h-4 rounded-full bg-[#F5F0EB] overflow-hidden"><div className="h-full rounded-full bg-[#059669] style={{ width: `${Math.min(100, (m.amount / (summary.totalIncome || 1)) * 100)}%` }}" /></div>
                  <span className="text-xs w-16 text-right font-medium">${m.amount.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-[#1A1A1A]/10 bg-white">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Logs</CardTitle></CardHeader>
        <CardContent>
          {logs?.length ? (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-[#1A1A1A]/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">${log.amount.toFixed(2)} {log.currency}</p>
                    <p className="text-[10px] text-[#1A1A1A]/50">{log.source}{log.hoursWorked ? ` · ${log.hoursWorked} hrs` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#1A1A1A]/40">{new Date(log.loggedAt).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[#1A1A1A]/30 hover:text-red-500" onClick={() => deleteLog.mutate({ id: log.id })}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-[#1A1A1A]/50 text-center py-8">No income logged yet. Start tracking your earnings.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#1A1A1A]/10 bg-white px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#059669]/10">{icon}</div>
      <div><p className="text-lg font-semibold text-[#0F172A]">{value}</p><p className="text-[10px] text-[#1A1A1A]/50">{label}</p></div>
    </div>
  );
}
