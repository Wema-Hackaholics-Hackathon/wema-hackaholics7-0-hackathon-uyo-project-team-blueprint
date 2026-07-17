import { ArrowsLeftRight, CurrencyNgn, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import type { UnallocatedTransactionResponse } from "@/lib/endpoints";

interface TransactionsViewProps {
  transactions: UnallocatedTransactionResponse[];
}

function statusConfig(status: string) {
  switch (status) {
    case "unallocated":
      return { label: "Pending", color: "text-amber-700 bg-amber-100 border-amber-200" };
    case "reconciled":
      return { label: "Reconciled", color: "text-emerald-700 bg-emerald-100 border-emerald-200" };
    default:
      return { label: status, color: "text-muted-foreground bg-muted border-border" };
  }
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function TransactionsView({ transactions }: TransactionsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-gradient-to-br from-primary/5 to-card p-4">
        <div>
          <h3 className="font-bold text-foreground">Transaction History</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            All sales, transfers, and reconciliations
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ArrowsLeftRight weight="bold" className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Recent Activity
        </h4>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <CircleNotch weight="duotone" className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground">No transactions yet</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">
                Sales and transfers will appear here.
              </p>
            </div>
          ) : (
            transactions.map((tx) => {
              const badge = statusConfig(tx.status);
              return (
                <div
                  key={tx.id}
                  className="rounded-xl border border-border bg-card text-xs overflow-hidden"
                >
                  <div className="flex items-start justify-between p-3.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                        {tx.title && (
                          <span className="text-[10px] font-semibold text-foreground">
                            {tx.title}
                          </span>
                        )}
                      </div>
                      {tx.details && (
                        <p className="mt-1.5 text-[10px] text-muted-foreground truncate">
                          {tx.details}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{formatDateTime(tx.created_at)}</span>
                        {tx.sender_name && <span>— {tx.sender_name}</span>}
                        {tx.channel && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] uppercase">
                            {tx.channel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 text-right shrink-0">
                      <span className="font-mono text-sm font-black text-foreground">
                        ₦{tx.amount.toLocaleString()}
                      </span>
                      {tx.profit != null && tx.profit > 0 && (
                        <p className="mt-0.5 text-[9px] font-semibold text-emerald-600">
                          +₦{tx.profit.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
