import {
  Wallet,
  Bank,
  CurrencyNgn,
  TrendUp,
  Copy,
  Check,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OnboardingEmptyState } from "@/components/views/onboarding-empty-state";
import type { InventoryItem } from "@/store/types";
import { useState } from "react";

interface DashboardViewProps {
  revenue: number;
  profit: number;
  inventory: InventoryItem[];
  accountName: string;
  accountNumber: string;
  onSimulateTransfer: () => void;
  onOpenCashModal: () => void;
  onNavigateInventory: () => void;
  onAddProduct: (name?: string) => void;
}

export function DashboardView({
  revenue,
  profit,
  inventory,
  accountName,
  accountNumber,
  onSimulateTransfer,
  onOpenCashModal,
  onNavigateInventory,
  onAddProduct,
}: DashboardViewProps) {
  const topTwo = inventory.slice(0, 2);
  const [copied, setCopied] = useState(false);

  const copyNumber = () => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-primary text-primary-foreground rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -right-4 -top-8 text-primary-foreground/10">
          <Bank weight="fill" className="text-[120px]" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] text-primary-foreground/80 font-bold uppercase tracking-wider mb-0.5">
                Store Receiving Account
              </p>
              <h4 className="text-xs font-extrabold text-primary-foreground">{accountName}</h4>
            </div>
            <span className="text-[9px] bg-white/20 text-primary-foreground font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Wema ALAT
            </span>
          </div>
          <div className="flex justify-between items-center mt-4">
            <h2 className="font-mono text-2xl font-bold tracking-widest">{accountNumber}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyNumber}
              className="bg-white/20 hover:bg-white/30 text-primary-foreground rounded-lg"
            >
              {copied ? <Check weight="bold" className="h-4 w-4" /> : <Copy weight="bold" className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {inventory.length === 0 ? (
        <OnboardingEmptyState onAddProduct={onAddProduct} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Today's Revenue"
              value={`₦${revenue.toLocaleString()}`}
              icon={Wallet}
              color="text-primary"
            />
            <MetricCard
              label="Estimated Profit"
              value={`₦${profit.toLocaleString()}`}
              icon={TrendUp}
              color="text-primary"
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-card/40 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Record Sales Transactions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <ActionCard
                icon={Bank}
                label="Incoming Transfer"
                desc="Simulate digital bank notification hook"
                iconBg="bg-primary/10"
                iconColor="text-primary"
                hoverBorder="hover:border-primary/30"
                onClick={onSimulateTransfer}
              />
              <ActionCard
                icon={CurrencyNgn}
                label="Record Cash Sale"
                desc="Manually input hard cash collected"
                iconBg="bg-primary/10"
                iconColor="text-primary"
                hoverBorder="hover:border-primary/30"
                onClick={onOpenCashModal}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Live Inventory Highlight
              </h4>
              <Button
                variant="link"
                size="sm"
                onClick={onNavigateInventory}
                className="text-xs"
              >
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {topTwo.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-card-foreground">{item.name}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Stock Left: {item.qty} units
                    </p>
                  </div>
                  <span className="rounded-md bg-background px-2 py-1 font-semibold text-muted-foreground">
                    ₦{item.selling}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-background p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <h3 className="mt-1 text-xl font-black text-foreground">{value}</h3>
      <Icon weight="fill" className={`absolute -bottom-2 -right-2 text-4xl opacity-5 ${color}`} />
    </div>
  );
}

function ActionCard({ icon: Icon, label, desc, iconBg, iconColor, hoverBorder, onClick }: {
  icon: React.ElementType;
  label: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer flex-col items-start rounded-xl border border-border bg-card p-3 text-left transition-all active:scale-95",
        hoverBorder,
      )}
    >
      <span className={cn("mb-2 rounded-lg p-2 text-sm transition-colors", iconBg, iconColor, "group-hover:bg-primary group-hover:text-primary-foreground")}>
        <Icon weight="fill" className="h-4 w-4" />
      </span>
      <span className="text-xs font-bold text-card-foreground">{label}</span>
      <span className="mt-0.5 text-[10px] text-muted-foreground">{desc}</span>
    </button>
  );
}
