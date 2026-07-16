import { createRootRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { List, Bell, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { AiAssistant } from "@/components/ai-assistant";
import { CreditModal } from "@/components/modals/credit-modal";
import { ReportsDrawer } from "@/components/modals/reports-drawer";
import { Modals } from "@/components/modals";
import { useApp } from "@/store/app-context";
import { useWeeklyReport } from "@/lib/query-hooks";
import { cn } from "@/lib/utils";

function RootLayout() {
  const { authenticated, notifications, aiLang, setAiLang, aiLoading, chatLogs, aiChips, submitAiQuery, submitAiVoice } = useApp();
  const { data: weeklyData } = useWeeklyReport();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const isNotifPage = location.pathname === "/notifications";

  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-screen w-full flex-col",
        authenticated &&
          "max-w-[420px] border-x border-slate-100 bg-white shadow-md",
      )}
    >
      {authenticated && (
        <>
          {sidebarOpen && (
            <div className="absolute inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)} />
          )}

          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpenCredit={() => setCreditOpen(true)}
            onOpenReports={() => setReportsOpen(true)}
          />

          {!isNotifPage && (
            <header className="flex shrink-0 items-center justify-between border-b border-border bg-background px-5 py-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                  <List weight="bold" className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="font-display text-lg font-bold tracking-tight text-foreground">Traka</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: "/notifications" })}
                className="relative"
              >
                <Bell weight="fill" className="h-5 w-5 text-muted-foreground" />
                {notifications.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </header>
          )}
        </>
      )}

      <main className={`flex-1 ${authenticated ? "overflow-y-auto p-5 pb-24 no-scrollbar" : ""}`}>
        <Outlet />
      </main>

      {authenticated && (
        <>
          <CreditModal open={creditOpen} onClose={() => setCreditOpen(false)} />

          <ReportsDrawer
            open={reportsOpen}
            onClose={() => setReportsOpen(false)}
            weeklyData={weeklyData ?? null}
          />

          {!aiOpen && !isNotifPage && (
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className="absolute bottom-20 right-5 z-30 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkle weight="fill" className="h-6 w-6" />
            </button>
          )}

          <AiAssistant
            open={aiOpen}
            onClose={() => setAiOpen(false)}
            aiLang={aiLang}
            onSetAiLang={setAiLang}
            aiLoading={aiLoading}
            chips={aiChips}
            chatLogs={chatLogs}
            onSubmitQuery={submitAiQuery}
            onSubmitVoice={submitAiVoice}
          />

          <Modals />

          {!isNotifPage && <BottomNav />}
        </>
      )}
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
