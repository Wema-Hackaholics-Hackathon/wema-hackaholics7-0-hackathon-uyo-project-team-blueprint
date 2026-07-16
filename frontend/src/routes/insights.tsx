import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { ChartLineUp, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <ChartLineUp weight="fill" className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-black text-foreground">Weekly Insights</h2>
        <p className="mt-1 text-xs text-muted-foreground">Your business performance at a glance</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Total Revenue" value="₦145,200" trend="+14%" />
        <Metric label="Net Profit" value="₦32,450" trend="-2%" trendDown />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Daily Sales Pattern</h4>
        <div className="flex items-end justify-between h-24">
          {[
            { day: "M", h: 10 }, { day: "T", h: 14 }, { day: "W", h: 8 },
            { day: "T", h: 20, active: true }, { day: "F", h: 12 },
            { day: "S", h: 10 }, { day: "S", h: 6 },
          ].map((bar) => (
            <div key={bar.day} className="flex flex-col items-center gap-2 w-8">
              <div
                className={`w-3 rounded-full transition-all ${bar.active ? "bg-primary" : "bg-border"}`}
                style={{ height: `${bar.h * 4}px` }}
              />
              <span className={`text-[9px] font-bold ${bar.active ? "text-primary" : "text-muted-foreground"}`}>
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-card p-4 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-foreground">Full Weekly Report</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Download or share via WhatsApp</p>
        </div>
        <Button variant="ghost" size="icon">
          <ArrowRight weight="bold" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Metric({ label, value, trend, trendDown }: { label: string; value: string; trend: string; trendDown?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <h3 className="mt-1 text-lg font-black text-foreground">{value}</h3>
      <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${trendDown ? "text-destructive" : "text-primary"}`}>
        {trendDown ? "↓" : "↑"} {trend}
      </span>
    </div>
  );
}

const insightsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/insights",
  component: InsightsPage,
});

export const Route = insightsRoute;
