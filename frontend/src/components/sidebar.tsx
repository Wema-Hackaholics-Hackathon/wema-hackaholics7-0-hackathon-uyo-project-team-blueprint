import {
  CaretLeft,
  ShieldCheck,
  ChartLineUp,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenCredit: () => void;
  onOpenReports: () => void;
}

export function Sidebar({ open, onClose, onOpenCredit, onOpenReports }: SidebarProps) {
  return (
    <div
      className={`absolute left-0 top-0 z-50 flex h-full w-72 flex-col justify-between border-r border-border bg-card p-6 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
            T
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <CaretLeft weight="bold" className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => { onOpenCredit(); onClose(); }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ShieldCheck weight="fill" className="h-5 w-5 text-primary" />
            <span>Credit Score & Profile</span>
          </button>
          <button
            type="button"
            onClick={() => { onOpenReports(); onClose(); }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ChartLineUp weight="fill" className="h-5 w-5 text-emerald-600" />
            <span>Weekly Reports</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-secondary/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Active Merchant
        </p>
        <p className="mt-0.5 text-sm font-bold text-foreground">
          Dele Provision Stores
        </p>
        <p className="mt-1 flex items-center text-xs text-primary">
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Verified Setup
        </p>
      </div>
    </div>
  );
}
