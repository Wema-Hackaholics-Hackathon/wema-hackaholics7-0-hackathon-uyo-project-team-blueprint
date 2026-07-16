import { UserPlus, CheckCircle, HandCoins, Check, Package } from "@phosphor-icons/react";
import type { DebtorEntry } from "@/store/types";
import { Button } from "@/components/ui/button";

interface DebtorsViewProps {
  debtors: DebtorEntry[];
  onOpenLogDebt: () => void;
  onCollectDebt: (id: number) => void;
  onMarkPaid: (id: number) => void;
}

export function DebtorsView({
  debtors,
  onOpenLogDebt,
  onCollectDebt,
  onMarkPaid,
}: DebtorsViewProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-destructive/20 bg-gradient-to-br from-destructive/5 to-card p-4">
        <div>
          <h3 className="font-bold text-foreground">Debtors Tracker Ledger</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Log custom tabs for local customer credit purchases
          </p>
        </div>
        <Button
          type="button"
          onClick={onOpenLogDebt}
          variant="destructive"
          size="sm"
          className="flex cursor-pointer items-center gap-1 rounded-xl bg-destructive px-3 py-2 text-xs font-bold text-destructive-foreground transition-transform active:scale-95"
        >
          <UserPlus weight="bold" className="h-4 w-4" />
          <span>Log Debt</span>
        </Button>
      </div>

      {/* Active Accounts */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Active Unpaid Balances
        </h4>
        <div className="space-y-3">
          {debtors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              <CheckCircle weight="fill" className="mx-auto mb-1 block h-5 w-5 text-primary" />
              No outstanding customer credit records found!
            </div>
          ) : (
            debtors.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-border bg-card text-xs overflow-hidden"
              >
                {/* Top row: badge + amount */}
                <div className="flex items-start justify-between px-3.5 pt-3.5">
                  <div className="flex-1 min-w-0">
                    <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                      Due: {d.date}
                    </span>
                    <h4 className="mt-1.5 font-bold text-card-foreground">{d.name}</h4>
                  </div>
                  <span className="text-sm font-black text-destructive ml-2 shrink-0">
                    ₦{d.amount.toLocaleString()}
                  </span>
                </div>

                {/* Itemized Purchase List */}
                {d.items.length > 0 && (
                  <div className="mx-3.5 mt-2.5 rounded-lg border border-border/60 bg-muted/20 divide-y divide-border/50 overflow-hidden">
                    <div className="flex items-center gap-1 px-2.5 py-1.5">
                      <Package weight="fill" className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                        Purchased Items
                      </span>
                    </div>
                    {d.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2.5 py-1.5"
                      >
                        <span className="text-[10px] text-card-foreground">
                          {item.qty}× {item.product_name}
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          ₦{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 px-3.5 py-3 mt-1">
                  {/* Collect Debt — primary CTA */}
                  <Button
                    type="button"
                    onClick={() => onCollectDebt(d.id)}
                    size="sm"
                    className="flex-1 cursor-pointer gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[10px] font-bold text-primary-foreground transition-all active:scale-95 hover:bg-primary/90"
                  >
                    <HandCoins weight="fill" className="h-3 w-3" />
                    Collect Debt
                  </Button>

                  {/* Mark Paid — secondary cash clearance */}
                  <Button
                    type="button"
                    onClick={() => onMarkPaid(d.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer gap-1 rounded-lg border-border px-2.5 py-1.5 text-[10px] font-bold text-foreground transition-all active:scale-95"
                  >
                    <Check weight="bold" className="h-3 w-3" />
                    Mark Paid
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
