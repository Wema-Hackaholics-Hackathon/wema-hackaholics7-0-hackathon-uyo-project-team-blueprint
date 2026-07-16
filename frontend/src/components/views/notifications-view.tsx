import {
  ArrowLeft,
  Bell,
  Info,
  CashRegister,
  ClockUser,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/store/types";

interface NotificationsViewProps {
  notifications: Notification[];
  onClose: () => void;
}

export function NotificationsView({ notifications, onClose }: NotificationsViewProps) {
  const colorMap: Record<Notification["type"], { bg: string; text: string; icon: typeof Info }> = {
    system: { bg: "bg-primary/10", text: "text-primary", icon: Info },
    sale: { bg: "bg-primary/10", text: "text-primary", icon: CashRegister },
    credit: { bg: "bg-destructive/10", text: "text-destructive", icon: ClockUser },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-full border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft weight="bold" className="h-4 w-4" />
        </button>
        <h2 className="font-black text-xl text-foreground">Activity Logs</h2>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
            <Bell weight="fill" className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            No activities yet
          </div>
        ) : (
          notifications.map((n) => {
            const { bg, text, icon: Icon } = colorMap[n.type];
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5"
              >
                <div className={cn("shrink-0 rounded-lg p-2 text-xs", bg, text)}>
                  <Icon weight="fill" className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="truncate text-xs font-bold text-card-foreground">
                      {n.title}
                    </h4>
                    <span className="ml-1 shrink-0 text-[9px] text-muted-foreground">
                      {n.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {n.desc}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
