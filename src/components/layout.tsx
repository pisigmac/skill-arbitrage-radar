import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Radar, LayoutDashboard, Kanban, DollarSign, UserCircle, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/board", label: "Execution", icon: Kanban },
  { path: "/income", label: "Income", icon: DollarSign },
  { path: "/profile", label: "Profile", icon: UserCircle },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 border-b border-[#1A1A1A]/10 bg-[#F5F0EB]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-[#059669]" />
              <span className="text-sm font-semibold tracking-tight text-[#0F172A]">Skill Arbitrage Radar</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {isAuthenticated && NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${isActive ? "bg-[#0F172A] text-white" : "text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5"}`}>
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <span className="hidden sm:inline text-xs text-[#1A1A1A]/60">{user?.name ?? user?.email ?? "User"}</span>
                  <Button variant="ghost" size="sm" onClick={logout} className="h-7 px-2 text-xs text-[#1A1A1A]/60 hover:text-[#1A1A1A]">
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </>
              ) : (
                <Link to="/login"><Button size="sm" className="h-7 px-3 text-xs bg-[#0F172A] hover:bg-[#0F172A]/90">Sign In</Button></Link>
              )}
              <Button variant="ghost" size="sm" className="md:hidden h-7 px-2" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        {mobileOpen && isAuthenticated && (
          <div className="md:hidden border-t border-[#1A1A1A]/10 px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-[#1A1A1A]/70">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}
