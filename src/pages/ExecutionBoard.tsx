import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Circle, Clock, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";

const STATUS_CONFIG = {
  backlog: { label: "Backlog", icon: Circle, color: "text-[#1A1A1A]/40" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-amber-500" },
  done: { label: "Done", icon: CheckCircle2, color: "text-[#059669]" },
  blocked: { label: "Blocked", icon: AlertTriangle, color: "text-red-500" },
};

const PRIORITY_COLORS = {
  low: "bg-[#1A1A1A]/5 text-[#1A1A1A]/50",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700",
};

export default function ExecutionBoard() {
  const { isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const utils = trpc.useUtils();
  const { data: tasks, isLoading } = trpc.execution.list.useQuery(undefined, { enabled: isAuthenticated });
  const updateStatus = trpc.execution.updateStatus.useMutation({ onSuccess: () => utils.execution.list.invalidate() });
  const deleteTask = trpc.execution.delete.useMutation({ onSuccess: () => utils.execution.list.invalidate() });
  const createTask = trpc.execution.create.useMutation({ onSuccess: () => { utils.execution.list.invalidate(); setOpen(false); } });

  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" });

  if (!isAuthenticated) return null;
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)}</div></div>;

  const tasksByStatus = {
    backlog: tasks?.filter((t) => t.status === "backlog") ?? [],
    in_progress: tasks?.filter((t) => t.status === "in_progress") ?? [],
    done: tasks?.filter((t) => t.status === "done") ?? [],
    blocked: tasks?.filter((t) => t.status === "blocked") ?? [],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Execution Board</h1>
          <p className="text-xs text-[#1A1A1A]/50 mt-0.5">{tasks?.length ?? 0} tasks · {tasks?.filter((t) => t.status === "done").length ?? 0} completed</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" className="h-7 text-xs bg-[#0F172A]"><Plus className="h-3 w-3 mr-1" />Add Task</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="text-sm">New Task</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="text-sm" />
              <Textarea placeholder="Description (optional)" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="text-sm" />
              <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v })}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="w-full bg-[#0F172A]" onClick={() => createTask.mutate({ title: newTask.title, description: newTask.description || undefined, priority: newTask.priority as "low" | "medium" | "high" | "critical" })} disabled={!newTask.title || createTask.isPending}>Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(STATUS_CONFIG) as Array<[keyof typeof STATUS_CONFIG, typeof STATUS_CONFIG.backlog]>).map(([status, config]) => (
          <div key={status} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <config.icon className={`h-3.5 w-3.5 ${config.color}`} />
              <span className="text-xs font-medium text-[#1A1A1A]/70">{config.label}</span>
              <span className="text-[10px] text-[#1A1A1A]/40 ml-auto">{tasksByStatus[status].length}</span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {tasksByStatus[status].map((task) => (
                <Card key={task.id} className="border border-[#1A1A1A]/10 bg-white hover:border-[#1A1A1A]/20 transition-colors">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-[#0F172A] leading-tight">{task.title}</p>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 shrink-0 text-[#1A1A1A]/30 hover:text-red-500" onClick={() => deleteTask.mutate({ id: task.id })}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                    {task.description && <p className="text-[10px] text-[#1A1A1A]/50 line-clamp-2">{task.description}</p>}
                    <div className="flex items-center justify-between">
                      <Badge className={`text-[9px] ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}`}>{task.priority}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
